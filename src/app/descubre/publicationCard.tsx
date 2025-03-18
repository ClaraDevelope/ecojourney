'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  UserIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import PublicationActions from './publicationActions'
import LikeButton from './likeButton'
import ReviewModal from './reviewModal'
import ReviewList from './reviewList'

interface Publication {
  _id: string
  user: {
    email: string
    name?: string
    avatar?: string
  }
  text: string
  images: string[]
  route: {
    origin: { name: string }
    destination: { name: string }
    transportMode: string
  }
  createdAt: string
  likes: string[]
  reviews: {
    _id: string
    rating: number
    comment: string
    user: { email: string; name?: string; avatar?: string }
    createdAt: string
  }[]
}
// !creo que es aquí en la interfaz donde puedes cambiar algo porque en el backend las reviews no tienen esa estructura
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
  const userHasLiked = publication.likes.includes(userEmail)

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [showReviews, setShowReviews] = useState(false)

  const averageRating =
    publication.reviews.length > 0
      ? publication.reviews.reduce((sum, r) => sum + r.rating, 0) /
        publication.reviews.length
      : 0

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
        {publication.user.avatar ? (
          <Image
            src={publication.user.avatar}
            alt={publication.user.name || 'Usuario'}
            width={40}
            height={40}
            className='rounded-full object-cover'
          />
        ) : (
          <UserIcon className='w-10 h-10 text-gray-500' />
        )}
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
      {publication.route && (
        <div className='mt-2 p-3 bg-gray-700 rounded-md flex items-center gap-2 text-sm text-gray-300'>
          <MapPinIcon className='w-5 h-5 text-gray-400' />
          <span>
            <strong>{publication.route.origin.name}</strong> →{' '}
            <strong>{publication.route.destination.name}</strong> (
            {publication.route.transportMode})
          </span>
        </div>
      )}

      {/* Contenido de la Publicación */}
      <p className='text-white mt-2'>{publication.text}</p>

      {/* Imágenes */}
      {publication.images.length > 0 && (
        <div className='mt-3 grid grid-cols-2 gap-2'>
          {publication.images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt='Publicación'
              width={500}
              height={500}
              className='rounded-md object-cover w-full max-h-60'
            />
          ))}
        </div>
      )}

      {/* Botón de Like */}
      <LikeButton
        publicationId={publication._id}
        userHasLiked={userHasLiked}
        initialLikesCount={publication.likes.length}
      />

      {/* Mostrar Rating Promedio y Botones */}
      <div className='flex items-center gap-4 mt-2 text-sm text-gray-300'>
        <span className='text-yellow-400 flex items-center'>
          ⭐ {averageRating.toFixed(1)} / 5
        </span>
        <button
          onClick={() => setShowReviews(!showReviews)}
          className='flex items-center gap-1 text-blue-400 hover:text-blue-300 transition px-2 py-1'
        >
          <ChatBubbleLeftRightIcon className='w-5 h-5' />
          {publication.reviews.length} Reseñas
        </button>
        <span className='text-gray-500'>|</span> {/* Separador visual */}
        <button
          onClick={() => setIsReviewModalOpen(true)}
          className='flex items-center gap-1 text-green-400 hover:text-green-300 transition px-2 py-1'
        >
          <PencilSquareIcon className='w-5 h-5' />
          Escribir reseña
        </button>
      </div>

      {/* Reseñas desplegadas */}
      {showReviews && publication.reviews.length > 0 && (
        <ReviewList
          publicationId={publication._id}
          reviews={publication.reviews}
          userEmail={userEmail}
        />
      )}

      {/* Modal de reseñas */}
      {isReviewModalOpen && (
        <ReviewModal
          publicationId={publication._id}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </div>
  )
}
