'use client'

import { useState, useEffect } from 'react'
import { useFormContext } from '../context/FormContext'
import { useFormNavigation } from '../hooks/useFormNavigation'
import { AlertModal } from '../components/AlertModal'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import * as XLSX from 'xlsx'

type Item = {
  id: string;
  name: string;
  rate: number;
}

export default function ManageItems() {
  const [items, setItems] = useState<Item[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemRate, setNewItemRate] = useState<string>('')
  const { toast } = useToast()
  const { setIsFormDirty, isFormDirty } = useFormContext()
  const { showModal, handleNavigation, confirmNavigation, cancelNavigation } = useFormNavigation()

  useEffect(() => {
    const savedItems = localStorage.getItem('managedItems')
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
  }, [])

  useEffect(() => {
    const isAnyFieldChanged = items.length > 0 || newItemName !== '' || newItemRate !== ''
    setIsFormDirty(isAnyFieldChanged)
  }, [items, newItemName, newItemRate, setIsFormDirty])

  const saveItems = (updatedItems: Item[]) => {
    localStorage.setItem('managedItems', JSON.stringify(updatedItems))
    setItems(updatedItems)
    setIsFormDirty(false)
  }

  const addItem = () => {
    if (newItemName && newItemRate) {
      const newItem: Item = {
        id: Date.now().toString(),
        name: newItemName,
        rate: parseFloat(newItemRate) || 0
      }
      const updatedItems = [...items, newItem]
      saveItems(updatedItems)
      setNewItemName('')
      setNewItemRate('')
    }
  }

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id)
    saveItems(updatedItems)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)
        const importedItems: Item[] = json.map((row: any) => {
          // Check for various possible column names for item name
          const name = row.name || row.Name || row.ITEM || row.Item || row['Item Name'] || row['ITEM NAME']
          // Check for various possible column names for rate
          const rate = row.rate || row.Rate || row.RATE || row.Price || row.PRICE || 0

          if (!name) {
            console.warn('Row with missing name:', row)
          }

          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: name ? String(name).trim() : 'Unnamed Item',
            rate: typeof rate === 'number' ? rate : parseFloat(rate) || 0
          }
        })
        saveItems([...items, ...importedItems])
        toast({
          title: "Import Successful",
          description: `${importedItems.length} items imported from Excel file.`,
        })
        // Reset the file input
        event.target.value = ''
      }
      reader.readAsArrayBuffer(file)
    }
  }

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

  return (
    <>
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Manage Items</CardTitle>
            <Input
              id="excelUpload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" onClick={() => document.getElementById('excelUpload')?.click()}>
              Import Items
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 w-full mb-6">
              <div className="flex-grow">
                <Label htmlFor="newItemName">Item Name</Label>
                <Input
                  id="newItemName"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Enter item name"
                />
              </div>
              <div className="w-32">
                <Label htmlFor="newItemRate">Rate</Label>
                <Input
                  id="newItemRate"
                  type="number"
                  value={newItemRate}
                  onChange={(e) => setNewItemRate(e.target.value)}
                  placeholder="Enter rate"
                />
              </div>
              <Button className="mt-auto" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <Input value={item.name} readOnly />
                  <Input value={item.rate.toFixed(2)} readOnly />
                  <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)} className="w-10 h-10 flex items-center justify-center">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
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

