'use client'
import { useState, useEffect, useRef } from 'react'
import {
  fetchSuggestions,
  fetchGeocode,
  fetchRoute
} from '@/services/hereApiService'
import RouteMap from './RouteMap'
import TransportOptions from './TransportOptions'

interface Coordinates {
  lat: number
  lng: number
}

interface Suggestion {
  id: string
  title: string
}

export default function FormRoute() {
  const [origen, setOrigen] = useState<string>('') // Origen como string
  const [destino, setDestino] = useState<string>('') // Destino como string
  const [origenCoords, setOrigenCoords] = useState<Coordinates | null>(null) // Coordenadas de origen
  const [destinoCoords, setDestinoCoords] = useState<Coordinates | null>(null) // Coordenadas de destino
  const [origenSuggestions, setOrigenSuggestions] = useState<Suggestion[]>([]) // Sugerencias de origen
  const [destinoSuggestions, setDestinoSuggestions] = useState<Suggestion[]>([]) // Sugerencias de destino
  const [routeData, setRouteData] = useState<string | null>(null) // Datos de la ruta
  const [transportMode, setTransportMode] = useState<string>('bicycle') // Modo de transporte por defecto

  const origenRef = useRef<HTMLDivElement>(null)
  const destinoRef = useRef<HTMLDivElement>(null)

  const coordinates = { lat: 52.5228, lon: 13.4124 }

  // Función para manejar cambios en los inputs de origen y destino
  const handleInputChange = async (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>
  ) => {
    setValue(value)
    if (value.trim().length > 2) {
      try {
        const suggestions = await fetchSuggestions(
          value,
          coordinates.lat,
          coordinates.lon
        )
        setSuggestions(suggestions)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([]) // Limpiar sugerencias si hay error
      }
    } else {
      setSuggestions([]) // Limpiar sugerencias si el input es corto
    }
  }

  // Función para manejar cuando se hace clic en una sugerencia
  const handleSuggestionClick = async (
    suggestion: Suggestion,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setCoords: React.Dispatch<React.SetStateAction<Coordinates | null>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>
  ) => {
    setValue(suggestion.title)
    setSuggestions([]) // Limpiar las sugerencias al hacer clic
    try {
      const coords = await fetchGeocode(suggestion.title)
      if (coords) {
        setCoords({ lat: coords.lat, lng: coords.lng })
      } else {
        console.error('No se encontraron coordenadas para:', suggestion.title)
      }
    } catch (error) {
      console.error('Error al obtener coordenadas:', error)
    }
  }

  // useEffect para manejar la carga de datos de la ruta
  useEffect(() => {
    const fetchRouteData = async () => {
      if (origenCoords && destinoCoords) {
        try {
          const origin = `${origenCoords.lat},${origenCoords.lng}` // Crear el string con latitud y longitud
          const data = await fetchRoute(
            origenCoords.lat, // latitud de origen
            origenCoords.lng, // longitud de origen
            destinoCoords.lat, // latitud de destino
            destinoCoords.lng, // longitud de destino
            transportMode, // modo de transporte
            origin // el parámetro origin con el string de latitud y longitud de origen
          )
          setRouteData(data)
        } catch (error) {
          console.error('Error al obtener los datos de la ruta:', error)
        }
      }
    }

    fetchRouteData()
  }, [origenCoords, destinoCoords, transportMode])

  return (
    <div className='flex flex-col gap-6 mt-8'>
      <div className='flex gap-6 p-2 w-full sm:w-1/2 mx-auto bg-gray-800 text-foreground rounded-md flex-wrap shadow-lg shadow-[var(--shadow)]'>
        <div className='w-full flex flex-row flex-wrap justify-around gap-2 max-w-4xl mx-auto bg-gray-800'>
          <div ref={origenRef} className='relative'>
            <label htmlFor='origen' className='text-md text-[var(--terciary)]'>
              Origen
            </label>
            <input
              id='origen'
              type='text'
              placeholder='Introduce tu origen'
              className='w-full p-3 mt-2 text-[var(--background)] focus:outline-none focus:ring-2 transition'
              value={origen}
              onChange={(e) =>
                handleInputChange(
                  e.target.value,
                  setOrigen,
                  setOrigenSuggestions
                )
              }
            />
            {origenSuggestions.length > 0 && (
              <div className='absolute bg-white text-black w-full mt-2 rounded-md z-[999]'>
                {origenSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className='p-2 cursor-pointer z-[999]'
                    onClick={() =>
                      handleSuggestionClick(
                        suggestion,
                        setOrigen,
                        setOrigenCoords,
                        setOrigenSuggestions
                      )
                    }
                  >
                    {suggestion.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div ref={destinoRef} className='relative'>
            <label htmlFor='destino' className='text-md text-[var(--terciary)]'>
              Destino
            </label>
            <input
              id='destino'
              type='text'
              placeholder='Introduce tu destino'
              className='w-full p-3 mt-2 text-[var(--background)] focus:outline-none focus:ring-2 transition'
              value={destino}
              onChange={(e) =>
                handleInputChange(
                  e.target.value,
                  setDestino,
                  setDestinoSuggestions
                )
              }
            />
            {destinoSuggestions.length > 0 && (
              <div className='absolute bg-white text-black w-full mt-2 rounded-md z-[999]'>
                {destinoSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className='p-2 cursor-pointer z-[999]'
                    onClick={() =>
                      handleSuggestionClick(
                        suggestion,
                        setDestino,
                        setDestinoCoords,
                        setDestinoSuggestions
                      )
                    }
                  >
                    {suggestion.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <TransportOptions
        origin={origenCoords}
        destination={destinoCoords}
        setRouteData={setRouteData}
        transportMode={transportMode}
        setTransportMode={setTransportMode}
      />

      <RouteMap
        origin={origenCoords}
        destination={destinoCoords}
        routeData={routeData}
      />
    </div>
  )
}

// 'use client'
// import { useState, useEffect, useRef } from 'react'
// import {
//   fetchSuggestions,
//   fetchGeocode,
//   fetchRoute
// } from '@/services/hereApiService'
// import RouteMap from './RouteMap'
// import TransportOptions from './TransportOptions'

// interface Suggestion {
//   id: string
//   title: string
// }

// interface Coordinates {
//   lat: number
//   lng: number
// }
// // !A ver, problema. Para hacer la llamada fetch podemos dejarlo como está y que en hereApiService.ts siempre llame con el modo bicicleta,
// //!  o que de alguna forma llamemos desde transportOptions.tsx cuando el usuario elija el modo de transporte pero habría que tener cuidado porque el RouteMap.tsx necesita del setRouteData y eso para poder pintar la ruta en el mapa... UN POCO LÍO. Por cierto, ya no se pinta la línea recta, habría que arreglarlo también😅
// export default function FormRoute() {
//   const [origen, setOrigen] = useState<string>('')
//   const [destino, setDestino] = useState<string>('')
//   const [origenCoords, setOrigenCoords] = useState<Coordinates | null>(null)
//   const [destinoCoords, setDestinoCoords] = useState<Coordinates | null>(null)
//   const [origenSuggestions, setOrigenSuggestions] = useState<Suggestion[]>([])
//   const [destinoSuggestions, setDestinoSuggestions] = useState<Suggestion[]>([])
//   const [routeData, setRouteData] = useState<string | null>(null)

//   const origenRef = useRef<HTMLDivElement>(null)
//   const destinoRef = useRef<HTMLDivElement>(null)

//   const coordinates = { lat: 52.5228, lon: 13.4124 }

//   const handleInputChange = async (
//     value: string,
//     setValue: React.Dispatch<React.SetStateAction<string>>,
//     setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>
//   ) => {
//     setValue(value)
//     if (value.trim().length > 2) {
//       try {
//         const suggestions = await fetchSuggestions(
//           value,
//           coordinates.lat,
//           coordinates.lon
//         )
//         setSuggestions(suggestions)
//       } catch (error) {
//         console.error('Error fetching suggestions:', error)
//         setSuggestions([])
//       }
//     } else {
//       setSuggestions([])
//     }
//   }

//   const handleSuggestionClick = async (
//     suggestion: Suggestion,
//     setValue: React.Dispatch<React.SetStateAction<string>>,
//     setCoords: React.Dispatch<React.SetStateAction<Coordinates | null>>,
//     setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>
//   ) => {
//     setValue(suggestion.title)
//     setSuggestions([])
//     try {
//       const coords = await fetchGeocode(suggestion.title)
//       if (coords) {
//         setCoords({ lat: coords.lat, lng: coords.lng })
//       } else {
//         console.error('No se encontraron coordenadas para:', suggestion.title)
//       }
//     } catch (error) {
//       console.error('Error al obtener coordenadas:', error)
//     }
//   }

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         origenRef.current &&
//         !origenRef.current.contains(event.target as Node) &&
//         destinoRef.current &&
//         !destinoRef.current.contains(event.target as Node)
//       ) {
//         setOrigenSuggestions([])
//         setDestinoSuggestions([])
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   useEffect(() => {
//     const fetchRouteData = async () => {
//       if (origenCoords && destinoCoords) {
//         try {
//           const data = await fetchRoute(
//             origenCoords.lat,
//             origenCoords.lng,
//             destinoCoords.lat,
//             destinoCoords.lng
//           )
//           console.log(data)

//           setRouteData(data)
//           console.log(routeData)
//         } catch (error) {
//           console.error('Error al obtener los datos de la ruta:', error)
//         }
//       }
//     }

//     fetchRouteData()
//   }, [origenCoords, destinoCoords])

//   return (
//     <div className='flex flex-col gap-6 mt-8'>
//       <div className='flex gap-6 p-2 w-full sm:w-1/2 mx-auto bg-gray-800 text-foreground rounded-md flex-wrap shadow-lg shadow-[var(--shadow)]'>
//         <div className='w-full flex flex-row flex-wrap justify-around gap-2 max-w-4xl mx-auto bg-gray-800'>
//           <div ref={origenRef} className='relative'>
//             <label htmlFor='origen' className='text-md text-[var(--terciary)]'>
//               Origen
//             </label>
//             <input
//               id='origen'
//               type='text'
//               placeholder='Introduce tu origen'
//               className='w-full p-3 mt-2 text-[var(--background)] focus:outline-none focus:ring-2 transition'
//               value={origen}
//               onChange={(e) =>
//                 handleInputChange(
//                   e.target.value,
//                   setOrigen,
//                   setOrigenSuggestions
//                 )
//               }
//             />
//             {origenSuggestions.length > 0 && (
//               <div className='absolute bg-white text-black w-full mt-2 rounded-md z-[999]'>
//                 {origenSuggestions.map((suggestion) => (
//                   <div
//                     key={suggestion.id}
//                     className='p-2 cursor-pointer z-[999]'
//                     onClick={() =>
//                       handleSuggestionClick(
//                         suggestion,
//                         setOrigen,
//                         setOrigenCoords,
//                         setOrigenSuggestions
//                       )
//                     }
//                   >
//                     {suggestion.title}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div ref={destinoRef} className='relative'>
//             <label htmlFor='destino' className='text-md text-[var(--terciary)]'>
//               Destino
//             </label>
//             <input
//               id='destino'
//               type='text'
//               placeholder='Introduce tu destino'
//               className='w-full p-3 mt-2 text-[var(--background)] focus:outline-none focus:ring-2 transition'
//               value={destino}
//               onChange={(e) =>
//                 handleInputChange(
//                   e.target.value,
//                   setDestino,
//                   setDestinoSuggestions
//                 )
//               }
//             />
//             {destinoSuggestions.length > 0 && (
//               <div className='absolute bg-white text-black w-full mt-2 rounded-md z-[999]'>
//                 {destinoSuggestions.map((suggestion) => (
//                   <div
//                     key={suggestion.id}
//                     className='p-2 cursor-pointer z-[999]'
//                     onClick={() =>
//                       handleSuggestionClick(
//                         suggestion,
//                         setDestino,
//                         setDestinoCoords,
//                         setDestinoSuggestions
//                       )
//                     }
//                   >
//                     {suggestion.title}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <TransportOptions
//         origin={origenCoords}
//         destination={destinoCoords}
//         setRouteData={setRouteData}
//       />

//       <RouteMap
//         origin={origenCoords}
//         destination={destinoCoords}
//         routeData={routeData}
//       />
//     </div>
//   )
// }
