'use client'

import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa'
import { IoMdPlanet } from 'react-icons/io'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='bg-gray-800 py-4'>
      <div className='container mx-auto flex flex-col items-center justify-center space-y-2 text-center text-gray-300'>
        <p className='flex items-center space-x-1'>
          <span>Este proyecto ha sido creado con</span>
          <FaHeart className='text-green-400' />
          <span>por Clara Manzano Corona</span>
        </p>
        <div className='flex space-x-4'>
          <Link
            href='https://github.com/ClaraDevelope'
            target='_blank'
            className='text-gray-300 hover:text-white'
            aria-label="Clara's Github"
          >
            <FaGithub size={24} />
          </Link>
          <Link
            href='https://www.linkedin.com/in/clara-manzano-corona/'
            target='_blank'
            className='text-gray-300 hover:text-white'
            aria-label="Clara's Linkedin"
          >
            <FaLinkedin size={24} />
          </Link>
          <Link
            href='https://portfolioclaramanzano.vercel.app/'
            target='_blank'
            className='text-gray-300 hover:text-white'
            aria-label="Clara's Portfolio"
          >
            <IoMdPlanet size={24} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
