import { useState, useRef, useEffect } from 'react'
import { fetchSuggestions, fetchGeocode } from '@/services/hereApiService'

interface Suggestion {
  id: string
  title: string
}

interface Coordinates {
  lat: number
  lng: number
}

export function useLocation() {
  const [location, setLocation] = useState<string>('')
  const [coords, setCoords] = useState<Coordinates | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = async (value: string) => {
    setLocation(value)
    if (value.trim().length > 2) {
      try {
        const results = await fetchSuggestions(value, 52.5228, 13.4124)
        setSuggestions(results)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      }
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = async (suggestion: Suggestion) => {
    setLocation(suggestion.title)
    setSuggestions([])
    try {
      const coords = await fetchGeocode(suggestion.title)
      if (coords) setCoords(coords)
    } catch (error) {
      console.error('Error al obtener coordenadas:', error)
    }
  }

  return {
    location,
    coords,
    suggestions,
    handleInputChange,
    handleSuggestionClick,
    inputRef
  }
}
