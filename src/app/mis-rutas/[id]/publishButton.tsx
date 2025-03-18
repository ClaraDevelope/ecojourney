'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/solid'
import ErrorModal from '@/components/ErrorModal/ErrorModal'
import PostModal from '@/components/PostModal/postModal'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

interface PublishRouteProps {
  routeData: {
    _id: string
    origin: { name: string }
    destination: { name: string }
    public: boolean
  }
  initialPublicState: boolean
  setRefreshTrigger: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PublishRoute({
  routeData,
  setRefreshTrigger
}: PublishRouteProps) {
  const { data: session } = useSession()
  const [isPublic, setIsPublic] = useState(routeData.public)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPostModal, setShowPostModal] = useState(false)

  const routeName = `${routeData.origin.name} - ${routeData.destination.name}`

  console.log('📌 Datos de la ruta:', {
    routeId: routeData._id,
    routeOrigin: routeData.origin.name,
    routeDestination: routeData.destination.name
  })

  const togglePublish = async () => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/routes/${routeData._id}/toggle-visibility`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.email}`
          }
        }
      )

      if (!res.ok)
        throw new Error('Error al actualizar la visibilidad de la ruta')

      const data = await res.json()
      setIsPublic(data.public)
      setRefreshTrigger((prev) => !prev)
      setIsModalOpen(false)

      if (data.public) {
        setTimeout(() => setShowPostModal(true), 500)
      }
    } catch (err) {
      setError('No se pudo actualizar la visibilidad. Inténtalo de nuevo.')
      console.error('🚨 Error cambiando la visibilidad de la ruta:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}

      <button
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-sm transition-all ${
          isPublic
            ? 'bg-gray-700 hover:bg-gray-900 text-white'
            : 'bg-gray-700 hover:bg-gray-900 text-gray-200'
        }`}
        title={isPublic ? 'Hacer ruta privada' : 'Publicar ruta'}
        onClick={() => setIsModalOpen(true)}
      >
        {isPublic ? (
          <EyeSlashIcon className='w-5 h-5' />
        ) : (
          <EyeIcon className='w-5 h-5' />
        )}
        {isPublic ? 'Hacer privada' : 'Publicar Ruta'}
      </button>

      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[999999999999999999999999999]'>
          <div className='bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-md border border-gray-600'>
            <h2 className='text-lg font-semibold text-white flex items-center gap-2'>
              <ExclamationTriangleIcon className='w-6 h-6 text-yellow-400' />
              {isPublic
                ? '¿Hacer esta ruta privada?'
                : '¿Estás seguro de publicar esta ruta?'}
            </h2>
            <p className='text-gray-300 mt-2 text-sm'>
              {isPublic
                ? 'Si haces esta ruta privada, otros usuarios ya no podrán verla.'
                : 'Al publicar esta ruta, cualquier usuario podrá verla, junto con todas las notas asociadas.'}
            </p>

            <div className='flex justify-end gap-3 mt-4'>
              <button
                className='bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-sm'
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className={`py-2 px-4 rounded-sm transition-all ${
                  isPublic
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-blue-600 hover:bg-blue-500'
                } text-white`}
                onClick={togglePublish}
                disabled={loading}
              >
                {loading
                  ? 'Procesando...'
                  : isPublic
                  ? 'Sí, hacerlo privado'
                  : 'Sí, publicar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPostModal && (
        <PostModal
          onClose={() => setShowPostModal(false)}
          onPostPublished={() => setRefreshTrigger((prev) => !prev)}
          initialRoute={{ id: routeData._id, name: routeName, isPublic }}
        />
      )}
    </div>
  )
}
