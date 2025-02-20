import React, { useEffect, useState } from 'react'

interface Coordinates {
  lat: number
  lng: number
}

interface TransportOption {
  mode: string
  co2Factor: number // Factor de CO2 por km (g/km)
}

const transportOptions: TransportOption[] = [
  { mode: 'Coche Diesel', co2Factor: 160 },
  { mode: 'Coche Gasolina', co2Factor: 120 },
  { mode: 'Coche Eléctrico', co2Factor: 0 },
  { mode: 'Bicicleta', co2Factor: 0 },
  { mode: 'Caminar', co2Factor: 0 },
  { mode: 'Coche Compartido', co2Factor: 60 },
  { mode: 'Tren', co2Factor: 30 },
  { mode: 'Autobús', co2Factor: 70 },
  { mode: 'Avión (Corto Alcance)', co2Factor: 285 }
]

const TransportOptions: React.FC<{
  origin: Coordinates | null
  destination: Coordinates | null
  onTransportChange: (transport: string) => void
}> = ({ origin, destination, onTransportChange }) => {
  const [distance, setDistance] = useState<number | null>(null)

  useEffect(() => {
    if (origin && destination) {
      // Calcular la distancia
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

      setDistance(R * c) // Distancia en kilómetros
    }
  }, [origin, destination])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTransportChange(e.target.value)
  }

  return (
    <div className='flex flex-col items-center m-auto'>
      <label className='text-[var(--terciary)]'>
        Selecciona modo de transporte:
      </label>
      <select onChange={handleChange} className='mt-2 p-2 text-black'>
        {transportOptions.map((option) => (
          <option key={option.mode} value={option.mode}>
            {option.mode}
          </option>
        ))}
      </select>

      {distance && (
        <div className='text-white mt-4'>
          <p>Distancia: {distance.toFixed(2)} km</p>
        </div>
      )}
    </div>
  )
}

export default TransportOptions
