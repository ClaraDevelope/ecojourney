'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <div>
      <h1 className='flex-col'>Iniciar sesión</h1>
      <button onClick={() => signIn('google')}>
        Iniciar sesión con Google
      </button>
    </div>
  )
}
