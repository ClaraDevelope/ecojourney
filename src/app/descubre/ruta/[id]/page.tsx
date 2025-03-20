'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { apiFetch } from '@/utils/api'
import SaveButton from './saveButton'

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false })

interface Route {
  _id: string
  origin: { name: string; lat: number; lng: number }
  destination: { name: string; lat: number; lng: number }
  transportMode: string
  public: boolean
  savedBy: string[]
}

interface Note {
  _id: string
  text: string
  category: string
  createdAt: string
}

export default function RouteDetailPage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const [ruta, setRuta] = useState<Route | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || !session?.user?.email) return

    const fetchRuta = async () => {
      try {
        const data = await apiFetch(`/routes/${id}`, {
          method: 'GET',
          token: session?.user?.email ?? undefined
        })
        setRuta(data)
      } catch (error) {
        console.error('🚨 Error obteniendo la ruta:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRuta()
  }, [id, session])

  useEffect(() => {
    if (!id) return

    const fetchNotes = async () => {
      try {
        const data = await apiFetch(`/routes/${id}/notes`)
        setNotes(data.notes)
      } catch (error) {
        console.error('🚨 Error obteniendo notas:', error)
      }
    }
    fetchNotes()
  }, [id])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-900'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500'></div>
          <p className='text-white text-lg animate-pulse'>Cargando ruta...</p>
        </div>
      </div>
    )
  }

  if (!ruta) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-900'>
        <p className='text-center text-white text-lg'>Ruta no encontrada.</p>
      </div>
    )
  }

  return (
    <div className='mt-[100px] p-6 min-h-screen w-full lg:container lg:mx-auto'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start'>
        <div className='bg-gray-800 p-5 rounded-sm shadow-md border border-gray-700 w-full max-w-none lg:w-auto self-start'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Detalle de la Ruta
          </h2>
          <div className='flex items-center text-sm text-gray-300 mb-2'>
            <MapPinIcon className='w-5 h-5 text-red-500 mr-2' />
            <span>{ruta.origin.name}</span>
            <span className='mx-2 text-gray-400'>→</span>
            <span>{ruta.destination.name}</span>
          </div>

          <div className='flex items-center text-sm text-gray-300 mb-4'>
            <GlobeAltIcon className='w-5 h-5 text-blue-400 mr-2' />
            <span>{ruta.transportMode}</span>
          </div>

          <div className='w-full h-64 rounded-sm overflow-hidden shadow-md'>
            <Map
              origin={ruta.origin}
              destination={ruta.destination}
              transportMode={ruta.transportMode}
            />
          </div>

          <div className='mt-4'>
            <SaveButton
              routeId={ruta._id}
              userHasSaved={ruta.savedBy.includes(session?.user?.email || '')}
              initialSavedCount={ruta.savedBy.length}
            />
          </div>
        </div>

        <div className='bg-gray-800 p-5 rounded-sm shadow-md border border-gray-700 w-full'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Notas sobre la ruta
          </h2>
          {notes.length > 0 ? (
            <div className='space-y-4'>
              {notes.map((note) => (
                <div
                  key={note._id}
                  className='p-4 bg-gray-700 rounded-md shadow-md'
                >
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-gray-400'>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <span className='text-sm bg-blue-500 px-2 py-1 rounded text-white'>
                      {note.category}
                    </span>
                  </div>
                  <p className='text-gray-200'>{note.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-400 text-sm'>
              Aún no hay notas para esta ruta.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
