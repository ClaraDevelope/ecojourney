'use client'
import React, { useEffect, useState } from 'react'

interface Coordinates {
  lat: number
  lng: number
}

interface TransportOption {
  mode: string
  co2Factor: number // Factor de CO2 por km (g/km)
  ozoneFactor: number // Factor de huella de ozono por km (mg/km)
  suggestions?: string[] // Sugerencias para reducir impacto ambiental
}

const transportOptions: TransportOption[] = [
  {
    mode: 'Coche Diesel',
    co2Factor: 160,
    ozoneFactor: 200,
    suggestions: [
      'Usar coche compartido (BlaBlaCar, Amovens)',
      'Optar por transporte público cuando sea posible'
    ]
  },
  {
    mode: 'Coche Gasolina',
    co2Factor: 120,
    ozoneFactor: 180,
    suggestions: [
      'Reducir velocidad y evitar aceleraciones bruscas',
      'Compartir coche en viajes largos'
    ]
  },
  {
    mode: 'Coche Eléctrico',
    co2Factor: 0,
    ozoneFactor: 50,
    suggestions: [
      'Cargar en puntos de energía renovable',
      'Usar transporte público si es viable'
    ]
  },
  {
    mode: 'Bicicleta',
    co2Factor: 0,
    ozoneFactor: 0,
    suggestions: [
      'Promover carriles bici en la ciudad',
      'Usar bicicleta compartida (BiciMAD, Valenbisi)'
    ]
  },
  {
    mode: 'Caminar',
    co2Factor: 0,
    ozoneFactor: 0,
    suggestions: [
      'Fomentar zonas peatonales',
      'Alternar caminatas con transporte público para largas distancias'
    ]
  },
  {
    mode: 'Tren',
    co2Factor: 30,
    ozoneFactor: 40,
    suggestions: [
      'Usar billetes combinados con otros transportes',
      'Elegir tren en vez de avión para distancias medias'
    ]
  },
  {
    mode: 'Autobús',
    co2Factor: 70,
    ozoneFactor: 100,
    suggestions: [
      'Usar buses eléctricos o híbridos',
      'Optar por rutas compartidas para reducir consumo'
    ]
  },
  {
    mode: 'Avión (Corto Alcance)',
    co2Factor: 285,
    ozoneFactor: 400,
    suggestions: [
      'Elegir vuelos directos para reducir consumo',
      'Compensar emisiones con programas ecológicos'
    ]
  }
]

const TransportOptions: React.FC<{
  origin: Coordinates | null
  destination: Coordinates | null
  onTransportChange: (transport: string) => void
}> = ({ origin, destination, onTransportChange }) => {
  const [distance, setDistance] = useState<number | null>(null)
  const [ozoneImpact, setOzoneImpact] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (origin && destination) {
      const R = 6371 // Radio de la Tierra en kilómetros
      const dLat = (destination.lat - origin.lat) * (Math.PI / 180)
      const dLon = (destination.lng - origin.lng) * (Math.PI / 180)

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(origin.lat * (Math.PI / 180)) *
          Math.cos(destination.lat * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

      const calculatedDistance = R * c
      setDistance(calculatedDistance)
    }
  }, [origin, destination])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMode = e.target.value
    onTransportChange(selectedMode)
    const selectedOption = transportOptions.find(
      (option) => option.mode === selectedMode
    )
    if (selectedOption && distance) {
      setOzoneImpact(distance * selectedOption.ozoneFactor)
      setSuggestions(selectedOption.suggestions || [])
    }
  }

  return (
    <div className='flex flex-col items-center m-auto'>
      <label htmlFor='transport-select' className='text-[var(--terciary)]'>
        Selecciona modo de transporte:
      </label>
      <select
        id='transport-select'
        onChange={handleChange}
        className='mt-2 p-2 text-black'
        aria-label='Selecciona el modo de transporte'
        title='Modo de transporte'
      >
        {transportOptions.map((option) => (
          <option key={option.mode} value={option.mode}>
            {option.mode}
          </option>
        ))}
      </select>

      {distance && (
        <div className='text-white mt-4'>
          <p>Distancia: {distance.toFixed(2)} km</p>
          {ozoneImpact !== null && (
            <p>Huella de ozono estimada: {ozoneImpact.toFixed(2)} mg/km</p>
          )}
          {suggestions.length > 0 && (
            <div className='mt-4'>
              <p className='text-[var(--terciary)]'>Cómo reducir tu impacto:</p>
              <ul className='list-disc pl-4'>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TransportOptions
