'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import PublicationActions from './publicationActions'
import ReviewModal from './reviewModal'
import ReviewList from './reviewList'
import { apiFetch } from '@/utils/api'
import Link from 'next/link'

interface Publication {
  _id: string
  user: {
    email: string
    name?: string
    image?: string
  }
  text: string
  images: string[]
  route: {
    origin: { name: string }
    destination: { name: string }
    transportMode: string
    _id: string
  }
  createdAt: string
  likes: string[]
  reviews: {
    _id: string
    rating: number
    comment: string
    user: { email: string; name?: string; image?: string }
    createdAt: string
  }[]
}

export default function PublicationCard({
  publication,
  onDelete
}: {
  publication: Publication
  userEmail: string
  onDelete: (id: string) => void
}) {
  const { data: session } = useSession()
  const userEmail = session?.user?.email ?? ''

  const isOwner = publication.user.email === userEmail

  const [reviews, setReviews] = useState(publication.reviews)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [showReviews, setShowReviews] = useState(false)

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  // Generar una imagen con la inicial del nombre si no tiene imagen
  const getUserAvatar = () => {
    if (publication.user.image) {
      return (
        <Image
          src={publication.user.image}
          alt={publication.user.name || 'Usuario'}
          width={40}
          height={40}
          className='rounded-full object-cover'
        />
      )
    }
    const initial = publication.user.name?.charAt(0).toUpperCase() || '?'
    return (
      <div className='w-10 h-10 flex items-center justify-center bg-green-900 text-white rounded-full text-lg'>
        {initial}
      </div>
    )
  }

  return (
    <div className='relative bg-gray-800 p-4 rounded-sm shadow-md mb-4 border border-gray-700'>
      {isOwner && (
        <div className='absolute top-2 right-2 flex items-center'>
          <PublicationActions
            publicationId={publication._id}
            onDelete={onDelete}
          />
        </div>
      )}

      {/* Usuario */}
      <div className='flex items-center gap-3'>
        {getUserAvatar()}
        <div>
          <p className='text-sm font-semibold text-white'>
            {publication.user.name || publication.user.email}
          </p>
          <p className='text-xs text-gray-400'>
            {new Date(publication.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Información de la Ruta */}
      {publication.route &&
        (session ? (
          <Link
            href={`/descubre/ruta/${publication.route._id}`}
            onClick={() => {
              console.log(`esta es la ruta, su id: ${publication.route._id}`)
            }}
            className='block'
            title={`Ver detalles de la ruta de ${publication.route.origin.name} a ${publication.route.destination.name}`}
            aria-label={`Ver ruta: ${publication.route.origin.name} a ${publication.route.destination.name}, modo de transporte: ${publication.route.transportMode}`}
          >
            <div className='mt-2 p-3 bg-gray-700 rounded-md flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-600 transition'>
              <MapPinIcon
                className='w-5 h-5 text-gray-400'
                aria-hidden='true'
              />
              <span>
                <strong>{publication.route.origin.name}</strong> →{' '}
                <strong>{publication.route.destination.name}</strong> (
                {publication.route.transportMode})
              </span>
            </div>
          </Link>
        ) : (
          <div
            className='mt-2 p-3 bg-gray-700 rounded-md flex items-center gap-2 text-sm text-gray-300'
            aria-label={`Ruta de ${publication.route.origin.name} a ${publication.route.destination.name}, modo de transporte: ${publication.route.transportMode}`}
          >
            <MapPinIcon className='w-5 h-5 text-gray-400' aria-hidden='true' />
            <span>
              <strong>{publication.route.origin.name}</strong> →{' '}
              <strong>{publication.route.destination.name}</strong> (
              {publication.route.transportMode})
            </span>
          </div>
        ))}

      {/* Contenido de la Publicación */}
      <p className='text-white mt-2'>{publication.text}</p>

      {publication.images.length > 0 && (
        <div className='mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
          {publication.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Imagen ${index + 1} de la publicación`}
              width={400}
              height={300}
              className='rounded-md object-cover w-full h-40'
            />
          ))}
        </div>
      )}

      {/* Mostrar Rating Promedio y Botones */}
      <div className='flex items-center gap-4 mt-2 text-sm text-gray-300'>
        <span className='text-yellow-400 flex items-center'>
          ⭐ {averageRating.toFixed(1)} / 5
        </span>
        <button
          onClick={() => setShowReviews(!showReviews)}
          className='flex items-center gap-1 text-blue-400 hover:text-blue-300 transition px-2 py-1'
          title='Mostrar u ocultar reseñas'
          aria-label={`Mostrar u ocultar las ${reviews.length} reseñas de esta publicación`}
        >
          <ChatBubbleLeftRightIcon className='w-5 h-5' aria-hidden='true' />
          {reviews.length} Reseñas
        </button>
        <button
          onClick={() => setIsReviewModalOpen(true)}
          className='flex items-center gap-1 text-green-400 hover:text-green-300 transition px-2 py-1'
          title='Escribir una reseña'
          aria-label='Abrir modal para escribir una reseña'
        >
          <PencilSquareIcon className='w-5 h-5' aria-hidden='true' />
          Escribir reseña
        </button>
      </div>

      {/* Reseñas desplegadas */}
      {showReviews && (
        <ReviewList
          publicationId={publication._id}
          reviews={reviews}
          onDeleteReview={(reviewId) => {
            setReviews((prevReviews) =>
              prevReviews.filter((r) => r._id !== reviewId)
            )
          }}
        />
      )}

      {/* Modal de reseñas */}
      {isReviewModalOpen && (
        <ReviewModal
          publicationId={publication._id}
          onClose={() => setIsReviewModalOpen(false)}
          onReviewAdded={async () => {
            const updatedPublication = await apiFetch(
              `/publications/${publication._id}`
            )
            setReviews(updatedPublication.reviews)
          }}
        />
      )}
    </div>
  )
}
