'use client'

interface DeleteConfirmationModalProps {
  message: string
  onClose: () => void
  onConfirm: () => void
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  message,
  onClose,
  onConfirm
}) => {
  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[999999]'
      role='dialog'
      aria-modal='true'
      aria-labelledby='confirm-delete-title'
      aria-describedby='confirm-delete-description'
    >
      <div className='bg-gray-800 text-white p-6 rounded-md shadow-lg w-full max-w-md border border-gray-600'>
        <h2
          id='confirm-delete-title'
          className='text-lg font-semibold text-red-400'
        >
          ⚠️ Confirmar eliminación
        </h2>
        <p id='confirm-delete-description' className='mt-2 text-sm'>
          {message}
        </p>
        <div className='flex justify-end gap-3 mt-4'>
          <button
            className='bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-sm transition-all'
            onClick={onClose}
            aria-label='Cancelar eliminación'
            title='Cancelar'
          >
            Cancelar
          </button>
          <button
            className='bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-sm transition-all'
            onClick={onConfirm}
            aria-label='Confirmar eliminación'
            title='Eliminar'
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
