"use client"

import { useEffect, useState } from "react"

const TOAST_TIMEOUT = 5000

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function toast({ title, description, variant = "default" }: ToastProps) {
  // Create a custom event
  const event = new CustomEvent("toast", {
    detail: {
      title,
      description,
      variant,
    },
  })

  // Dispatch the event
  document.dispatchEvent(event)
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])

  useEffect(() => {
    const handleToast = (e: Event) => {
      const { title, description, variant } = (e as CustomEvent).detail

      const id = Math.random().toString(36).substring(2, 9)

      setToasts((prev) => [...prev, { id, title, description, variant }])

      // Auto dismiss after timeout
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, TOAST_TIMEOUT)
    }

    document.addEventListener("toast", handleToast)

    return () => {
      document.removeEventListener("toast", handleToast)
    }
  }, [])

  return {
    toasts,
    dismiss: (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    },
  }
}
