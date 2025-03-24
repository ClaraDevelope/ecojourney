'use client'

import { useEffect } from 'react'

interface ErrorModalProps {
  message: string
  onClose: () => void
}

export default function ErrorModal({ message, onClose }: ErrorModalProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer) // Limpia el temporizador si el usuario lo cierra antes
  }, [onClose])

  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[999999]'
      role='dialog'
      aria-modal='true'
      aria-labelledby='warning-title'
      aria-describedby='warning-description'
    >
      <div className='bg-gray-800 text-white p-6 rounded-md shadow-lg w-full max-w-md border border-gray-600'>
        <h2
          id='warning-title'
          className='text-lg font-semibold flex items-center gap-2 text-yellow-400'
        >
          ⚠️ Aviso
        </h2>
        <p id='warning-description' className='mt-2 text-sm text-gray-300'>
          {message}
        </p>
        <div className='flex justify-end mt-4'>
          <button
            className='bg-gray-700 text-white py-2 px-4 rounded-sm transition-all hover:bg-gray-600'
            onClick={onClose}
            aria-label='Cerrar aviso'
            title='Cerrar'
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
