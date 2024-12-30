'use client'

import { useState, useEffect } from 'react'
import { useFormContext } from '../context/FormContext'
import { useFormNavigation } from '../hooks/useFormNavigation'
import { AlertModal } from '../components/AlertModal'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function Settings() {
  const [companyName, setCompanyName] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyLogo, setCompanyLogo] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { toast } = useToast()
  const { isFormDirty, setIsFormDirty } = useFormContext()
  const { showModal, handleNavigation, confirmNavigation, cancelNavigation } = useFormNavigation()

  useEffect(() => {
    // Load company details from localStorage
    const savedDetails = localStorage.getItem('companyDetails')
    if (savedDetails) {
      const details = JSON.parse(savedDetails)
      setCompanyName(details.name || '')
      setCompanyAddress(details.address || '')
      setCompanyPhone(details.phone || '')
      setCompanyEmail(details.email || '')
      setCompanyLogo(details.logo || '')
    }
  }, [])

  useEffect(() => {
    const isAnyFieldChanged = 
      companyName !== '' || 
      companyAddress !== '' || 
      companyPhone !== '' || 
      companyEmail !== '' || 
      companyLogo !== '' || 
      websiteUrl !== ''
    setIsFormDirty(isAnyFieldChanged)
  }, [companyName, companyAddress, companyPhone, companyEmail, companyLogo, websiteUrl, setIsFormDirty])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isFormDirty])

  const fetchWebsiteData = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await fetch(`/api/fetch-company-data?domain=${encodeURIComponent(websiteUrl)}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch data')
      }
      const data = await response.json()
      setCompanyName(data.name || '')
      setCompanyAddress(data.location || '')
      setCompanyPhone(data.phone || '')
      setCompanyEmail(data.email || '')
      setCompanyLogo(data.logo || '')
      toast({
        title: "Company data fetched successfully",
        description: "The form has been populated with the retrieved data.",
      })
    } catch (error) {
      console.error('Error fetching company data:', error)
      setErrorMessage(`Failed to fetch company data: ${error.message}`)
      toast({
        title: "Error",
        description: `Failed to fetch company data: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const companyDetails = {
      name: companyName,
      address: companyAddress,
      phone: companyPhone,
      email: companyEmail,
      logo: companyLogo
    }
    localStorage.setItem('companyDetails', JSON.stringify(companyDetails))
    setIsFormDirty(false)
    toast({
      title: "Success",
      description: "Company details saved successfully!",
    })
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Settings</CardTitle>
            <div className="mt-4 space-y-2">
              <Label htmlFor="websiteUrl">Company Website</Label>
              <div className="flex space-x-2">
                <Input
                  id="websiteUrl"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="example.com"
                />
                <Button 
                  onClick={fetchWebsiteData} 
                  disabled={isLoading || !websiteUrl}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Fetch Data'}
                </Button>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input
                  id="companyPhone"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="companyLogo">Company Logo</Label>
                <Input
                  id="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={isLoading}
                />
                {companyLogo && (
                  <img src={companyLogo} alt="Company Logo" className="mt-2 max-w-xs" />
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="button" onClick={handleSubmit} disabled={isLoading}>Save Company Details</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <AlertModal
        isOpen={showModal}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </>
  )
}

