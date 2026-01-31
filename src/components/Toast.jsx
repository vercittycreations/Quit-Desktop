// src/components/Toast.jsx
import { useEffect } from 'react'
import './Toast.css'

export default function Toast({
  message,
  type = 'success',   // success | error | info
  duration = 3000,    // auto hide time
  onClose
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!message) return null

  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  )
}
