'use client'
import TitleSection from '@/components/TitleSection/TitleSection'
import { FaGlobe } from 'react-icons/fa'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { emissionsData } from '@/data/data' // Importa los datos desde el archivo data.js

interface CountryEmissions {
  country: string
  co2PerCapita: number
  globalRank: number
  availableData: string
}

export default function PageGlobalFootPrintSection() {
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [countryData, setCountryData] = useState<CountryEmissions | null>(null)

  useEffect(() => {
    AOS.init({
      once: true
    })
  }, [])

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value
    const data = emissionsData.find((country) => country.country === selected)
    setSelectedCountry(selected)
    setCountryData(data || null)
  }

  return (
    <section className='min-h-screen'>
      <TitleSection title='Huella Global' />
      <div
        className='flex flex-col md:flex-row items-center justify-between p-6 space-y-6 md:space-y-0 md:space-x-6 w-full max-w-4xl mx-auto bg-[var(--paragraph)] text-[var(--background)] rounded-s mb-10'
        data-aos='fade-up'
        data-aos-duration='700'
        data-aos-delay='200'
        data-aos-easing='ease-in-out'
      >
        <div className='flex-1 space-y-6 max-w-xl'>
          <FaGlobe size={32} className='text-[var(--primary-color)]' />
          <p className='leading-relaxed'>
            Las emisiones de CO₂ y la huella de carbono son algunos de los
            principales responsables del cambio climático. Cada acción que
            tomamos, desde el transporte hasta el consumo energético, tiene un
            impacto directo en el medio ambiente. Aunque a veces pueda parecer
            que nuestras pequeñas decisiones no hacen una gran diferencia, en
            conjunto, podemos lograr un cambio significativo. Ser conscientes de
            nuestra huella es el primer paso para adoptar hábitos más
            sostenibles y contribuir a la protección del planeta.
          </p>
          <div className='border-t border-[var(--secondary-color)] my-4' />
          <p className='text leading-relaxed'>
            El cambio climático es una realidad que afecta a todos, y las
            emisiones de CO₂ son un factor clave en este proceso. Nuestra huella
            de carbono refleja la cantidad de gases de efecto invernadero que
            generamos con nuestras actividades diarias. Es fundamental entender
            cómo nuestras decisiones impactan al medio ambiente, ya que incluso
            los pequeños cambios en nuestro comportamiento pueden tener un gran
            efecto colectivo. Al tomar conciencia de nuestra huella, podemos
            empezar a reducirla y hacer del mundo un lugar más sostenible para
            las generaciones futuras.
          </p>
        </div>
        <div className='flex-shrink-0 mt-6 md:mt-0'>
          <Image
            src='/huella-verde.webp'
            alt='Imagen árbol con huellas'
            width={250}
            height={300}
            className='w-full h-auto rounded-md shadow-lg'
          />
        </div>
      </div>

      <div
        className='max-w-4xl mx-auto p-6 bg-[var(--paragraph)] text-[var(--background)] rounded-s  mb-10'
        data-aos='fade-up'
        data-aos-duration='500'
        data-aos-delay='200'
        data-aos-easing='ease-in-out'
      >
        <h3 className='text-xl font-semibold mb-4'>Emisiones por país</h3>

        <select
          className='border border-[var(--secondary-color)] p-2 rounded-md w-full mb-6'
          onChange={handleCountryChange}
          value={selectedCountry}
        >
          <option value='' disabled>
            Selecciona un país
          </option>
          {emissionsData.map((data) => (
            <option key={data.country} value={data.country}>
              {data.country}
            </option>
          ))}
        </select>
        {countryData && (
          <div>
            <h4 className='font-semibold'>
              Emisiones de CO₂ de {selectedCountry}:
            </h4>
            <p>
              • Emisiones per cápita: {countryData.co2PerCapita} toneladas de
              CO₂
            </p>
            <p>
              {' '}
              • Rango global: <b>#{countryData.globalRank}</b> en el mundo
            </p>
            <p> • Datos disponibles: {countryData.availableData}</p>
          </div>
        )}
      </div>
    </section>
  )
}
