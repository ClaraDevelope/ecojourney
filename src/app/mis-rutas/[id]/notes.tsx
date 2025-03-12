'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  TrashIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  CheckIcon
} from '@heroicons/react/24/solid'
import { apiFetch } from '@/utils/api'
import DeleteConfirmationModal from './deleteConfirmationModal'

interface Note {
  _id: string
  text: string
  category: string[]
}

interface NotesProps {
  routeId: string
}

const categories = [
  'lugares',
  'clima',
  'transporte',
  'ocio',
  'gastronomía',
  'rutas',
  'otros'
]

export default function Notes({ routeId }: NotesProps) {
  const { data: session } = useSession()
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editedText, setEditedText] = useState('')
  const [editedCategories, setEditedCategories] = useState<string[]>([])
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await apiFetch(`/routes/${routeId}/notes`)
        setNotes(data.notes)
      } catch (error) {
        console.error('🚨 Error obteniendo notas:', error)
      }
    }
    fetchNotes()
  }, [routeId])

  const toggleCategory = (category: string, isEditing = false) => {
    if (isEditing) {
      setEditedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      )
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      )
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim() || selectedCategories.length === 0) return
    setLoading(true)

    try {
      const data = await apiFetch(`/routes/${routeId}/note`, {
        method: 'POST',
        token: session?.user?.email ?? undefined,
        body: { text: newNote, category: selectedCategories }
      })

      setNotes(data.route.notes)
      setNewNote('')
      setSelectedCategories([])
    } catch (error) {
      console.error('🚨 Error guardando nota:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!noteToDelete) return
    setLoading(true)

    try {
      await apiFetch(`/routes/${routeId}/notes/${noteToDelete}`, {
        method: 'DELETE',
        token: session?.user?.email ?? undefined
      })

      setNotes(notes.filter((note) => note._id !== noteToDelete))
      setNoteToDelete(null)
    } catch (error) {
      console.error('🚨 Error eliminando nota:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note._id)
    setEditedText(note.text)
    setEditedCategories(note.category)
  }

  const handleSaveEdit = async (noteId: string) => {
    if (!editedText.trim() || editedCategories.length === 0) return
    setLoading(true)

    try {
      await apiFetch(`/routes/${routeId}/notes/${noteId}`, {
        method: 'PUT',
        token: session?.user?.email ?? undefined,
        body: { text: editedText, category: editedCategories }
      })

      setNotes(
        notes.map((note) =>
          note._id === noteId
            ? { ...note, text: editedText, category: editedCategories }
            : note
        )
      )
      setEditingNoteId(null)
      setEditedText('')
      setEditedCategories([])
    } catch (error) {
      console.error('🚨 Error editando nota:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-gray-800 p-5 rounded-sm shadow-md border border-gray-700 w-full max-w-none lg:w-auto min-h-[481px]'>
      <h3 className='text-lg font-semibold mb-3'>Notas sobre la ruta</h3>
      <div className='mb-3'>
        <textarea
          className='w-full p-2 rounded-sm bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder-gray-400'
          rows={3}
          placeholder='Escribe aquí tu nota...'
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />

        <span className='text-sm font-medium mt-2 block'>
          ¿Sobre qué trata tu nota?
        </span>
        <div className='flex flex-wrap gap-2 mt-2'>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 text-sm font-medium rounded-sm transition-all ${
                selectedCategories.includes(cat)
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => toggleCategory(cat)}
              aria-label={`Seleccionar categoría ${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          className='mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-2 rounded-sm transition font-medium'
          onClick={handleAddNote}
          disabled={loading}
          title='Añadir una nueva nota'
        >
          <PlusCircleIcon className='w-5 h-5' />
          {loading ? 'Guardando...' : 'Añadir Nota'}
        </button>
      </div>

      <ul className='space-y-3'>
        {notes.map((note) => (
          <li
            key={note._id}
            className='p-3 bg-gray-700 rounded-sm flex flex-col justify-between items-start border border-gray-600 shadow-sm'
          >
            {editingNoteId === note._id ? (
              <div className='w-full'>
                <textarea
                  className='w-full p-2 rounded-sm bg-gray-600 text-white focus:ring-2 focus:ring-green-500 outline-none resize-none'
                  rows={2}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <div className='flex flex-wrap gap-2 mt-2'>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`px-3 py-1 text-sm font-medium rounded-sm transition-all ${
                        editedCategories.includes(cat)
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                      onClick={() => toggleCategory(cat, true)}
                      aria-label={`Seleccionar categoría ${cat}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button
                  className='mt-2 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-sm transition-all duration-200 ease-in-out font-medium'
                  onClick={() => handleSaveEdit(note._id)}
                  title='Guardar cambios en la nota'
                >
                  <CheckIcon className='w-5 h-5' />
                  Guardar Cambios
                </button>
              </div>
            ) : (
              <>
                <p className='text-sm'>• {note.text}</p>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {note.category.map((cat) => (
                    <span
                      key={cat}
                      className='px-2 py-1 text-xs font-medium border border-gray-500 text-gray-300 bg-gray-800/50 rounded-sm'
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <div className='flex space-x-2 mt-2 self-end'>
                  <button
                    className='text-yellow-400 hover:text-yellow-300'
                    onClick={() => handleEditNote(note)}
                  >
                    <PencilSquareIcon className='w-5 h-5' />
                  </button>
                  <button
                    className='text-red-400 hover:text-red-300'
                    onClick={() => setNoteToDelete(note._id)}
                  >
                    <TrashIcon className='w-5 h-5' />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {noteToDelete && (
        <DeleteConfirmationModal
          message='¿Seguro que quieres eliminar esta nota?'
          onClose={() => setNoteToDelete(null)}
          onConfirm={handleDeleteNote}
        />
      )}
    </div>
  )
}
