'use client'

import { useState } from 'react'
import { PhotoIcon, MapIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface PostModalProps {
  onClose: () => void
}

export default function PostModal({ onClose }: PostModalProps) {
  const [postContent, setPostContent] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null) // Ruta obligatoria
  const [selectedImages, setSelectedImages] = useState<File[]>([]) // Imágenes opcionales

  const handlePublishPost = () => {
    if (!postContent.trim() || !selectedRoute) return
    console.log(
      '📢 Publicación:',
      postContent,
      'Ruta:',
      selectedRoute,
      'Imágenes:',
      selectedImages
    )
    setPostContent('')
    setSelectedRoute(null)
    setSelectedImages([])
    onClose() // Cerrar modal tras publicar
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setSelectedImages([...selectedImages, ...Array.from(e.target.files)])
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50'>
      <div className='bg-gray-800 text-white p-6 rounded-md shadow-lg w-full max-w-lg border border-gray-600 relative'>
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-white transition-all'
        >
          <XMarkIcon className='w-6 h-6' />
        </button>

        <h2 className='text-lg font-semibold mb-4 text-center'>
          Crear Publicación
        </h2>

        {/* Área de texto */}
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className='w-full bg-gray-700 text-white p-2 rounded-sm border border-gray-500'
          placeholder='Escribe algo sobre tu ruta...'
          rows={3}
        />

        {/* Seleccionar Ruta */}
        <div className='mt-3'>
          <label className='text-sm font-semibold text-gray-300 mb-2 block'>
            Ruta seleccionada <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <input
              type='text'
              value={selectedRoute ? `Ruta: ${selectedRoute}` : ''}
              readOnly
              className='w-full bg-gray-700 text-white p-2 rounded-sm border border-gray-500 cursor-not-allowed'
              placeholder='No hay ruta seleccionada'
            />
            <button
              className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black py-1 px-3 rounded-sm transition-all text-sm'
              onClick={() => setSelectedRoute('Ejemplo de ruta')} // Aquí iría el selector de rutas
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

          {/* Vista previa de imágenes */}
          {selectedImages.length > 0 && (
            <div className='mt-3 flex flex-wrap gap-2'>
              {selectedImages.map((file, index) => (
                <div key={index} className='relative w-20 h-20'>
                  <Image
                    src={URL.createObjectURL(file)}
                    alt='Vista previa'
                    width={80}
                    height={80}
                    className='object-cover rounded-sm border border-gray-500'
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón Publicar */}
        <button
          onClick={handlePublishPost}
          className={`mt-4 w-full py-2 px-4 rounded-sm transition-all font-semibold ${
            selectedRoute
              ? 'bg-green-500 hover:bg-green-400 text-black'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!selectedRoute}
        >
          Compartir
        </button>
      </div>
    </div>
  )
}
