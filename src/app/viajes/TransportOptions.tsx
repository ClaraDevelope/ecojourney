import React, { useEffect, useState } from 'react'
import { fetchRoute } from '@/services/hereApiService'

interface Coordinates {
  lat: number
  lng: number
}

interface TransportOption {
  mode: string
  co2Factor: number // Factor de CO2 por km (g/km)
}

const transportOptions: TransportOption[] = [
  { mode: 'Coche', co2Factor: 120 },
  { mode: 'Bicicleta', co2Factor: 0 },
  { mode: 'Transporte público', co2Factor: 20 }
]

const transportModeMapping: { [key: string]: string } = {
  Coche: 'car',
  Bicicleta: 'bicycle'
}

const calculateDistance = (origin: Coordinates, destination: Coordinates) => {
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

  return R * c // Distancia en kilómetros
}

const TransportOptions: React.FC<{
  origin: Coordinates | null
  destination: Coordinates | null
  setRouteData: React.Dispatch<React.SetStateAction<string | null>> // Estado para la ruta
}> = ({ origin, destination, setRouteData }) => {
  const [selectedTransport, setSelectedTransport] = useState<string>('') // Estado inicial como cadena vacía
  const [distance, setDistance] = useState<number | null>(null)
  const [co2Emissions, setCo2Emissions] = useState<number | null>(null)

  useEffect(() => {
    if (origin && destination) {
      const dist = calculateDistance(origin, destination)
      setDistance(dist)

      if (selectedTransport && dist) {
        const transport = transportOptions.find(
          (option) => option.mode === selectedTransport
        )
        if (transport) {
          setCo2Emissions(dist * transport.co2Factor)

          // Mapeamos el modo de transporte a la API de HERE
          const transportMode = transportModeMapping[selectedTransport] || 'car' // Valor por defecto 'car'

          // Llamar a fetchRoute con el modo de transporte mapeado
          const fetchRouteData = async () => {
            const route = await fetchRoute(
              origin.lat,
              origin.lng,
              destination.lat,
              destination.lng,
              transportMode
            )
            setRouteData(route) // Guardar la ruta en el estado
          }

          fetchRouteData()
        }
      }
    }
  }, [origin, destination, selectedTransport, setRouteData])

  return (
    <div className={origin && destination ? 'bg-gray-800 p-4 mx-auto' : ''}>
      {origin && destination && (
        <>
          <h2 className='text-white text-2xl'>
            Estimación de la huella de carbono
          </h2>
          <h3 className='text-white text-lg'>
            Distancia: {distance?.toFixed(2)} km
          </h3>
          <div className='my-4'>
            <h4 className='text-white'>Seleccione un modo de transporte:</h4>
            <select
              value={selectedTransport}
              onChange={(e) => setSelectedTransport(e.target.value)}
              className='mt-2 p-2 text-black'
            >
              <option value=''>Seleccionar...</option>
              {transportOptions.map((option) => (
                <option key={option.mode} value={option.mode}>
                  {option.mode}
                </option>
              ))}
            </select>
          </div>

          {selectedTransport && (
            <div className='mt-4 text-white'>
              <h5>Emisiones estimadas:</h5>
              <p>
                {co2Emissions?.toFixed(2)} g CO2 por trayecto de{' '}
                {distance?.toFixed(2)} km usando {selectedTransport}.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TransportOptions

// import React, { useEffect, useState } from 'react'

// interface Coordinates {
//   lat: number
//   lng: number
// }

// interface TransportOption {
//   mode: string
//   co2Factor: number // Factor de CO2 por km (g/km)
// }

// const transportOptions: TransportOption[] = [
//   { mode: 'Coche', co2Factor: 120 }, // 120g/km para coche
//   { mode: 'Bicicleta', co2Factor: 0 }, // 0g/km para bicicleta
//   { mode: 'Transporte público', co2Factor: 20 } // 20g/km para transporte público
// ]

// const calculateDistance = (origin: Coordinates, destination: Coordinates) => {
//   const R = 6371 // Radio de la Tierra en kilómetros
//   const dLat = (destination.lat - origin.lat) * (Math.PI / 180)
//   const dLon = (destination.lng - origin.lng) * (Math.PI / 180)

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(origin.lat * (Math.PI / 180)) *
//       Math.cos(destination.lat * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2)
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

//   return R * c // Distancia en kilómetros
// }

// const TransportOptions: React.FC<{
//   origin: Coordinates | null
//   destination: Coordinates | null
// }> = ({ origin, destination }) => {
//   const [selectedTransport, setSelectedTransport] = useState<string | null>(
//     null
//   )
//   const [distance, setDistance] = useState<number | null>(null)
//   const [co2Emissions, setCo2Emissions] = useState<number | null>(null)

//   useEffect(() => {
//     if (origin && destination) {
//       // Calcular la distancia
//       const dist = calculateDistance(origin, destination)
//       setDistance(dist)

//       // Calcular las emisiones de CO2 para el modo de transporte seleccionado
//       if (selectedTransport && dist) {
//         const transport = transportOptions.find(
//           (option) => option.mode === selectedTransport
//         )
//         if (transport) {
//           setCo2Emissions(dist * transport.co2Factor)
//         }
//       }
//     }
//   }, [origin, destination, selectedTransport])

//   return (
//     <div className={origin && destination ? 'bg-gray-800 p-4 mx-auto' : ''}>
//       {origin && destination && (
//         <>
//           <h2 className='text-white text-2xl'>
//             Estimación de la huella de carbono
//           </h2>
//           <h3 className='text-white text-lg'>
//             Distancia: {distance?.toFixed(2)} km
//           </h3>
//           <div className='my-4'>
//             <h4 className='text-white'>Seleccione un modo de transporte:</h4>
//             <select
//               onChange={(e) => setSelectedTransport(e.target.value)}
//               className='mt-2 p-2 text-black'
//             >
//               <option value=''>Seleccionar...</option>
//               {transportOptions.map((option) => (
//                 <option key={option.mode} value={option.mode}>
//                   {option.mode}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {selectedTransport && (
//             <div className='mt-4 text-white'>
//               <h5>Emisiones estimadas:</h5>
//               <p>
//                 {co2Emissions?.toFixed(2)} g CO2 por trayecto de{' '}
//                 {distance?.toFixed(2)} km usando {selectedTransport}.
//               </p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   )
// }

// export default TransportOptions
