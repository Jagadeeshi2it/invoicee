'use client'

import React, { createContext, useState, useContext } from 'react'

type FormContextType = {
  isFormDirty: boolean
  setIsFormDirty: (isDirty: boolean) => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [isFormDirty, setIsFormDirty] = useState(false)

  return (
    <FormContext.Provider value={{ isFormDirty, setIsFormDirty }}>
      {children}
    </FormContext.Provider>
  )
}

export function useFormContext() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}

