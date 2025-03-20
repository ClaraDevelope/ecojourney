'use client'

import { useState } from 'react'
import { apiFetch } from '@/utils/api'
import { useSession } from 'next-auth/react'
import { XMarkIcon, StarIcon } from '@heroicons/react/24/solid'
import SuccessModal from '@/components/SuccessModal/SuccessModal'

interface ReviewModalProps {
  publicationId: string
  onClose: () => void
  onReviewAdded: (newReview: {
    _id: string
    rating: number
    comment: string
    user: { email: string; name?: string; avatar?: string }
    createdAt: string
  }) => void
}

export default function ReviewModal({
  publicationId,
  onClose,
  onReviewAdded
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { data: session } = useSession()

  const handleSubmitReview = async () => {
    if (!rating || rating < 1 || rating > 5 || !comment.trim()) return

    setLoading(true)
    try {
      const response = await apiFetch(
        `/publications/${publicationId}/reviews`,
        {
          method: 'POST',
          token: session?.user?.email ?? undefined,
          body: { rating, comment }
        }
      )

      console.log('📩 Respuesta del backend al crear reseña:', response)

      const newReview = response.review // 👈 Asegurarnos de usar el ID real del backend

      onReviewAdded(newReview)
      setRating(0)
      setComment('')

      onReviewAdded(newReview) // 👈 Enviamos la reseña correcta al componente padre

      setShowSuccessModal(true)

      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error('❌ Error al añadir reseña:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ✅ SuccessModal se muestra si showSuccessModal es true */}
      {showSuccessModal && (
        <SuccessModal
          message='Reseña publicada correctamente.'
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50'>
        <div className='bg-gray-800 text-white p-6 rounded-md shadow-lg w-full max-w-lg border border-gray-600 relative'>
          <button
            onClick={onClose}
            className='absolute top-3 right-3 text-gray-400 hover:text-white transition-all'
          >
            <XMarkIcon className='w-6 h-6' />
          </button>

          <h3 className='text-lg font-semibold mb-4'>Añadir una Reseña</h3>

          {/* Nueva Reseña */}
          <div className='mt-3'>
            <p className='text-gray-400 mb-2'>Tu calificación:</p>
            <div className='flex gap-1'>
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className={`w-6 h-6 focus:outline-none transition ${
                    i < rating ? 'text-blue-400' : 'text-gray-500'
                  }`}
                >
                  <StarIcon className='w-6 h-6' />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className='w-full bg-gray-700 text-white p-2 mt-3 rounded-md border border-gray-500'
              placeholder='Escribe tu comentario...'
              rows={2}
            />
            <button
              onClick={handleSubmitReview}
              className='mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md transition'
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Publicar reseña'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
