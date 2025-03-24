'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { PencilIcon, PlusIcon, CameraIcon } from '@heroicons/react/24/outline'
import PostModal from '../../components/PostModal/postModal'
import { apiFetch } from '@/utils/api'

interface UserProfileCardProps {
  setRefreshTrigger: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UserProfileCard({
  setRefreshTrigger
}: UserProfileCardProps) {
  const { data: session, update } = useSession()
  const [userDescription, setUserDescription] = useState<string | null>(null)
  const [isDescriptionLoaded, setIsDescriptionLoaded] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [profileImage, setProfileImage] = useState(session?.user?.image || '')

  useEffect(() => {
    if (!session?.user?.email) return

    const fetchUserData = async () => {
      try {
        const data = await apiFetch(`/users/${session?.user?.email}`, {
          method: 'GET',
          token: session?.user?.email || undefined
        })
        console.log('📥 Descripción del backend:', data.user?.description)
        setUserDescription(data?.description || '')
        setProfileImage(data?.image || session.user?.image || '')
        setIsDescriptionLoaded(true)
      } catch (error) {
        console.error('❌ Error obteniendo perfil de usuario:', error)
      }
    }

    fetchUserData()
  }, [session])

  // ✅ Guardar la nueva descripción en el backend
  const handleSaveDescription = async () => {
    try {
      await apiFetch(`/users/profile/description`, {
        method: 'POST',
        token: session?.user?.email || undefined,
        body: { description: userDescription ?? '' }
      })

      // ❌ Eliminamos el segundo GET que pisa el valor recién guardado

      setIsDescriptionLoaded(true)
      setIsEditingDescription(false)
      setRefreshTrigger((prev) => !prev)
    } catch (error) {
      console.error('❌ Error al actualizar descripción:', error)
    }
  }

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await apiFetch(`/users/profile/update-image`, {
        method: 'PUT',
        token: session?.user?.email ?? undefined,
        body: formData
      })

      if (response?.user?.image) {
        setProfileImage(response.user.image)
        await update({
          ...session,
          user: {
            ...session?.user,
            image: response.user.image
          }
        })
      }
      setRefreshTrigger((prev) => !prev)
    } catch (error) {
      console.error('❌ Error al actualizar imagen:', error)
    } finally {
      setIsUploading(false)
    }
  }

  if (!session) return null
  return (
    <div className='md:mt-[100px] sm:mt-[80px] flex mx-auto flex-col items-center w-full max-w-2xl bg-gray-800 text-white p-6 rounded-sm border border-gray-600'>
      {/* Imagen y nombre del usuario */}
      <div className='flex items-center gap-4 w-full relative'>
        <div className='relative'>
          <Image
            src={profileImage || '/default-avatar.png'}
            alt={`Foto de perfil de ${session.user?.name || 'usuario'}`}
            width={60}
            height={60}
            className='rounded-full border-2 border-[var(--terciary)]'
          />
          <label
            htmlFor='file-upload'
            className={`absolute bottom-0 right-0 bg-gray-700 p-1 rounded-full cursor-pointer ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title='Subir nueva imagen de perfil'
            aria-label='Subir nueva imagen de perfil'
          >
            {isUploading ? (
              <span
                className='text-white text-xs animate-pulse'
                aria-hidden='true'
              >
                ⏳
              </span>
            ) : (
              <CameraIcon className='w-5 h-5 text-white' aria-hidden='true' />
            )}
          </label>
          <input
            id='file-upload'
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='hidden'
            disabled={isUploading}
            aria-label='Selector de imagen de perfil'
          />
        </div>

        <div className='flex-1'>
          <h2 className='text-lg font-semibold'>{session.user?.name}</h2>
          {!isEditingDescription ? (
            <div key={userDescription}>
              <p
                className='text-gray-300 text-sm'
                // aria-live="polite" // opcional si quieres que lectores de pantalla notifiquen cambios
              >
                {isDescriptionLoaded
                  ? userDescription !== null &&
                    userDescription !== undefined &&
                    userDescription !== ''
                    ? userDescription
                    : 'Añade una descripción sobre ti'
                  : 'Cargando...'}
              </p>
            </div>
          ) : (
            <textarea
              value={userDescription || ''}
              onChange={(e) => setUserDescription(e.target.value)}
              className='w-full bg-gray-700 text-white p-2 rounded-md mt-2 border border-gray-500'
              rows={2}
              aria-label='Campo para editar descripción de perfil'
            />
          )}
        </div>

        <button
          onClick={() =>
            isEditingDescription
              ? handleSaveDescription()
              : setIsEditingDescription(true)
          }
          className='bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-all shadow-lg'
          title={
            isEditingDescription ? 'Guardar descripción' : 'Editar descripción'
          }
          aria-label={
            isEditingDescription ? 'Guardar descripción' : 'Editar descripción'
          }
        >
          {isEditingDescription ? (
            <PlusIcon className='w-5 h-5' aria-hidden='true' />
          ) : (
            <PencilIcon className='w-5 h-5' aria-hidden='true' />
          )}
        </button>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className='mt-4 w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-sm transition-all font-semibold'
        title='Crear nueva publicación'
        aria-label='Crear nueva publicación'
      >
        Crear Publicación
      </button>

      {isModalOpen && (
        <PostModal
          onClose={() => setIsModalOpen(false)}
          onPostPublished={() => setRefreshTrigger((prev: boolean) => !prev)}
        />
      )}
    </div>
  )
}
