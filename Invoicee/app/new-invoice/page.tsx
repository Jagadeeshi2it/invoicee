'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useInvoices } from '../context/InvoiceContext'
import { useFormContext } from '../context/FormContext'
import { useFormNavigation } from '../hooks/useFormNavigation'
import { AlertModal } from '../components/AlertModal'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Item = {
  id: string;
  name: string;
  rate: number;
}

type InvoiceItem = {
  itemId: string;
  name: string;
  rate: number;
  quantity: number;
}

export default function NewInvoice() {
  const router = useRouter()
  const { addInvoice } = useInvoices()
  const { isFormDirty, setIsFormDirty } = useFormContext()
  const { showModal, handleNavigation, confirmNavigation, cancelNavigation } = useFormNavigation()
  const [customerName, setCustomerName] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [taxPercentage, setTaxPercentage] = useState(0)
  const [notes, setNotes] = useState('')
  const [terms, setTerms] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessLocation, setBusinessLocation] = useState('')
  const [managedItems, setManagedItems] = useState<Item[]>([])

  useEffect(() => {
    const savedDetails = localStorage.getItem('companyDetails')
    if (savedDetails) {
      const details = JSON.parse(savedDetails)
      setBusinessName(details.name || '')
      setBusinessLocation(details.address || '')
    }

    const savedItems = localStorage.getItem('managedItems')
    if (savedItems) {
      setManagedItems(JSON.parse(savedItems))
    }
  }, [])

  useEffect(() => {
    const isAnyFieldFilled = 
      customerName !== '' || 
      customerAddress !== '' || 
      invoiceNumber !== '' || 
      dueDate !== '' || 
      items.length > 0 || 
      taxPercentage !== 0 || 
      notes !== '' || 
      terms !== ''
    setIsFormDirty(isAnyFieldFilled)
  }, [customerName, customerAddress, invoiceNumber, dueDate, items, taxPercentage, notes, terms, setIsFormDirty])

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

  const handleAddItem = () => {
    setItems([...items, { itemId: '', name: '', rate: 0, quantity: 1 }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    if (field === 'itemId') {
      const selectedItem = managedItems.find(item => item.id === value)
      if (selectedItem) {
        newItems[index] = {
          ...newItems[index],
          itemId: selectedItem.id,
          name: selectedItem.name,
          rate: selectedItem.rate
        };
      }
    } else if (field === 'rate') {
      newItems[index] = { ...newItems[index], [field]: parseFloat(value as string) || 0 };
    } else if (field === 'quantity') {
      newItems[index] = { ...newItems[index], [field]: parseInt(value as string) || 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newInvoice = {
      id: Date.now(),
      number: invoiceNumber,
      customerName,
      customerAddress,
      date: invoiceDate,
      dueDate,
      items,
      taxPercentage,
      notes,
      terms,
      businessName,
      businessLocation
    }
    addInvoice(newInvoice)
    setIsFormDirty(false)
    router.push('/')
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.rate * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * (taxPercentage / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="businessLocation">Business Location</Label>
                  <Input
                    id="businessLocation"
                    value={businessLocation}
                    onChange={(e) => setBusinessLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddress">Customer Address</Label>
                  <Input
                    id="customerAddress"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            {items.map((item, index) => (
              <div key={index} className="flex items-end space-x-4 mb-4">
                <div className="flex-grow">
                  <Label htmlFor={`itemName-${index}`}>Item Name</Label>
                  <Select
                    value={item.itemId}
                    onValueChange={(value) => handleItemChange(index, 'itemId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {managedItems.map((managedItem) => (
                        <SelectItem key={managedItem.id} value={managedItem.id}>
                          {managedItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24">
                  <Label htmlFor={`itemRate-${index}`}>Rate</Label>
                  <Input
                    id={`itemRate-${index}`}
                    type="text"
                    value={item.rate.toFixed(2)}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        handleItemChange(index, 'rate', value === '' ? 0 : parseFloat(value));
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value);
                      handleItemChange(index, 'rate', isNaN(value) ? 0 : Number(value.toFixed(2)));
                    }}
                    className="text-right"
                  />
                </div>
                <div className="w-24">
                  <Label htmlFor={`itemQuantity-${index}`}>Quantity</Label>
                  <Input
                    id={`itemQuantity-${index}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddItem} className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="taxPercentage">Tax Percentage</Label>
                <Input
                  id="taxPercentage"
                  type="number"
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Subtotal: ₹{calculateSubtotal().toFixed(2)}</p>
              <p className="text-sm text-gray-500">Tax: ₹{calculateTax().toFixed(2)}</p>
              <p className="text-lg font-semibold">Total: ₹{calculateTotal().toFixed(2)}</p>
            </div>
            <Button type="submit">Generate Invoice</Button>
          </CardFooter>
        </Card>
      </form>
      <AlertModal
        isOpen={showModal}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </>
  )
}

