import type { Metadata } from 'next'
import { Special_Elite } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import SessionWrapper from '@/components/SessionWrapper/SessionWrapper'

const specialElite = Special_Elite({
  variable: '--special-elite-regular',
  weight: '400',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'EcoJourney',
  description: 'Proyecto realizado con Next.js'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es' className={specialElite.variable}>
      <body className={`min-h-screen antialiased`}>
        <SessionWrapper>
          {' '}
          {/* Ahora SessionProvider está envuelto en un Client Component */}
          <Navbar />
          {children}
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  )
}
