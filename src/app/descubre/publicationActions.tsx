'use client'

import { useState } from 'react'
import {
  Cog6ToothIcon,
  // PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface PublicationActionsProps {
  publicationId: string
  onDelete: (id: string) => void
}

export default function PublicationActions({
  publicationId,
  onDelete
}: PublicationActionsProps) {
  const [openOptions, setOpenOptions] = useState(false)

  return (
    <div className='relative'>
      <button
        onClick={() => setOpenOptions(!openOptions)}
        className='text-gray-400 hover:text-white transition-all'
        title='Abrir opciones de publicación'
        aria-label='Abrir opciones de publicación'
        aria-expanded={openOptions}
        aria-controls='publication-options'
      >
        <Cog6ToothIcon className='w-6 h-6' aria-hidden='true' />
      </button>

      {openOptions && (
        <div
          id='publication-options'
          className='absolute right-0 mt-2 w-32 bg-gray-700 border border-gray-600 rounded-md shadow-md z-50 flex flex-col'
          role='menu'
          aria-label='Opciones de publicación'
        >
          {/* <button
            className='flex items-center px-3 py-2 text-gray-300 hover:bg-gray-600'
            title='Editar publicación'
            aria-label='Editar publicación'
            role='menuitem'
          >
            <PencilSquareIcon className='w-5 h-5 mr-2' aria-hidden='true' />
            Editar
          </button> */}
          <button
            onClick={() => onDelete(publicationId)}
            className='flex items-center px-3 py-2 text-red-400 font-semibold hover:bg-gray-600'
            title='Eliminar publicación'
            aria-label='Eliminar publicación'
            role='menuitem'
          >
            <TrashIcon className='w-5 h-5 mr-2' aria-hidden='true' />
            Eliminar
          </button>
        </div>
      )}
    </div>
  )
}
