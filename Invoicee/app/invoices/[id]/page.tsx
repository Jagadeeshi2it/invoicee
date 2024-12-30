'use client'

import { useParams, useRouter } from 'next/navigation'
import { useInvoices } from '../../context/InvoiceContext'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'

export default function InvoiceDetails() {
  const router = useRouter()
  const { id } = useParams()
  const { invoices } = useInvoices()

  const invoice = invoices.find(inv => inv.id === parseInt(id as string))

  const [companyLogo, setCompanyLogo] = useState<string | null>(null)

  useEffect(() => {
    const savedDetails = localStorage.getItem('companyDetails')
    if (savedDetails) {
      const details = JSON.parse(savedDetails)
      setCompanyLogo(details.logo || null)
    }
  }, [])

  if (!invoice) {
    return <div>Invoice not found</div>
  }

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + item.rate * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * (invoice.taxPercentage / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background text-foreground shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          {companyLogo ? (
            <img src={companyLogo} alt="Company Logo" className="h-16 w-auto" />
          ) : (
            <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-lg">
              <span className="text-lg font-semibold text-muted-foreground">
                {invoice.businessName?.charAt(0) || 'C'}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
          <Button>
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div>
          <p className="text-sm text-muted-foreground mb-1">From</p>
          <p className="text-lg font-semibold">{invoice.businessName || 'Business Name Not Set'}</p>
          <p className="text-sm text-muted-foreground">{invoice.businessLocation || 'Business Location Not Set'}</p>
          {invoice.businessEmail && <p className="text-sm text-muted-foreground">{invoice.businessEmail}</p>}
          {invoice.businessPhone && <p className="text-sm text-muted-foreground">{invoice.businessPhone}</p>}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">To</p>
          <p className="text-lg font-semibold">{invoice.customerName}</p>
          <p className="text-sm text-muted-foreground">{invoice.customerAddress}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Invoice Number</p>
          <p className="text-lg font-semibold">{invoice.number}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Invoice Date</p>
          <p className="text-lg font-semibold">{invoice.date}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Due Date</p>
          <p className="text-lg font-semibold">{invoice.dueDate}</p>
        </div>
        <div></div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 text-sm text-muted-foreground">Item</th>
            <th className="text-right py-3 text-sm text-muted-foreground">Rate</th>
            <th className="text-right py-3 text-sm text-muted-foreground">Quantity</th>
            <th className="text-right py-3 text-sm text-muted-foreground">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b border-border">
              <td className="py-4">{item.name}</td>
              <td className="text-right py-4">₹{item.rate.toFixed(2)}</td>
              <td className="text-right py-4">{item.quantity}</td>
              <td className="text-right py-4">₹{(item.rate * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Tax ({invoice.taxPercentage}%):</span>
            <span>₹{calculateTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-semibold border-t border-border">
            <span>Total:</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-muted-foreground">{invoice.notes}</p>
        </div>
      )}

      {invoice.terms && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Terms and Conditions</h2>
          <p className="text-muted-foreground">{invoice.terms}</p>
        </div>
      )}
    </div>
  )
}

