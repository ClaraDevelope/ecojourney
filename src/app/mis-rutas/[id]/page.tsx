'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import Notes from './notes'
import PublishRoute from './publishButton'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false })

interface Route {
  _id: string
  origin: { name: string; lat: number; lng: number }
  destination: { name: string; lat: number; lng: number }
  transportMode: string
}

export default function RouteDetailPage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const [ruta, setRuta] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || !session?.user?.email) return

    const fetchRuta = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/routes/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.email}`
          }
        })
        if (!res.ok) throw new Error('Error obteniendo la ruta')
        const data = await res.json()
        setRuta(data)
      } catch (error) {
        console.error('🚨 Error obteniendo la ruta:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRuta()
  }, [id, session])

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
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-full'>
        {/* 📌 Columna izquierda - Info de la ruta */}
        <div className='bg-gray-800 p-5 rounded-sm shadow-md border border-gray-700 w-full max-w-none lg:w-auto'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Detalle de la Ruta
          </h2>

          {/* 📍 Datos de la ruta */}
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

          {/* 🗺️ Mapa */}
          <div className='w-full h-64 rounded-sm overflow-hidden shadow-md'>
            <Map
              origin={ruta.origin}
              destination={ruta.destination}
              transportMode={ruta.transportMode}
            />
          </div>

          {/* 🚀 Botón de publicación */}
          <div className='mt-4'>
            <PublishRoute routeId={ruta._id} />
          </div>
        </div>

        {/* 📝 Columna derecha - Notas */}
        <Notes routeId={ruta._id} />
      </div>
    </div>
  )
}
