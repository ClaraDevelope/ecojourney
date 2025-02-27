import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

interface Coordinates {
  lat: number
  lng: number
}

interface Props {
  origin: Coordinates | null
  destination: Coordinates | null
  originName: string // Nuevo
  destinationName: string // Nuevo
  transportMode: string | null
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

export default function SaveRouteButton({
  origin,
  destination,
  originName,
  destinationName,
  transportMode
}: Props) {
  const { data: session } = useSession()
  const [isSaved, setIsSaved] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const handleSave = async () => {
    if (!session) {
      await signIn('google')
      return
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/routes/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.email}`
        },
        body: JSON.stringify({
          origin: { name: originName, lat: origin?.lat, lng: origin?.lng },
          destination: {
            name: destinationName,
            lat: destination?.lat,
            lng: destination?.lng
          },
          transportMode
        })
      })

      if (res.ok) {
        setIsSaved(true)
        setAlertMessage('¡Ruta guardada con éxito!') // Muestra el mensaje de éxito
      } else {
        console.error('Error guardando la ruta')
      }
    } catch (error) {
      console.error('Error en la solicitud', error)
    }
  }

  // Cierra la alerta automáticamente después de 3 segundos
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [alertMessage])

  return (
    <>
      {/* Alerta de éxito */}
      {alertMessage && (
        <div className='fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity animate-fadeIn'>
          {alertMessage}
        </div>
      )}

      {/* Botón de Guardar Ruta */}
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 text-white rounded-md shadow-md transition duration-300 transform ${
          isSaved
            ? 'bg-red-900 hover:bg-red-600'
            : 'bg-red-600 hover:bg-red-500'
        } active:scale-95`}
      >
        {isSaved ? (
          <HeartSolid className='w-5 h-5 text-white transition' />
        ) : (
          <HeartIcon className='w-5 h-5 text-white transition' />
        )}
        {isSaved ? 'Guardado' : 'Guardar ruta'}
      </button>
    </>
  )
}
