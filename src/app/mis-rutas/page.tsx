'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { apiFetch } from '@/utils/api'
import { MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

interface Route {
  _id: string
  origin: { name: string; lat: number; lng: number }
  destination: { name: string; lat: number; lng: number }
  transportMode: string
}

export default function MisMapas() {
  const { data: session } = useSession()
  const [rutas, setRutas] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRutas = async () => {
      if (!session?.user?.email) return

      try {
        const data = await apiFetch('/routes/user', {
          method: 'GET',
          token: session?.user?.email ?? undefined
        })
        console.log(data)
        setRutas([...data.myRoutes, ...data.savedRoutes])
      } catch (error) {
        console.error('Error obteniendo rutas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRutas()
  }, [session])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-900 '>
        <div className='flex flex-col items-center space-y-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500'></div>
          <p className='text-white text-lg animate-pulse'>Cargando rutas...</p>
        </div>
      </div>
    )
  }

  if (rutas.length === 0) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-900'>
        <p className='text-center text-white text-lg'>
          No tienes rutas guardadas aún.
        </p>
      </div>
    )
  }

  return (
    <div className='p-6 min-h-screen'>
      <h1 className='text-3xl mt-20 mb-6 text-center'>Mis Rutas</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {rutas.map((ruta) => {
          const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${ruta.origin.lat},${ruta.origin.lng}&zoom=10&size=400x200&markers=color:red|${ruta.origin.lat},${ruta.origin.lng}&markers=color:blue|${ruta.destination.lat},${ruta.destination.lng}&key=${GOOGLE_MAPS_API_KEY}`

          return (
            <Link
              onClick={() => {
                console.log(ruta._id)
              }}
              key={ruta._id}
              href={`/mis-rutas/${ruta._id}`}
              className='block'
              aria-label={`Ver detalles de la ruta de ${ruta.origin.name} a ${ruta.destination.name}`}
              title={`Ruta: ${ruta.origin.name} → ${ruta.destination.name}`}
            >
              <div
                className='flex flex-col bg-gray-800 border border-gray-700 shadow-md overflow-hidden transition-transform transform hover:scale-105 cursor-pointer'
                aria-label={`Tarjeta de ruta de ${ruta.origin.name} a ${ruta.destination.name}`}
              >
                <div className='relative w-full h-48'>
                  <Image
                    src={mapImageUrl}
                    alt={`Mapa de la ruta de ${ruta.origin.name} a ${ruta.destination.name}`}
                    width={400}
                    height={200}
                    className='object-cover w-full h-full'
                    priority
                  />
                </div>
                <div className='p-5 bg-gray-900 text-white flex-grow min-h-[150px]'>
                  <h2 className='text-lg font-semibold flex items-center gap-2'>
                    <MapPinIcon
                      className='w-5 h-5 text-red-500'
                      aria-hidden='true'
                    />
                    {ruta.origin.name}
                    <ArrowRightIcon
                      className='w-6 h-6 text-gray-300'
                      aria-hidden='true'
                    />
                    {ruta.destination.name}
                  </h2>
                  <p className='text-gray-300 mt-2 flex items-center gap-2'>
                    <GlobeAltIcon
                      className='w-5 h-5 text-blue-400'
                      aria-hidden='true'
                    />
                    {ruta.transportMode}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
