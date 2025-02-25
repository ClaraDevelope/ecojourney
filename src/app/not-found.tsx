'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='min-h-screen text-center mt-20'>
      <h1 className='text-5xl'>¡Algo salió mal!</h1>
      <p className='text-2xl'>Por favor, intenta de nuevo más tarde.</p>
      <button
        onClick={() => reset()}
        className='text-yellow-600 text-3xl hover:text-yellow-400'
      >
        Intentar nuevamente
      </button>
      <p className='text-2xl'>O</p>
      <Link
        href={'/'}
        className='text-yellow-600 text-3xl hover:text-yellow-400'
      >
        Volver al inicio
      </Link>
    </div>
  )
}
