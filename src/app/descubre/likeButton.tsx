'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/utils/api'
import { HeartIcon } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react'

interface LikeButtonProps {
  publicationId: string
  userHasLiked: boolean
  initialLikesCount: number
}

export default function LikeButton({
  publicationId,
  userHasLiked,
  initialLikesCount
}: LikeButtonProps) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(userHasLiked)
  const [likesCount, setLikesCount] = useState<number>(initialLikesCount)

  // Sincronizar el estado inicial correctamente
  useEffect(() => {
    setLiked(userHasLiked)
    setLikesCount(initialLikesCount)
  }, [userHasLiked, initialLikesCount])

  const handleLike = async () => {
    try {
      const response = await apiFetch(`/publications/${publicationId}/like`, {
        method: 'PUT',
        token: session?.user?.email ?? undefined
      })

      setLiked(response.liked) // ✅ Actualiza el estado de "like" correctamente
      setLikesCount(response.likesCount) // ✅ Actualiza el número total de likes
    } catch (error) {
      console.error('🚨 Error al dar like:', error)
    }
  }

  return (
    <button
      onClick={handleLike}
      className={`mt-2 flex items-center gap-1 transition-all ${
        liked ? 'text-red-500' : 'text-gray-400 hover:text-gray-300'
      }`}
    >
      <HeartIcon className='w-6 h-6' />
      <span>{likesCount}</span>{' '}
      {/* ✅ Número real de usuarios únicos que han dado like */}
    </button>
  )
}
