'use client'

import { useEffect } from 'react'

interface SuccessModalProps {
  message: string
  onClose: () => void
}

export default function SuccessModal({ message, onClose }: SuccessModalProps) {
  // Cierra el modal automáticamente después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[999999]'>
      <div className='bg-gray-800 text-white p-6 rounded-md shadow-lg w-full max-w-md border border-gray-600'>
        <h2 className='text-lg font-semibold flex items-center gap-2 text-green-400'>
          ✅ ¡Genial!
        </h2>
        <p className='mt-2 text-sm text-gray-300'>{message}</p>
        <div className='flex justify-end mt-4'>
          <button
            className='bg-gray-700 text-white py-2 px-4 rounded-sm transition-all hover:bg-gray-600'
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
