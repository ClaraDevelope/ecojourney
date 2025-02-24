// src/app/mapa/FormRouteWrapper.tsx
'use client'

import dynamic from 'next/dynamic'
const FormRoute = dynamic(() => import('./FormRoute'), { ssr: false })

export default function FormRouteWrapper() {
  return <FormRoute />
}
