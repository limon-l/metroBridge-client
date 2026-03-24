import { useState } from 'react'
import ToastContext from '../../hooks/toastContext'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showToast = (message, type = 'success') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => removeToast(id), 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-card px-4 py-3 text-small font-medium text-white shadow-soft ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
