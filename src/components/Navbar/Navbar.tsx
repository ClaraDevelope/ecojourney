'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession() // Obtener la sesión del usuario
  const [isOpen, setIsOpen] = useState(false) // Estado para controlar el menú

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/mapa', label: 'Mapa' }
  ]

  // Si el usuario está logueado, añadimos "Mis Rutas" a los links
  if (session) {
    links.push({ href: '/mis-rutas', label: 'Mis Rutas' })
  }

  return (
    <nav className='bg-gray-800'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-16 items-center justify-between'>
          <div className='flex flex-1 items-center justify-start'>
            <div className='flex space-x-4'>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    pathname === link.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Botón de inicio de sesión / Avatar */}
          <div className='relative'>
            {session ? (
              <div className='relative flex items-center gap-3'>
                {/* Avatar del usuario */}
                <Image
                  src={session.user?.image || '/default-avatar.png'}
                  alt={session.user?.name || 'Avatar'}
                  width={40}
                  height={40}
                  className='rounded-full border-2 border-gray-400 cursor-pointer hover:opacity-80 transition'
                  onClick={() => setIsOpen(!isOpen)}
                />

                {/* Menú desplegable */}
                {isOpen && (
                  <div className='absolute right-0 mt-20 w-44 bg-gray-700 text-white rounded-md shadow-lg z-50'>
                    <button
                      onClick={() => signOut()}
                      className='flex items-center w-full px-4 py-2 text-sm hover:bg-gray-600 transition'
                    >
                      <ArrowRightOnRectangleIcon className='w-5 h-5 mr-2' />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className='rounded-md px-4 py-2 text-sm font-medium text-gray-300 border-2 border-solid border-gray-400 hover:bg-gray-700 hover:text-white transition'
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
