'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Settings, LogOut, ClipboardList, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'

export function SideMenu() {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <>
      <div className={`bg-card border-r transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-start items-center"> {/* Update 1: Left-aligned logo */}
            <Link href="/">
              {isCollapsed ? (
                <span className="text-xl font-bold text-primary cursor-pointer">Inv</span>
              ) : (
                <span className="text-2xl font-bold text-primary cursor-pointer">Invoicee</span>
              )}
            </Link>
          </div>
          <nav className="flex-1">
            <ul className="space-y-2 p-2">
              <li>
                <Link href="/manage-items">
                  <Button variant="ghost" className={`w-full ${isCollapsed ? 'px-2 justify-center' : 'justify-start'}`}>
                    <ClipboardList className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
                    {!isCollapsed && <span>Manage Items</span>}
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/settings">
                  <Button variant="ghost" className={`w-full ${isCollapsed ? 'px-2 justify-center' : 'justify-start'}`}>
                    <Settings className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
                    {!isCollapsed && <span>Settings</span>}
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 space-y-2">
            <ModeToggle>
              {(theme) => (
                <Button variant="ghost" className={`w-full ${isCollapsed ? 'px-2 justify-center' : 'justify-start'}`}>
                  {isCollapsed ? (
                    theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
                  ) : (
                    <>
                      {theme === 'light' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                      <span>{theme === 'light' ? 'Light' : 'Dark'} Mode</span>
                    </>
                  )}
                </Button>
              )}
            </ModeToggle>
            <Button variant="ghost" className={`w-full ${isCollapsed ? 'px-2 justify-center' : 'justify-start'}`}>
              <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </div>
          <Button
            variant="ghost"
            className={`w-full ${isCollapsed ? 'px-2 justify-center' : 'justify-start'}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}

