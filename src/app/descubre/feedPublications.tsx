'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { apiFetch } from '@/utils/api'
import Image from 'next/image'
import {
  UserIcon,
  MapPinIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import DeleteConfirmationModal from '../mis-rutas/[id]/deleteConfirmationModal'

interface Publication {
  _id: string
  user: {
    email: string
    name?: string
    avatar?: string
  }
  text: string
  images: string[]
  route: {
    origin: { name: string }
    destination: { name: string }
    transportMode: string
  }
  createdAt: string
}

export default function Feed({ refreshTrigger }: { refreshTrigger: boolean }) {
  const { data: session } = useSession()
  const userEmail = session?.user?.email ?? ''
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPublicationId, setSelectedPublicationId] = useState<
    string | null
  >(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [openOptions, setOpenOptions] = useState<string | null>(null)

  // Función para obtener publicaciones
  const fetchPublications = useCallback(async () => {
    try {
      const data = await apiFetch('/publications/')
      setPublications(data)
    } catch (error) {
      console.error('🚨 Error al obtener publicaciones:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPublications()
  }, [fetchPublications, refreshTrigger])

  // Función para eliminar una publicación
  const handleDeletePublication = async () => {
    if (!selectedPublicationId) return

    try {
      await apiFetch(`/publications/${selectedPublicationId}`, {
        method: 'DELETE',
        token: userEmail
      })
      setPublications((prev) =>
        prev.filter((pub) => pub._id !== selectedPublicationId)
      )
      setShowDeleteModal(false)
    } catch (error) {
      console.error('🚨 Error al eliminar la publicación:', error)
    }
  }

  return (
    <div className='mt-[100px] flex justify-center px-4 sm:px-0'>
      <div className='max-w-2xl w-full'>
        {loading ? (
          <p className='text-center text-gray-400'>Cargando publicaciones...</p>
        ) : publications.length === 0 ? (
          <p className='text-center text-gray-500'>
            No hay publicaciones aún. ¡Sé el primero en compartir!
          </p>
        ) : (
          publications.map((pub) => (
            <div
              key={pub._id}
              className='relative bg-gray-800 p-4 rounded-sm shadow-md mb-4 border border-gray-700'
            >
              {/* Botón de opciones */}
              {pub.user.email === userEmail && (
                <div className='absolute top-2 right-2'>
                  <button
                    onClick={() =>
                      setOpenOptions(openOptions === pub._id ? null : pub._id)
                    }
                    className='text-gray-400 hover:text-white transition-all'
                  >
                    <Cog6ToothIcon className='w-6 h-6' />
                  </button>

                  {openOptions === pub._id && (
                    <div className='absolute right-0 mt-2 w-32 bg-gray-700 border border-gray-600 rounded-md shadow-md z-50'>
                      <button className='flex items-center w-full px-3 py-2 text-gray-300 hover:bg-gray-600'>
                        <PencilSquareIcon className='w-5 h-5 mr-2' />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPublicationId(pub._id)
                          setShowDeleteModal(true)
                        }}
                        className='flex items-center w-full px-3 py-2 text-red-400 hover:bg-gray-600'
                      >
                        <TrashIcon className='w-5 h-5 mr-2' />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Usuario */}
              <div className='flex items-center gap-3'>
                {pub.user.avatar ? (
                  <Image
                    src={pub.user.avatar}
                    alt={pub.user.name || 'Usuario'}
                    width={40}
                    height={40}
                    className='rounded-full object-cover'
                  />
                ) : (
                  <UserIcon className='w-10 h-10 text-gray-500' />
                )}
                <div>
                  <p className='text-sm font-semibold text-white'>
                    {pub.user.name || pub.user.email}
                  </p>
                  <p className='text-xs text-gray-400'>
                    {new Date(pub.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Información de la Ruta */}
              {pub.route && (
                <div className='mt-2 p-3 bg-gray-700 rounded-md flex items-center gap-2 text-sm text-gray-300'>
                  <MapPinIcon className='w-5 h-5 text-gray-400' />
                  <span>
                    <strong>{pub.route.origin.name}</strong> →{' '}
                    <strong>{pub.route.destination.name}</strong> (
                    {pub.route.transportMode})
                  </span>
                </div>
              )}

              {/* Contenido de la Publicación */}
              <p className='text-white mt-2'>{pub.text}</p>

              {/* Imágenes */}
              {pub.images.length > 0 && (
                <div className='mt-3 grid grid-cols-2 gap-2'>
                  {pub.images.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt='Publicación'
                      width={500}
                      height={500}
                      className='rounded-md object-cover w-full max-h-60'
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          message='¿Seguro que quieres eliminar esta publicación?'
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeletePublication}
        />
      )}
    </div>
  )
}
