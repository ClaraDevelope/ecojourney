'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // ✅ Importamos useRouter
import { TrashIcon } from '@heroicons/react/24/outline'
import { apiFetch } from '@/utils/api'
import DeleteConfirmationModal from './deleteConfirmationModal'
import ErrorModal from '@/components/ErrorModal/ErrorModal'
import SuccessModal from '@/components/SuccessModal/SuccessModal'
import { useSession } from 'next-auth/react'

interface DeleteRouteButtonProps {
  routeId: string
  onDeleteSuccess?: () => void
}

const DeleteRouteButton: React.FC<DeleteRouteButtonProps> = ({
  routeId,
  onDeleteSuccess
}) => {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await apiFetch(`/routes/${routeId}`, {
        method: 'DELETE',
        token: session?.user?.email ?? undefined
      })

      setSuccessMessage('Ruta eliminada correctamente')

      setTimeout(() => {
        router.push('/mis-rutas')
      }, 3000)

      onDeleteSuccess?.()
    } catch (error) {
      console.error('❌ Error eliminando la ruta:', error)
      setErrorMessage(
        'No se pudo eliminar la ruta. Es posible que esté vinculada a publicaciones.'
      )
    } finally {
      setLoading(false)
      setShowModal(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        role='button'
        title='Eliminar ruta'
        aria-label='Eliminar ruta'
        className='flex items-center gap-2 bg-gray-700 text-gray-200 hover:bg-red-800 hover:text-white hover:border-red-800 px-4 py-2 rounded-sm transition-all duration-200 mt-2 text-sm disabled:opacity-50 focus:ring-2 focus:ring-red-500 focus:outline-none'
      >
        {loading ? (
          'Eliminando...'
        ) : (
          <>
            <TrashIcon className='w-4 h-4' /> Eliminar ruta
          </>
        )}
      </button>

      {showModal && (
        <DeleteConfirmationModal
          message='¿Seguro que quieres eliminar esta ruta? Esta acción no se puede deshacer.'
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
        />
      )}
      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </>
  )
}

export default DeleteRouteButton
