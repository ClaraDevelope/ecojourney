'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

// 🔹 Importar Leaflet de forma dinámica (Next.js no lo soporta en SSR)
const Map = dynamic(() => import('../../../components/Map/Map'), { ssr: false })

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
    console.log('🔹 ID obtenido de useParams():', id)

    if (!id) {
      console.error('❌ No se obtuvo un ID válido en useParams()')
      return
    }

    if (!session?.user?.email) {
      console.error('❌ No hay un email de usuario disponible')
      return
    }

    const fetchRuta = async () => {
      try {
        console.log('📡 Solicitando ruta a:', `${BACKEND_URL}/api/routes/${id}`)

        const res = await fetch(`${BACKEND_URL}/api/routes/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.email || ''}`
          }
        })

        if (!res.ok) throw new Error('Error obteniendo la ruta')

        const data = await res.json()
        console.log('✅ Ruta obtenida:', data) // <-- Verificar la respuesta de la API
        setRuta(data)
      } catch (error) {
        console.error('🚨 Error obteniendo la ruta:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRuta()
  }, [id, session])

  if (loading)
    return (
      <p className='mt-20 text-center text-white min-h-screen'>
        Cargando ruta...
      </p>
    )
  if (!ruta)
    return (
      <p className='mt-20 text-center text-white min-h-screen'>
        Ruta no encontrada.
      </p>
    )

  return (
    <div className='p-6 min-h-screen flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-4 text-center text-[var(--terciary)]'>
        Detalle de la Ruta
      </h1>

      <div className='bg-gray-800 text-white p-6 rounded-md shadow-lg w-full max-w-2xl'>
        <h2 className='text-lg font-semibold flex items-center gap-2'>
          <MapPinIcon className='w-5 h-5 text-red-500' />
          {ruta.origin.name}
          <ArrowRightIcon className='w-6 h-6 text-gray-300' />
          {ruta.destination.name}
        </h2>

        <p className='text-gray-300 mt-2'>
          🚀 Transporte: {ruta.transportMode}
        </p>
        <p className='text-sm text-gray-400 mt-2'>
          📍 Lat: {ruta.origin.lat.toFixed(2)}, Lng:{' '}
          {ruta.origin.lng.toFixed(2)}
        </p>
        <div className='mt-6 w-full h-[400px] rounded-md overflow-hidden'>
          <Map
            origin={ruta.origin}
            destination={ruta.destination}
            transportMode={ruta.transportMode}
          />
        </div>
      </div>
    </div>
  )
}
