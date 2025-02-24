'use client'
import { useEffect } from 'react'

const PrivacyPolicyPage = () => {
  useEffect(() => {
    // Redirige al enlace de la política de privacidad.
    window.location.href =
      'https://www.freeprivacypolicy.com/live/ee6ea1c5-a3b4-4f39-bcc8-49885547f876'
  }, [])

  return (
    <div>
      <h1>Redirigiendo a la política de privacidad...</h1>
    </div>
  )
}

export default PrivacyPolicyPage
