'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline'
import PostModal from '../../components/PostModal/postModal'

interface UserProfileCardProps {
  setRefreshTrigger: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UserProfileCard({
  setRefreshTrigger
}: UserProfileCardProps) {
  const { data: session } = useSession()
  const [description, setDescription] = useState<string | null>(null)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!session) return null

  const handleSaveDescription = () => {
    setIsEditingDescription(false)
  }

  return (
    <div className='md:mt-[100px] sm:mt-[80px] flex mx-auto flex-col items-center w-full max-w-2xl bg-gray-800 text-white p-6 rounded-sm border border-gray-600'>
      {/* Imagen y nombre del usuario */}
      <div className='flex items-center gap-4 w-full'>
        <Image
          src={session.user?.image || '/default-avatar.png'}
          alt={session.user?.name || 'Usuario'}
          width={60}
          height={60}
          className='rounded-full border-2 border-[var(--terciary)]'
        />
        <div className='flex-1'>
          <h2 className='text-lg font-semibold'>{session.user?.name}</h2>
          {!isEditingDescription ? (
            <p className='text-gray-300 text-sm'>
              {description || 'Añade una descripción sobre ti'}
            </p>
          ) : (
            <textarea
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full bg-gray-700 text-white p-2 rounded-md mt-2 border border-gray-500'
              rows={2}
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
        >
          {isEditingDescription ? (
            <PlusIcon className='w-5 h-5' />
          ) : (
            <PencilIcon className='w-5 h-5' />
          )}
        </button>
      </div>

      {/* Botón para abrir el modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className='mt-4 w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-sm transition-all font-semibold'
      >
        Crear Publicación
      </button>

      {/* Renderiza el modal si está abierto */}
      {isModalOpen && (
        <PostModal
          onClose={() => setIsModalOpen(false)}
          onPostPublished={() => setRefreshTrigger((prev: boolean) => !prev)}
        />
      )}
    </div>
  )
}
