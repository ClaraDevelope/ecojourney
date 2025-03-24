'use client'

import { useState } from 'react'
import { apiFetch } from '@/utils/api'
import { BookmarkIcon, BookmarkSlashIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

interface LikeButtonProps {
  routeId: string
  userHasSaved: boolean
  initialSavedCount: number
}

export default function SaveButton({
  routeId,
  userHasSaved,
  initialSavedCount
}: LikeButtonProps) {
  const { data: session } = useSession()
  const [isSaved, setIsSaved] = useState(userHasSaved)
  const [savedCount, setSavedCount] = useState(initialSavedCount)

  const toggleSave = async () => {
    if (!session?.user?.email) return

    try {
      // 🔹 Hacemos POST para guardar/eliminar la ruta
      await apiFetch(`/routes/${routeId}/save`, {
        method: 'POST',
        token: session.user.email
      })

      // 🔄 Volvemos a hacer GET para actualizar la información real desde el backend
      const updatedRoute = await apiFetch(`/routes/${routeId}`, {
        method: 'GET',
        token: session.user.email
      })

      setIsSaved(
        Array.isArray(updatedRoute.savedBy) &&
          updatedRoute.savedBy.includes(session?.user?.email || '')
      )
      setSavedCount(updatedRoute.savedBy.length)
    } catch (error) {
      console.error('❌ Error al guardar ruta:', error)
    }
  }

  return (
    <button
      onClick={toggleSave}
      className='flex items-center gap-2 text-white'
      title={isSaved ? 'Eliminar de guardados' : 'Guardar ruta'}
      aria-label={isSaved ? 'Eliminar de guardados' : 'Guardar ruta'}
    >
      {isSaved ? (
        <BookmarkSlashIcon
          className='w-5 h-5 text-blue-400'
          aria-hidden='true'
        />
      ) : (
        <BookmarkIcon className='w-5 h-5 text-gray-400' aria-hidden='true' />
      )}
      {savedCount}
    </button>
  )
}
