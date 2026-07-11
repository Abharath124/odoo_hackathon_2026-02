import { Toaster, toast } from 'react-hot-toast'

function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          fontSize: '14px',
          borderRadius: '10px',
          padding: '12px 16px',
        },
        success: {
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          iconTheme: {
            primary: '#16a34a',
            secondary: '#f0fdf4',
          },
        },
        error: {
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
          iconTheme: {
            primary: '#dc2626',
            secondary: '#fef2f2',
          },
        },
      }}
    />
  )
}

export const showSuccess = (message) => toast.success(message)
export const showError = (message) => toast.error(message)
export const showWarning = (message) => toast(message, {
  icon: '⚠️',
  style: {
    fontSize: '14px',
    borderRadius: '10px',
    padding: '12px 16px',
    background: '#fffbeb',
    color: '#92400e',
    border: '1px solid #fde68a',
  },
})

export default ToastProvider
