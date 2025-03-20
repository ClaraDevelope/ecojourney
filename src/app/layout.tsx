import type { Metadata } from 'next'
import { Special_Elite, Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import SessionWrapper from '@/components/SessionWrapper/SessionWrapper'
import Head from 'next/head'

const specialElite = Special_Elite({
  variable: '--special-elite-regular',
  weight: '400',
  subsets: ['latin']
})

const poppins = Poppins({
  variable: '--poppins',
  weight: ['400', '600', '700'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'EcoJourney',
  description:
    'Descubre, planifica y comparte rutas sostenibles con EcoJourney. Calcula tu huella de carbono según el transporte elegido, guarda y personaliza tus trayectos, y conéctate con otros usuarios a través de publicaciones, likes y reseñas.',
  keywords: [
    'rutas sostenibles',
    'huella de carbono',
    'transporte ecológico',
    'viajes eco-friendly',
    'movilidad sostenible',
    'mapas ecológicos',
    'comunidad de viajeros',
    'Next.js app'
  ],
  icons: {
    icon: '/EcoJourney-icon2.svg'
  },
  openGraph: {
    title: 'EcoJourney - Explora rutas sostenibles',
    description:
      'Planifica y comparte rutas ecológicas con EcoJourney. Calcula tu impacto ambiental y descubre nuevas formas de viajar.',
    url: 'https://ecojourney-phi.vercel.app/',
    type: 'website',
    images: [
      {
        url: '/EcoJourney-preview.png',
        width: 1200,
        height: 630,
        alt: 'EcoJourney - Explora rutas sostenibles'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoJourney - Explora rutas sostenibles',
    description:
      'Descubre, planifica y comparte rutas sostenibles con EcoJourney. Calcula tu huella de carbono y conéctate con otros viajeros.',
    images: ['/EcoJourney-preview.png']
  },
  robots: {
    index: true,
    follow: true
  },
  authors: [
    {
      name: 'Clara Manzano',
      url: 'https://portfolioclaramanzano.vercel.app/'
    }
  ]
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es' className={`${specialElite.variable} ${poppins.variable}`}>
      <Head>
        {/* 👇 Metadatos de OpenGraph y Twitter agregados manualmente */}
        <meta
          property='og:title'
          content='EcoJourney - Explora rutas sostenibles'
        />
        <meta
          property='og:description'
          content='Planifica y comparte rutas ecológicas con EcoJourney. Calcula tu impacto ambiental y descubre nuevas formas de viajar.'
        />
        <meta property='og:image' content='/EcoJourney-preview.png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://ecojourney-phi.vercel.app/' />

        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content='EcoJourney - Explora rutas sostenibles'
        />
        <meta
          name='twitter:description'
          content='Descubre, planifica y comparte rutas sostenibles con EcoJourney. Calcula tu huella de carbono y conéctate con otros viajeros.'
        />
        <meta name='twitter:image' content='/EcoJourney-preview.png' />
      </Head>
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
