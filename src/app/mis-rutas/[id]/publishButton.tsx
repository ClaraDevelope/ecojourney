'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  RocketLaunchIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

interface PublishRouteProps {
  routeId: string
}

export default function PublishRoute({ routeId }: PublishRouteProps) {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePublish = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${BACKEND_URL}/api/routes/${routeId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.email}`
        }
      })

      if (!res.ok) throw new Error('Error al publicar la ruta')

      // Aquí podrías actualizar el estado de la ruta si es necesario
      setIsModalOpen(false)
    } catch (err) {
      setError('No se pudo publicar la ruta. Inténtalo de nuevo.')
      console.error('🚨 Error publicando la ruta:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Botón para abrir el modal */}
      <button
        className='w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-sm transition-all'
        title='Publicar ruta'
        onClick={() => setIsModalOpen(true)}
      >
        <RocketLaunchIcon className='w-5 h-5' />
        Publicar Ruta
      </button>

      {/* Modal de Confirmación */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[999999]'>
          <div className='bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-md border border-gray-600'>
            <h2 className='text-lg font-semibold text-white flex items-center gap-2'>
              <ExclamationTriangleIcon className='w-6 h-6 text-yellow-400' />
              ¿Estás seguro de publicar esta ruta?
            </h2>
            <p className='text-gray-300 mt-2 text-sm'>
              Al publicar esta ruta, cualquier usuario podrá verla, junto con
              todas las notas asociadas.
              <span> </span>
              <span className='font-semibold text-white'>
                Si no estás seguro, revisa tus notas antes de proceder.
              </span>
            </p>

            {error && <p className='text-red-400 text-sm mt-2'>{error}</p>}

            {/* Botones en el modal */}
            <div className='flex justify-end gap-3 mt-4'>
              <button
                className='bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-sm transition-all'
                onClick={() => setIsModalOpen(false)}
                title='Cancelar y volver atrás'
              >
                Cancelar
              </button>
              <button
                className='bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-sm transition-all'
                onClick={handlePublish}
                disabled={loading}
                title='Publicar'
              >
                {loading ? 'Publicando...' : 'Sí, publicar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
