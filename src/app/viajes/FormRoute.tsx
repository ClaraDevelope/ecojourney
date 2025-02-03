'use client'
import { useState, useEffect, useRef } from 'react'
import { fetchSuggestions, fetchGeocode } from '@/services/hereApiService'
import RouteMap from './RouteMap'
import TransportOptions from './TransportOptions'

interface Suggestion {
  id: string
  title: string
}

interface Coordinates {
  lat: number
  lng: number
}

export default function FormRoute() {
  const [origen, setOrigen] = useState<string>('')
  const [destino, setDestino] = useState<string>('')
  const [origenCoords, setOrigenCoords] = useState<Coordinates | null>(null)
  const [destinoCoords, setDestinoCoords] = useState<Coordinates | null>(null)
  const [origenSuggestions, setOrigenSuggestions] = useState<Suggestion[]>([])
  const [destinoSuggestions, setDestinoSuggestions] = useState<Suggestion[]>([])

  const origenRef = useRef<HTMLDivElement>(null)
  const destinoRef = useRef<HTMLDivElement>(null)

  const coordinates = { lat: 52.5228, lon: 13.4124 }

  // Manejar cambio de input
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
        setSuggestions([])
      }
    } else {
      setSuggestions([])
    }
  }

  // Manejar selección de sugerencia y obtener coordenadas
  const handleSuggestionClick = async (
    suggestion: Suggestion,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setCoords: React.Dispatch<React.SetStateAction<Coordinates | null>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>
  ) => {
    setValue(suggestion.title)
    setSuggestions([])
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        origenRef.current &&
        !origenRef.current.contains(event.target as Node) &&
        destinoRef.current &&
        !destinoRef.current.contains(event.target as Node)
      ) {
        setOrigenSuggestions([])
        setDestinoSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='flex flex-col gap-6 mt-8'>
      <div className='flex gap-6 p-2 w-full sm:w-1/2 mx-auto bg-gray-800 text-foreground rounded-md flex-wrap shadow-lg shadow-[var(--shadow)]'>
        <div className='w-full flex flex-row flex-wrap justify-around gap-2  max-w-4xl mx-auto bg-gray-800'>
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
      <TransportOptions origin={origenCoords} destination={destinoCoords} />
      <RouteMap origin={origenCoords} destination={destinoCoords} />
    </div>
  )
}
