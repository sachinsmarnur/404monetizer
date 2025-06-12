"use client"

import * as React from "react"

const TOAST_TIMEOUT = 5000

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

interface ToastContext {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContext | undefined>(undefined)

// Global toast manager for calling outside components
let globalToastFunction: ((toast: Omit<Toast, "id">) => void) | null = null

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback(({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, description, variant }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, TOAST_TIMEOUT)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Set global toast function when provider mounts
  React.useEffect(() => {
    globalToastFunction = toast
    return () => {
      globalToastFunction = null
    }
  }, [toast])

  const contextValue = React.useMemo(() => ({
    toasts,
    toast,
    dismiss,
  }), [toasts, toast, dismiss])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Global toast function that can be called from anywhere
export const toast = (props: Omit<Toast, "id">) => {
  if (typeof window !== "undefined" && globalToastFunction) {
    globalToastFunction(props)
  } else if (process.env.NODE_ENV === 'development') {
    console.warn("Toast was called before ToastProvider was initialized or on server side")
  }
} 