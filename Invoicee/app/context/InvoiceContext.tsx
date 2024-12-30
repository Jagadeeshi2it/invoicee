'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type InvoiceItem = {
  name: string
  rate: number
  quantity: number
}

type Invoice = {
  id: number
  number: string
  customerName: string
  customerAddress: string
  date: string
  dueDate: string
  items: InvoiceItem[]
  taxPercentage: number
  notes: string
  terms: string
  businessName: string
  businessLocation: string
}

type InvoiceContextType = {
  invoices: Invoice[]
  addInvoice: (invoice: Invoice) => void
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined)

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    const storedInvoices = localStorage.getItem('invoices')
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices))
    }
  }, [])

  const addInvoice = (invoice: Invoice) => {
    const updatedInvoices = [...invoices, invoice]
    setInvoices(updatedInvoices)
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices))
  }

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoices() {
  const context = useContext(InvoiceContext)
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider')
  }
  return context
}

