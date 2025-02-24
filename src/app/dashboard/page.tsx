'use client'

import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div>
        <p>Acceso denegado. Necesitas iniciar sesión.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Bienvenido, {session.user?.name}!</h1>
      <p>¡Has iniciado sesión con Google!</p>
    </div>
  )
}
