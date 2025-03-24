'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { apiFetch } from '@/utils/api'
import { TrashIcon, StarIcon, UserIcon } from '@heroicons/react/24/solid'

interface Review {
  _id: string
  user: {
    email: string
    name?: string
    avatar?: string
  }
  rating: number
  comment: string
  createdAt: string
}

interface ReviewListProps {
  publicationId: string
  reviews: Review[]
  onDeleteReview?: (reviewId: string) => void
}

export default function ReviewList({
  publicationId,
  reviews,
  onDeleteReview
}: ReviewListProps) {
  const { data: session } = useSession()
  const userEmail = session?.user?.email ?? '' // ✅ OBTIENE userEmail SIEMPRE ACTUALIZADO

  const handleDeleteReview = async (reviewId: string) => {
    console.log('🚨 Eliminando reseña:', reviewId)
    console.log('🔍 Usuario autenticado:', userEmail)

    try {
      await apiFetch(`/publications/${publicationId}/reviews/${reviewId}`, {
        method: 'DELETE',
        token: userEmail
      })
      console.log(reviewId)

      if (onDeleteReview) onDeleteReview(reviewId)
    } catch (error) {
      console.error('❌ Error al eliminar reseña:', error)
    }
  }

  return (
    <div className='mt-3 bg-gray-700 p-3 rounded-md text-white'>
      {reviews.length > 0 ? (
        reviews.map((rev) => {
          const isOwnReview =
            rev.user?.email?.trim().toLowerCase() ===
            userEmail.trim().toLowerCase()

          return (
            <div
              key={rev._id}
              className='mb-3 border-b border-gray-600 pb-3 flex items-start gap-3'
            >
              {rev.user?.avatar ? (
                <Image
                  src={rev.user.avatar}
                  alt={`Avatar de ${rev.user.name || 'usuario'}`}
                  width={40}
                  height={40}
                  className='rounded-full object-cover'
                />
              ) : (
                <UserIcon
                  className='w-10 h-10 text-gray-500'
                  aria-hidden='true'
                />
              )}

              <div className='flex-1'>
                <p className='text-sm font-semibold'>
                  {rev?.user?.name || rev?.user?.email || 'Usuario anónimo'}
                </p>
                <p className='text-xs text-gray-400'>
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>

                <div
                  className='flex gap-1 my-1'
                  aria-label={`Valoración: ${rev.rating} estrellas`}
                >
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'text-yellow-400' : 'text-gray-500'
                      }`}
                      aria-hidden='true'
                    />
                  ))}
                </div>

                <p className='text-gray-300'>{rev.comment}</p>
              </div>

              {isOwnReview && onDeleteReview && (
                <button
                  onClick={() => handleDeleteReview(rev._id)}
                  className='text-red-400 hover:text-red-300 transition'
                  title='Eliminar reseña'
                  aria-label='Eliminar tu reseña'
                >
                  <TrashIcon className='w-5 h-5' aria-hidden='true' />
                </button>
              )}
            </div>
          )
        })
      ) : (
        <p className='text-gray-400'>No hay reseñas todavía.</p>
      )}
    </div>
  )
}
