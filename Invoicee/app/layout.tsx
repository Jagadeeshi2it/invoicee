import './globals.css'
import { Inter } from 'next/font/google'
import { InvoiceProvider } from './context/InvoiceContext'
import { FormProvider } from './context/FormContext'
import { ThemeProvider } from '@/components/theme-provider'
import { SideMenu } from '@/components/SideMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Invoicee - Invoice Generator',
  description: 'Generate and manage invoices seamlessly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <InvoiceProvider>
            <FormProvider>
              <div className="flex h-screen bg-background text-foreground">
                <SideMenu />
                <div className="flex-1 overflow-auto">
                  <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                  </main>
                </div>
              </div>
            </FormProvider>
          </InvoiceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

