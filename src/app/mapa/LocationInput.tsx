'use client'
import { useState, useRef } from 'react'
import { fetchSuggestions, fetchGeocode } from '@/services/hereApiService'

interface Suggestion {
  id: string
  title: string
}

interface Coordinates {
  lat: number
  lng: number
}

interface LocationInputProps {
  label: string
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  setCoords: React.Dispatch<React.SetStateAction<Coordinates | null>>
}

export default function LocationInput({
  label,
  value,
  setValue,
  setCoords
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const inputRef = useRef<HTMLDivElement>(null)
  const coordinates = { lat: 52.5228, lng: 13.4124 }

  // Manejar cambio de input
  const handleInputChange = async (value: string) => {
    setValue(value)
    if (value.trim().length > 2) {
      try {
        const fetchedSuggestions = await fetchSuggestions(
          value,
          coordinates.lat,
          coordinates.lng
        )
        setSuggestions(fetchedSuggestions)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      }
    } else {
      setSuggestions([])
    }
  }

  // Manejar selección de sugerencia y obtener coordenadas
  const handleSuggestionClick = async (suggestion: Suggestion) => {
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

  // Buscar coordenadas cuando el usuario presiona Enter o sale del input
  const handleBlurOrEnter = async () => {
    if (value.trim() !== '') {
      try {
        const coords = await fetchGeocode(value)
        if (coords) {
          setCoords({ lat: coords.lat, lng: coords.lng })
        } else {
          console.error('No se encontraron coordenadas para:', value)
        }
      } catch (error) {
        console.error('Error al obtener coordenadas:', error)
      }
    }
  }

  return (
    <div
      ref={inputRef}
      className='flex gap-6 p-4 w-full sm:w-3/4 lg:w-1/2 mx-auto bg-gray-800 text-white rounded-md flex-wrap'
    >
      <div className='w-full flex flex-row flex-wrap justify-around gap-2 max-w-4xl mx-auto bg-gray-800'>
        <div className='relative px-2'>
          <label className='block text-md text-[var(--terciary)] mb-1'>
            {label}
          </label>
          <input
            type='text'
            placeholder={`Introduce tu ${label.toLowerCase()}`}
            className='w-full p-3 mt-2 text-[var(--background)] focus:outline-none focus:ring-2 transition'
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlurOrEnter} // Buscar coordenadas al perder el foco
            onKeyDown={(e) => e.key === 'Enter' && handleBlurOrEnter()} // Buscar coordenadas al presionar Enter
          />
          {suggestions.length > 0 && (
            <div className='absolute bg-white text-black w-full mt-2 rounded-md z-[999] shadow-lg'>
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className='p-2 cursor-pointer hover:bg-gray-200'
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
