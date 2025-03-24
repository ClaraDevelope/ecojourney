'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { apiFetch } from '@/utils/api'
import { XMarkIcon, MapIcon } from '@heroicons/react/24/outline'

interface RouteSelectorProps {
  onSelect: (routeId: string, routeName: string) => void
  onClose: () => void
}

export default function RouteSelector({
  onSelect,
  onClose
}: RouteSelectorProps) {
  const { data: session } = useSession()
  const [routes, setRoutes] = useState<
    { _id: string; origin: { name: string }; destination: { name: string } }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!session?.user?.email) return
      try {
        const data = await apiFetch('/routes/user', {
          token: session.user.email
        })
        setRoutes(data.myRoutes) // 🔹 Solo guardamos las rutas creadas por el usuario
      } catch (error) {
        console.error('🚨 Error obteniendo rutas:', error)
        setError('No se pudieron cargar las rutas.')
      } finally {
        setLoading(false)
      }
    }
    fetchRoutes()
  }, [session])

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[99999999999999]'>
      <div className='bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-md border border-gray-600 relative'>
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-white transition-all'
        >
          <XMarkIcon className='w-6 h-6' />
        </button>

        <h2 className='text-lg font-semibold mb-4 text-center'>
          Seleccionar Ruta
        </h2>

        {loading ? (
          <p className='text-gray-400 text-sm text-center'>Cargando rutas...</p>
        ) : error ? (
          <p className='text-red-400 text-sm text-center'>{error}</p>
        ) : routes.length === 0 ? (
          <p className='text-gray-400 text-sm text-center'>
            No tienes rutas guardadas.
          </p>
        ) : (
          <ul className='space-y-2 max-h-60 overflow-y-auto'>
            {routes.map((route) => (
              <li
                key={route._id}
                className='flex justify-between items-center bg-gray-700 p-2 rounded-sm border border-gray-600 cursor-pointer hover:bg-gray-600 transition-all'
                onClick={() =>
                  onSelect(
                    route._id,
                    `${route.origin.name} → ${route.destination.name}`
                  )
                } // ✅ Mostramos solo el nombre
              >
                <span className='text-sm'>
                  {route.origin.name} → {route.destination.name}
                </span>
                <MapIcon className='w-5 h-5 text-gray-400' />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
