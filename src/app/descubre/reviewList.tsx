'use client'
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
  userEmail: string
  onDeleteReview?: (reviewId: string) => void
}

export default function ReviewList({
  publicationId,
  reviews,
  userEmail,
  onDeleteReview
}: ReviewListProps) {
  const handleDeleteReview = async (reviewId: string) => {
    try {
      await apiFetch(`/publications/${publicationId}/reviews/${reviewId}`, {
        method: 'DELETE',
        token: userEmail
      })
      if (onDeleteReview) onDeleteReview(reviewId) // Actualizar la lista tras la eliminación
    } catch (error) {
      console.error('❌ Error al eliminar reseña:', error)
    }
  }
  return (
    <div className='mt-3 bg-gray-700 p-3 rounded-md text-white'>
      {reviews.length > 0 ? (
        reviews.map((rev) => {
          const isOwnReview = rev.user.email === userEmail
          console.log('💡 Revisando usuario de la reseña:', rev.user.email)
          //! {HAY QUE HACER UN GETUSERBYID O POPULAR EL USER A LAS RESEÑAS EN EL BACKEND PORQUE SI NO NO VA A ENCONTRAR AL USUARIO PROPIETARIO DE LA RESEÑA NUNCA}
          return (
            <div
              key={rev._id}
              className='mb-3 border-b border-gray-600 pb-3 flex items-start gap-3'
            >
              {/* Avatar del usuario */}
              {rev.user.avatar ? (
                <Image
                  src={rev.user.avatar}
                  alt={rev.user.name || 'Usuario'}
                  width={40}
                  height={40}
                  className='rounded-full object-cover'
                />
              ) : (
                <UserIcon className='w-10 h-10 text-gray-500' />
              )}

              {/* Contenido de la reseña */}
              <div className='flex-1'>
                <p className='text-sm font-semibold'>
                  {rev.user.name || rev.user.email || 'Usuario anónimo'}
                </p>
                <p className='text-xs text-gray-400'>
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>

                {/* Estrellas */}
                <div className='flex gap-1 my-1'>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'text-yellow-400' : 'text-gray-500'
                      }`}
                    />
                  ))}
                </div>

                <p className='text-gray-300'>{rev.comment}</p>
              </div>

              {/* Botón para eliminar la reseña (solo si es del usuario actual) */}
              {isOwnReview && onDeleteReview && (
                <button
                  onClick={() => handleDeleteReview(rev._id)}
                  className='text-red-400 hover:text-red-300 transition'
                  title='Eliminar reseña'
                >
                  <TrashIcon className='w-5 h-5' />
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
