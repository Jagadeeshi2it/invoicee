'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useInvoices } from './context/InvoiceContext'

export default function Home() {
  const { invoices } = useInvoices()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateTotal = (invoice) => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.rate * item.quantity, 0)
    const tax = subtotal * (invoice.taxPercentage / 100)
    return subtotal + tax
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Link href="/new-invoice">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Invoice
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-hidden">
            {filteredInvoices.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No invoices found</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <li key={invoice.id}>
                    <Link href={`/invoices/${invoice.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {invoice.number}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {invoice.customerName}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              ₹{calculateTotal(invoice).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {invoice.businessName}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              {new Date(invoice.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

