'use client'

import { useEffect, useState } from 'react'
import { MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import { apiFetch } from '@/utils/api'

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false })

interface Route {
  _id: string
  origin: { name: string; lat: number; lng: number }
  destination: { name: string; lat: number; lng: number }
  transportMode: string
  public: boolean
}

interface Note {
  _id: string
  text: string
  category: string
}

interface SavedRouteDetailProps {
  ruta: Route
}

export default function SavedRouteDetail({ ruta }: SavedRouteDetailProps) {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await apiFetch(`/routes/${ruta._id}/notes`)
        setNotes(data.notes)
      } catch (error) {
        console.error('🚨 Error obteniendo notas:', error)
      }
    }
    fetchNotes()
  }, [ruta._id])

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
        </div>

        {/* Sección de Notas */}
        <div className='bg-gray-800 p-5 rounded-sm shadow-md border border-gray-700 w-full max-w-none lg:w-auto self-start'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Notas sobre la ruta
          </h2>
          {notes.length > 0 ? (
            <ul className='space-y-2'>
              {notes.map((note) => (
                <li
                  key={note._id}
                  className='bg-gray-700 p-3 rounded-md text-white'
                >
                  <strong className='block text-blue-400'>
                    {note.category}
                  </strong>
                  <p>{note.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-400'>No hay notas para esta ruta.</p>
          )}
        </div>
      </div>
    </div>
  )
}
