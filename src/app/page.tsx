import Image from 'next/image'
import Link from 'next/link'
import {
  GlobeAltIcon,
  MapIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'
import GridLandingLayout from '@/components/GridLandingLayout/GridLandingLayout'

export default function Home() {
  return (
    <section className='mt-10 min-h-screen flex flex-col justify-center'>
      <h3 className='mt-20 text-[var(--paragraph)] flex justify-center items-center text-xl w-1/2 mx-auto text-center'>
        Queremos que tus viajes sean inolvidables, y que la huella que dejes en
        el planeta sea lo más pequeña posible.
      </h3>
      <GridLandingLayout />
      <div className='relative w-full mb-2 flex flex-col items-center gap-6'>
        <div
          className='relative top-10 z-10 text-[#D0DCD0] text-4xl font-bold tracking-wide text-center
                drop-shadow-[0_0_4px_rgba(45,179,124,0.8)] 
                drop-shadow-[0_0_10px_rgba(45,179,124,0.6)] 
                drop-shadow-[0_0_14px_rgba(45,179,124,0.4)] 
                filter blur-[0.2px] opacity-95'
        >
          Explora sin dejar rastro
        </div>
        <div className='relative w-full h-40 -mt-10'>
          {Array.from({ length: 6 }, (_, i) => {
            const rotateZ = Math.random() * 360
            const flipX = Math.random() > 0.5 ? -1 : 1
            const flipY = Math.random() > 0.5 ? -1 : 1
            const top = Math.random() * 80 + '%'
            const left = Math.random() * 80 + '%'

            return (
              <div
                key={i}
                className='absolute z-0'
                style={{
                  transform: `rotate(${rotateZ}deg) scaleX(${flipX}) scaleY(${flipY})`,
                  top: top,
                  left: left
                }}
              >
                <Image
                  src='/huella-2.png'
                  alt='imagen repetida'
                  width={80}
                  height={80}
                  className='object-cover opacity-60'
                />
              </div>
            )
          })}
        </div>
        <Link
          href='/mapa'
          className='px-6 py-3 bg-[#2db37c] text-black font-bold rounded-full shadow-lg hover:bg-[#25a36f] transition text-center w-[200px]'
        >
          Planifica tu viaje
        </Link>
      </div>

      <div className='mt-16 flex flex-col items-center text-center px-6 pb-10'>
        <h4 className='text-2xl font-semibold text-[#D0DCD0] mb-6'>
          ¿Por qué EcoJourney?
        </h4>
        <div className='flex flex-col md:flex-row justify-center gap-10 max-w-4xl'>
          <div className='flex flex-col items-center bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 hover:scale-105 transition'>
            <GlobeAltIcon className='w-10 h-10 text-[#2db37c]' />
            <p className='text-lg font-medium mt-2 text-[#D0DCD0]'>
              Impacto ecológico
            </p>
            <p className='text-sm text-gray-400'>
              Calculamos la huella de ozono de tu ruta y te damos
              recomendaciones para reducirla.
            </p>
          </div>
          <div className='flex flex-col items-center bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 hover:scale-105 transition'>
            <MapIcon className='w-10 h-10 text-[#2db37c]' />
            <p className='text-lg font-medium mt-2 text-[#D0DCD0]'>
              Rutas optimizadas
            </p>
            <p className='text-sm text-gray-400'>
              Encuentra y compara las rutas más eficientes y sostenibles.
            </p>
          </div>
          <div className='flex flex-col items-center bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 hover:scale-105 transition'>
            <BookmarkIcon className='w-10 h-10 text-[#2db37c]' />
            <p className='text-lg font-medium mt-2 text-[#D0DCD0]'>
              Tus rutas favoritas
            </p>
            <p className='text-sm text-gray-400'>
              Guarda y consulta tus rutas en un espacio personal (solo para
              usuarios registrados).
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
