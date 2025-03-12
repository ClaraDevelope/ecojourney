'use client'

import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { BookmarkIcon, BookmarkSlashIcon } from '@heroicons/react/24/outline'
import ErrorModal from '@/components/ErrorModal/ErrorModal'
import SuccessModal from '@/components/SuccessModal/SuccessModal'
import { apiFetch } from '@/utils/api' // ✅ Importamos apiFetch

interface Coordinates {
  lat: number
  lng: number
}

interface Props {
  origin: Coordinates | null
  destination: Coordinates | null
  originName: string
  destinationName: string
  transportMode: string | null
}

export default function SaveRouteButton({
  origin,
  destination,
  originName,
  destinationName,
  transportMode
}: Props) {
  const { data: session } = useSession()
  const [isSaved, setIsSaved] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!session) {
      await signIn('google')
      return
    }

    try {
      await apiFetch(`/routes/save`, {
        method: 'POST',
        token: session?.user?.email ?? undefined,
        body: {
          origin: { name: originName, lat: origin?.lat, lng: origin?.lng },
          destination: {
            name: destinationName,
            lat: destination?.lat,
            lng: destination?.lng
          },
          transportMode
        }
      })

      setIsSaved(true)
      setSuccessMessage('¡Ruta guardada con éxito!')
    } catch (error) {
      if (error instanceof Error) {
        setError(
          error.message.includes('409')
            ? 'Esta ruta ya ha sido guardada. Dirígete a "Mis rutas" y la encontrarás. Puedes añadir o modificar datos desde ahí.'
            : 'Tienes que rellenar todos los campos para guardar la ruta'
        )
      } else {
        setError('Error en la solicitud, inténtalo de nuevo más tarde')
      }
    }
  }

  return (
    <>
      {/* Modal de error */}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}

      {/* Modal de éxito */}
      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Botón de Guardar Ruta */}
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-sm shadow-md transition duration-300 transform ${
          isSaved
            ? 'border-2 border-gray-600'
            : 'border-2 border-gray-600 hover:bg-green-800 hover:border-transparent'
        } active:scale-95`}
      >
        {isSaved ? (
          <BookmarkSlashIcon className='w-5 h-5 text-white transition' />
        ) : (
          <BookmarkIcon className='w-5 h-5 text-white transition' />
        )}
        {isSaved ? 'Guardado' : 'Guardar ruta'}
      </button>
    </>
  )
}
