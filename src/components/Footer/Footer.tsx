'use client'

import {
  FaGithub,
  FaLinkedin,
  FaHeart,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa'
import { IoMdPlanet } from 'react-icons/io'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='bg-gray-800 text-gray-300 py-4'>
      <div className='container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left'>
        {/* 📌 Sección izquierda: Información */}
        <div>
          <h3 className='text-white font-semibold text-lg'>EcoJourney</h3>
          <p className='mt-1'>&copy; {new Date().getFullYear()} EcoJourney</p>
          <div className='flex justify-center md:justify-start gap-4 mt-2'>
            <a
              href='mailto:contacto@ecojourney.com'
              aria-label='Enviar un correo a contacto@ecojourney.com'
              title='Enviar correo'
            >
              <FaEnvelope
                className='w-5 h-5 hover:text-white cursor-pointer'
                aria-hidden='true'
              />
            </a>
            <a
              href='tel:+34123456789'
              aria-label='Llamar al número de contacto'
              title='Llamar'
            >
              <FaPhone
                className='w-5 h-5 hover:text-white cursor-pointer'
                aria-hidden='true'
              />
            </a>
          </div>
        </div>

        {/* 📄 Sección central: Enlaces útiles */}
        <div>
          <h3 className='text-white font-semibold text-lg'>Enlaces Útiles</h3>
          <ul className='mt-2 space-y-1'>
            <li>
              <Link
                href='/sobre-nosotros'
                className='hover:text-white'
                aria-label='Ir a la página Sobre Nosotros'
                title='Sobre Nosotros'
              >
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link
                href='/servicios'
                className='hover:text-white'
                aria-label='Ir a la página Servicios'
                title='Servicios'
              >
                Servicios
              </Link>
            </li>
            <li>
              <Link
                href='/politica-privacidad'
                className='hover:text-white'
                aria-label='Ir a la Política de Privacidad'
                title='Política de Privacidad'
              >
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link
                href='/contacto'
                className='hover:text-white'
                aria-label='Ir a la página de Contacto'
                title='Contacto'
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* 🔗 Sección derecha: Redes Sociales */}
        <div>
          <h3 className='text-white font-semibold text-lg'>Síguenos</h3>
          <div className='flex justify-center md:justify-start gap-4 mt-2'>
            <Link
              href='https://github.com/ClaraDevelope'
              target='_blank'
              className='hover:text-white'
              aria-label='Visita el perfil de GitHub de Clara'
              title='GitHub'
            >
              <FaGithub size={20} aria-hidden='true' />
            </Link>
            <Link
              href='https://www.linkedin.com/in/clara-manzano-corona/'
              target='_blank'
              className='hover:text-white'
              aria-label='Visita el perfil de LinkedIn de Clara'
              title='LinkedIn'
            >
              <FaLinkedin size={20} aria-hidden='true' />
            </Link>
            <Link
              href='https://portfolioclaramanzano.vercel.app/'
              target='_blank'
              className='hover:text-white'
              aria-label='Visita el portfolio de Clara Manzano'
              title='Portfolio'
            >
              <IoMdPlanet size={20} aria-hidden='true' />
            </Link>
          </div>
        </div>
      </div>

      {/* 🚀 Créditos */}
      <div className='text-center text-sm text-gray-400 mt-6 pt-4'>
        <p className='flex items-center justify-center space-x-1'>
          <span>Designed & Developed by</span>
          <FaHeart className='text-green-400' aria-hidden='true' />
          <span className='text-green-400 font-semibold'>Clara Manzano</span>
        </p>
      </div>
    </footer>
  )
}
