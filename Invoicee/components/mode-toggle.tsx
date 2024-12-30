"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle({ children }: { children?: React.ReactNode | ((theme: string) => React.ReactNode) }) {
  const { theme, setTheme } = useTheme()

  return (
    <div onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {typeof children === 'function' ? children(theme || 'light') : children || (
        <Button variant="ghost" className="w-full justify-start">
          {theme === "light" ? "Light Mode" : "Dark Mode"}
        </Button>
      )}
    </div>
  )
}

