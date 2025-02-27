'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/solid'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

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
        const res = await fetch(`${BACKEND_URL}/api/routes/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.email}`
          }
        })

        if (!res.ok) throw new Error('Error obteniendo rutas')

        const data = await res.json()
        console.log(data)
        setRutas(data)
      } catch (error) {
        console.error('Error obteniendo rutas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRutas()
  }, [session])

  if (loading)
    return <p className='text-center text-white'>Cargando rutas...</p>
  if (rutas.length === 0)
    return (
      <p className='text-center text-white'>No tienes rutas guardadas aún.</p>
    )

  return (
    <div className='p-6 min-h-screen'>
      <h1 className='text-3xl font-bold mb-6 text-center text-[var(--terciary)]'>
        Mis Rutas Guardadas
      </h1>
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
            >
              <div className='flex flex-col bg-gray-800 border border-gray-700 shadow-md  overflow-hidden transition-transform transform hover:scale-105 cursor-pointer h-[370px]'>
                <div className='relative w-full h-48'>
                  <Image
                    src={mapImageUrl}
                    alt={`Mapa de la ruta ${ruta.origin.name} a ${ruta.destination.name}`}
                    width={400}
                    height={200}
                    className='object-cover w-full h-full'
                    priority
                  />
                </div>
                <div className='p-5 bg-gray-900 text-white flex-grow min-h-[150px]'>
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
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
