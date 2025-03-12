'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/solid'
import ErrorModal from '@/components/ErrorModal/ErrorModal' // ✅ Importa el ErrorModal

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

interface PublishRouteProps {
  routeId: string
  initialPublicState: boolean
}

export default function PublishRoute({
  routeId,
  initialPublicState
}: PublishRouteProps) {
  const { data: session } = useSession()
  const [isPublic, setIsPublic] = useState(initialPublicState ?? false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // ✅ Estado para manejar errores

  // Sincroniza el estado con initialPublicState en caso de cambios
  useEffect(() => {
    setIsPublic(initialPublicState)
  }, [initialPublicState])

  const togglePublish = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/routes/${routeId}/toggle-visibility`,
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
      setIsModalOpen(false)
    } catch (err) {
      setError('No se pudo actualizar la visibilidad. Inténtalo de nuevo.') // ✅ Error manejado
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
            ? 'bg-red-600 hover:bg-red-500 text-white'
            : 'bg-[var(--terciary)] hover:bg-green-500'
        } text-black `}
        title={isPublic ? 'Hacer ruta privada' : 'Publicar ruta'}
        onClick={() => setIsModalOpen(true)}
      >
        {isPublic ? (
          <EyeSlashIcon className='w-5 h-5' /> // Icono de mundo si está pública
        ) : (
          <EyeIcon className='w-5 h-5' /> // Cohete si está privada
        )}
        {isPublic ? 'Hacer privada' : 'Publicar Ruta'}
      </button>

      {/* Modal de confirmación */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[999999]'>
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
              <span> </span>
              <span className='font-semibold text-white'>
                {isPublic
                  ? 'Podrás volver a publicarla cuando quieras.'
                  : 'Si no estás seguro, revisa tus notas antes de proceder.'}
              </span>
            </p>

            <div className='flex justify-end gap-3 mt-4'>
              <button
                className='bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-sm transition-all'
                onClick={() => setIsModalOpen(false)}
                title='Cancelar y volver atrás'
              >
                Cancelar
              </button>
              <button
                className={`py-2 px-4 rounded-sm transition-all ${
                  isPublic
                    ? 'bg-red-600 hover:bg-red-500' // Rojo para "hacer privada"
                    : 'bg-green-600 hover:bg-green-500' // Verde para "publicar"
                } text-white`}
                onClick={togglePublish}
                disabled={loading}
                title={isPublic ? 'Hacer privado' : 'Publicar'}
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
    </div>
  )
}
