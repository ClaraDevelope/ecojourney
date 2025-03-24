'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import {
  HomeIcon,
  GlobeAltIcon,
  MapIcon,
  FingerPrintIcon
} from '@heroicons/react/24/solid'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='fixed top-0 left-0 right-0 z-[9999999999] bg-transparent backdrop-blur-lg text-white py-4 px-6 flex justify-between items-center'>
      {/* Logo o título centrado en desktop */}
      <div
        className='hidden md:flex justify-center absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold tracking-wide'
        aria-label='Logo de EcoJourney'
        title='EcoJourney - Inicio'
      >
        <span className='text-[var(--terciary)]'>Eco</span>Journey
      </div>

      {/* Navbar visible en desktop */}
      <div className='hidden md:flex space-x-8 text-lg font-medium'>
        <Link
          href='/'
          aria-label='Ir al inicio'
          title='Inicio'
          className={`flex items-center gap-2 ${
            pathname === '/'
              ? 'text-[var(--terciary)] font-semibold'
              : 'hover:text-gray-300 font-medium'
          }`}
        >
          <HomeIcon className='w-5 h-5' aria-hidden='true' /> Inicio
        </Link>
        <Link
          href='/mapa'
          aria-label='Abrir mapa'
          title='Mapa'
          className={`flex items-center gap-2 ${
            pathname === '/mapa'
              ? 'text-[var(--terciary)]'
              : 'hover:text-gray-300'
          }`}
        >
          <GlobeAltIcon className='w-5 h-5' aria-hidden='true' /> Mapa
        </Link>
        <Link
          href='/descubre'
          aria-label='Explorar rutas compartidas'
          title='Descubre'
          className={`flex items-center gap-2 ${
            pathname === '/descubre'
              ? 'text-[var(--terciary)]'
              : 'hover:text-gray-300'
          }`}
        >
          <FingerPrintIcon className='w-5 h-5' aria-hidden='true' /> Descubre
        </Link>
        {session && (
          <Link
            href='/mis-rutas'
            aria-label='Ver tus rutas'
            title='Mis Rutas'
            className={`flex items-center gap-2 ${
              pathname === '/mis-rutas'
                ? 'text-[var(--terciary)]'
                : 'hover:text-gray-300'
            }`}
          >
            <MapIcon className='w-5 h-5' aria-hidden='true' /> Mis Rutas
          </Link>
        )}
      </div>

      {/* Autenticación en desktop */}
      <div className='hidden md:flex items-center gap-6'>
        {session ? (
          <div className='relative'>
            <Image
              src={session.user?.image || '/default-avatar.png'}
              alt={session.user?.name || 'Avatar'}
              title='Abrir menú de usuario'
              width={40}
              height={40}
              className='rounded-full border-2 border-[var(--terciary)] cursor-pointer'
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
              <div className='absolute right-0 mt-2 w-44 bg-gray-800 text-white rounded-md shadow-lg z-50'>
                <button
                  onClick={() => signOut()}
                  className='flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 transition'
                  aria-label='Cerrar sesión'
                  title='Cerrar sesión'
                >
                  <ArrowRightOnRectangleIcon
                    className='w-5 h-5 mr-2'
                    aria-hidden='true'
                  />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className='px-4 py-2 text-sm font-medium text-white border-2 border-[var(--terciary)] rounded-lg hover:bg-[var(--terciary)] hover:text-black transition'
            aria-label='Iniciar sesión con Google'
            title='Iniciar sesión'
          >
            Iniciar Sesión
          </button>
        )}
      </div>

      {/* Navbar inferior en móvil */}
      <div className='md:hidden fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-lg p-4 flex justify-between items-center rounded-t-lg shadow-lg z-50 pb-6'>
        <Link
          href='/'
          aria-label='Ir al inicio'
          title='Inicio'
          className={`flex flex-col items-center ${
            pathname === '/' ? 'text-[var(--terciary)]' : 'hover:text-gray-300'
          }`}
        >
          <HomeIcon className='w-6 h-6' aria-hidden='true' />
          <span className='text-xs'>Inicio</span>
        </Link>
        <Link
          href='/mapa'
          aria-label='Abrir mapa'
          title='Mapa'
          className={`flex flex-col items-center ${
            pathname === '/mapa'
              ? 'text-[var(--terciary)]'
              : 'hover:text-gray-300'
          }`}
        >
          <GlobeAltIcon className='w-6 h-6' aria-hidden='true' />
          <span className='text-xs'>Mapa</span>
        </Link>
        <Link
          href='/descubre'
          aria-label='Explorar rutas compartidas'
          title='Descubre'
          className={`flex flex-col items-center ${
            pathname === '/descubre'
              ? 'text-[var(--terciary)]'
              : 'hover:text-gray-300'
          }`}
        >
          <FingerPrintIcon className='w-6 h-6' aria-hidden='true' />
          <span className='text-xs'>Descubre</span>
        </Link>
        {session && (
          <Link
            href='/mis-rutas'
            aria-label='Ver tus rutas'
            title='Mis Rutas'
            className={`flex flex-col items-center ${
              pathname === '/mis-rutas'
                ? 'text-[var(--terciary)]'
                : 'hover:text-gray-300'
            }`}
          >
            <MapIcon className='w-6 h-6' aria-hidden='true' />
            <span className='text-xs'>Mis Rutas</span>
          </Link>
        )}

        {/* Avatar / Autenticación en móvil */}
        {session ? (
          <div className='relative'>
            <Image
              src={session.user?.image || '/default-avatar.png'}
              alt={session.user?.name || 'Avatar'}
              title='Abrir menú de usuario'
              width={36}
              height={36}
              className='rounded-full border-2 border-[var(--terciary)] cursor-pointer'
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
              <div className='absolute right-0 mt-2 w-36 bg-gray-800 text-white rounded-md shadow-lg z-50'>
                <button
                  onClick={() => signOut()}
                  className='flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 transition'
                  aria-label='Cerrar sesión'
                  title='Cerrar sesión'
                >
                  <ArrowRightOnRectangleIcon
                    className='w-5 h-5 mr-2'
                    aria-hidden='true'
                  />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className='px-4 py-2 text-xs font-medium text-white border-2 border-[var(--terciary)] rounded-lg hover:bg-[var(--terciary)] hover:text-black transition'
            aria-label='Iniciar sesión con Google'
            title='Iniciar sesión'
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  )
}
