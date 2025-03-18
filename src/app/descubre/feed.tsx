'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { apiFetch } from '@/utils/api'
import PublicationCard from './publicationCard'

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
  likes: string[] // ✅ Agregado
  reviews: {
    // ✅ Agregado
    _id: string
    rating: number
    comment: string
    user: { email: string; name?: string; avatar?: string }
    createdAt: string
  }[]
}

export default function Feed({ refreshTrigger }: { refreshTrigger: boolean }) {
  const { data: session } = useSession()
  const userEmail = session?.user?.email ?? ''
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)

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
  const handleDeletePublication = async (publicationId: string) => {
    try {
      await apiFetch(`/publications/${publicationId}`, {
        method: 'DELETE',
        token: userEmail
      })
      setPublications((prev) => prev.filter((pub) => pub._id !== publicationId))
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
            <PublicationCard
              key={pub._id}
              publication={pub}
              userEmail={userEmail}
              onDelete={handleDeletePublication}
            />
          ))
        )}
      </div>
    </div>
  )
}
