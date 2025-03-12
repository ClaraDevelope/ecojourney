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
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[999999]'>
      <div className='bg-gray-800 text-white p-6 rounded-md shadow-lg w-full max-w-md border border-gray-600'>
        <h2 className='text-lg font-semibold text-red-400'>
          ⚠️ Confirmar eliminación
        </h2>
        <p className='mt-2 text-sm'>{message}</p>
        <div className='flex justify-end gap-3 mt-4'>
          <button
            className='bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-sm transition-all'
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className='bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-sm transition-all'
            onClick={onConfirm}
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
