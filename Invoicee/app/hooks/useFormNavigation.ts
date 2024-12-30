'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormContext } from '../context/FormContext'

export function useFormNavigation() {
  const [showModal, setShowModal] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const router = useRouter()
  const { isFormDirty, setIsFormDirty } = useFormContext()

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

  const handleNavigation = (url: string) => {
    if (isFormDirty) {
      setShowModal(true)
      setPendingUrl(url)
    } else {
      router.push(url)
    }
  }

  const confirmNavigation = () => {
    setIsFormDirty(false)
    setShowModal(false)
    if (pendingUrl) {
      router.push(pendingUrl)
    }
  }

  const cancelNavigation = () => {
    setShowModal(false)
    setPendingUrl(null)
  }

  return {
    showModal,
    handleNavigation,
    confirmNavigation,
    cancelNavigation
  }
}

