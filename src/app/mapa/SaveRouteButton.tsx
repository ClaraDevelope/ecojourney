import { useState } from 'react'
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
  transportMode: string | null
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000' // 🔥 Definir la URL del backend aquí

export default function SaveRouteButton({
  origin,
  destination,
  transportMode
}: Props) {
  const { data: session } = useSession() // Obtener la sesión del usuario
  const [isSaved, setIsSaved] = useState(false)

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
          Authorization: `Bearer ${session?.user?.email}` // 🔥 Enviamos el email como "token"
        },
        body: JSON.stringify({ origin, destination, transportMode })
      })

      if (res.ok) {
        setIsSaved(true)
      } else {
        console.error('Error guardando la ruta')
      }
    } catch (error) {
      console.error('Error en la solicitud', error)
    }
  }

  return (
    <button
      onClick={handleSave}
      className={`flex items-center gap-2 px-6 py-3 text-white rounded-md shadow-md transition duration-300 transform ${
        isSaved ? 'bg-red-900 hover:bg-red-600' : 'bg-red-600 hover:bg-red-500'
      } active:scale-95`}
    >
      {isSaved ? (
        <HeartSolid className='w-5 h-5 text-white transition' />
      ) : (
        <HeartIcon className='w-5 h-5 text-white transition' />
      )}
      {isSaved ? 'Guardado' : 'Guardar ruta'}
    </button>
  )
}
