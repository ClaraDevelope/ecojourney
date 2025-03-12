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
    <footer className='bg-gray-800 text-gray-400 py-4'>
      <div className='container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left'>
        {/* 📌 Sección izquierda: Información */}
        <div>
          <h3 className='text-white font-semibold text-lg'>EcoJourney</h3>
          <p className='mt-1'>&copy; {new Date().getFullYear()} EcoJourney</p>
          <div className='flex justify-center md:justify-start gap-4 mt-2'>
            <FaEnvelope
              className='w-5 h-5 hover:text-white cursor-pointer'
              title='Email de contacto'
            />
            <FaPhone
              className='w-5 h-5 hover:text-white cursor-pointer'
              title='Teléfono de contacto'
            />
          </div>
        </div>

        {/* 📄 Sección central: Enlaces útiles */}
        <div>
          <h3 className='text-white font-semibold text-lg'>Enlaces Útiles</h3>
          <ul className='mt-2 space-y-1'>
            <li>
              <Link href='/sobre-nosotros' className='hover:text-white'>
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link href='/servicios' className='hover:text-white'>
                Servicios
              </Link>
            </li>
            <li>
              <Link href='/politica-privacidad' className='hover:text-white'>
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link href='/contacto' className='hover:text-white'>
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
            >
              <FaGithub size={20} />
            </Link>
            <Link
              href='https://www.linkedin.com/in/clara-manzano-corona/'
              target='_blank'
              className='hover:text-white'
            >
              <FaLinkedin size={20} />
            </Link>
            <Link
              href='https://portfolioclaramanzano.vercel.app/'
              target='_blank'
              className='hover:text-white'
            >
              <IoMdPlanet size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* 🚀 Créditos */}
      <div className='text-center text-sm text-gray-500 mt-6 pt-4'>
        <p className='flex items-center justify-center space-x-1'>
          <span>Designed & Developed by</span>
          <FaHeart className='text-green-400' />
          <span className='text-green-400 font-semibold'>Clara Manzano</span>
        </p>
      </div>
    </footer>
  )
}
