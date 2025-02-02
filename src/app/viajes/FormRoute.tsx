'use client'
import { useState, useEffect, useRef } from 'react'
import RouteSuggestions from './RouteSuggestions'
import { fetchSuggestions } from '@/services/hereApiService'

interface Suggestion {
  id: string
  title: string
}

export default function FormRoute() {
  const [origen, setOrigen] = useState<string>('')
  const [destino, setDestino] = useState<string>('')
  const [origenSuggestions, setOrigenSuggestions] = useState<Suggestion[]>([])
  const [destinoSuggestions, setDestinoSuggestions] = useState<Suggestion[]>([])

  const origenRef = useRef<HTMLDivElement>(null)
  const destinoRef = useRef<HTMLDivElement>(null)

  const coordinates = { lat: 52.5228, lon: 13.4124 }

  // Manejar el cambio de entrada para el autocompletado
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

  // Manejar clic en sugerencia
  const handleSuggestionClick = (
    suggestion: Suggestion,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>
  ) => {
    setValue(suggestion.title)
    setSuggestions([]) // Limpiar las sugerencias después de seleccionar
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
    <div className='flex flex-row gap-6 p-6 max-w-4xl mx-auto bg-gray-800 text-foreground rounded-md shadow-lg shadow-[var(--shadow)]'>
      <div ref={origenRef} className='relative w-1/3'>
        <label htmlFor='origen' className='text-md text-[var(--terciary)]'>
          Origen
        </label>
        <input
          id='origen'
          type='text'
          placeholder='Introduce tu origen'
          className='w-full p-3 mt-2 rounded-m focus:outline-none text-[var(--background)] focus:ring-2 transition'
          value={origen}
          onChange={(e) =>
            handleInputChange(e.target.value, setOrigen, setOrigenSuggestions)
          }
        />
        {origenSuggestions.length > 0 && (
          <div className='absolute bg-white text-black w-full mt-2 rounded-md'>
            {origenSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className='p-2 cursor-pointer'
                onClick={() =>
                  handleSuggestionClick(
                    suggestion,
                    setOrigen,
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

      <div ref={destinoRef} className='relative w-1/3'>
        <label htmlFor='destino' className='text-md text-[var(--terciary)]'>
          Destino
        </label>
        <input
          id='destino'
          type='text'
          placeholder='Introduce tu destino'
          className='w-full p-3 mt-2 rounded-m text-[var(--background)] focus:outline-none focus:ring-2 transition'
          value={destino}
          onChange={(e) =>
            handleInputChange(e.target.value, setDestino, setDestinoSuggestions)
          }
        />
        {destinoSuggestions.length > 0 && (
          <div className='absolute bg-white text-black w-full mt-2 rounded-md'>
            {destinoSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className='p-2 cursor-pointer'
                onClick={() =>
                  handleSuggestionClick(
                    suggestion,
                    setDestino,
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

      {/* Aquí solo pasamos el origen y destino para las recomendaciones */}
      <RouteSuggestions origen={origen} destino={destino} />
    </div>
  )
}
