'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  PhotoIcon,
  MapIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import RouteSelector from './routeSelector'
import { apiFetch } from '@/utils/api'
import SuccessModal from '../SuccessModal/SuccessModal'

interface PostModalProps {
  onClose: () => void
  onPostPublished: () => void
  initialRoute?: { id: string; name: string; isPublic?: boolean }
}

export default function PostModal({
  onClose,
  onPostPublished,
  initialRoute
}: PostModalProps) {
  const { data: session } = useSession()
  const [postContent, setPostContent] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<{
    id: string
    name: string
    isPublic?: boolean
  } | null>(null)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [showRouteSelector, setShowRouteSelector] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    if (initialRoute) {
      console.log('🟢 Se ha recibido initialRoute:', initialRoute)
      setSelectedRoute(initialRoute)
    }
  }, [initialRoute])

  const handlePublishPost = async () => {
    if (!postContent.trim() || !selectedRoute) return

    setLoading(true)
    try {
      // ✅ Solo cambia la visibilidad si la ruta NO ES pública
      if (!selectedRoute.isPublic) {
        console.log('🔄 Cambiando visibilidad de la ruta antes de publicar...')

        const visibilityResponse = await apiFetch(
          `/routes/${selectedRoute.id}/toggle-visibility`,
          {
            method: 'PUT',
            token: session?.user?.email ?? undefined
          }
        )

        if (!visibilityResponse.public) {
          throw new Error(
            'No se pudo hacer pública la ruta. Inténtalo de nuevo.'
          )
        }

        console.log('✅ Ruta marcada como pública en backend.')

        // ✅ Actualizamos el estado localmente
        setSelectedRoute((prev) => (prev ? { ...prev, isPublic: true } : prev))
      }

      // 🟢 Hacemos el POST solo si la ruta ya es pública
      console.log('✅ Ruta ahora es pública. Procediendo con la publicación...')
      const formData = new FormData()
      formData.append('text', postContent)
      formData.append('routeId', selectedRoute.id)
      selectedImages.forEach((file) => formData.append('images', file))

      await apiFetch('/publications/post', {
        method: 'POST',
        token: session?.user?.email ?? undefined,
        body: formData
      })

      // ✅ Aquí mostramos el modal de éxito
      setShowSuccessModal(true)

      // Reseteamos los estados
      setPostContent('')
      setSelectedRoute(null)
      setSelectedImages([])

      // ⏳ Cierra el modal de publicación **después de que el modal de éxito se haya mostrado**
      setTimeout(() => {
        onPostPublished()
        onClose()
      }, 3000) // Tiempo suficiente para ver el modal de éxito antes de cerrar todo
    } catch (error) {
      console.error('🚨 Error al publicar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setSelectedImages([...selectedImages, ...Array.from(e.target.files)])
  }

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[99999999999999999999999999]'>
      <div className='bg-gray-800 text-white p-6 rounded-md shadow-lg w-full max-w-lg border border-gray-600 relative'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-white transition-all'
        >
          <XMarkIcon className='w-6 h-6' />
        </button>

        <h2 className='text-lg font-semibold mb-4 text-center'>
          Crear Publicación
        </h2>
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className='w-full bg-gray-700 text-white p-2 rounded-sm border border-gray-500'
          placeholder='Escribe algo sobre tu ruta...'
          rows={3}
        />

        {/* Selector de Ruta */}
        <div className='mt-3'>
          <label className='text-sm font-semibold text-gray-300 mb-2 block'>
            Ruta seleccionada <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <input
              type='text'
              value={selectedRoute?.name || ''}
              readOnly
              className='w-full bg-gray-700 text-white p-2 rounded-sm border border-gray-500 cursor-not-allowed'
              placeholder='No hay ruta seleccionada'
            />

            <button
              className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black py-1 px-3 rounded-sm transition-all text-sm'
              onClick={() => setShowRouteSelector(true)}
            >
              <MapIcon className='w-5 h-5' />
              {selectedRoute ? 'Cambiar' : 'Seleccionar'}
            </button>
          </div>
        </div>

        {/* Subir imágenes */}
        <div className='mt-3'>
          <label className='text-sm font-semibold text-gray-300 mb-2 block'>
            Añadir imágenes (opcional)
          </label>
          <input
            type='file'
            multiple
            accept='image/*'
            className='hidden'
            id='image-upload'
            onChange={handleImageUpload}
          />
          <label
            htmlFor='image-upload'
            className='flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-sm transition-all cursor-pointer'
          >
            <PhotoIcon className='w-5 h-5' />
            Seleccionar imágenes
          </label>

          {/* Previsualización de imágenes */}
          {selectedImages.length > 0 && (
            <div className='mt-3 grid grid-cols-3 gap-2'>
              {selectedImages.map((file, index) => (
                <div key={index} className='relative group'>
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    width={100}
                    height={100}
                    className='object-cover w-24 h-24 rounded-md border border-gray-500 aspect-square'
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className='absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500'
                  >
                    <TrashIcon className='w-4 h-4' />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handlePublishPost}
          className='mt-4 w-full py-2 px-4 rounded-sm transition-all bg-green-500 hover:bg-green-400 text-black font-semibold'
          disabled={!selectedRoute || loading}
        >
          {loading ? 'Publicando...' : 'Compartir'}
        </button>
      </div>

      {showRouteSelector && (
        <RouteSelector
          onSelect={(id: string, name: string, isPublic?: boolean) => {
            setSelectedRoute({ id, name, isPublic })
            setShowRouteSelector(false)
          }}
          onClose={() => setShowRouteSelector(false)}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          message='¡Publicación realizada con éxito!'
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  )
}
