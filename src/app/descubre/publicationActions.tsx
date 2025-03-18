'use client'

import { useState } from 'react'
import {
  Cog6ToothIcon,
  PencilSquareIcon,
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
      >
        <Cog6ToothIcon className='w-6 h-6' />
      </button>

      {openOptions && (
        <div className='absolute right-0 mt-2 w-32 bg-gray-700 border border-gray-600 rounded-md shadow-md z-50 flex flex-col'>
          <button className='flex items-center px-3 py-2 text-gray-300 hover:bg-gray-600'>
            <PencilSquareIcon className='w-5 h-5 mr-2' />
            Editar
          </button>
          <button
            onClick={() => onDelete(publicationId)}
            className='flex items-center px-3 py-2 text-red-400 hover:bg-gray-600'
          >
            <TrashIcon className='w-5 h-5 mr-2' />
            Eliminar
          </button>
        </div>
      )}
    </div>
  )
}
