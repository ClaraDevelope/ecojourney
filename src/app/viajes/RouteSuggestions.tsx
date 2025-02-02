'use client'
import { fetchRecommendations } from '@/services/openAi'
import { useState, useEffect } from 'react'

interface Props {
  origen: string
  destino: string
}

export default function RouteSuggestions({ origen, destino }: Props) {
  const [recommendations, setRecommendations] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (origen && destino) {
      const fetchData = async () => {
        setLoading(true)
        setRecommendations('')
        try {
          const recommendationText = await fetchRecommendations(origen, destino)
          setRecommendations(recommendationText)
        } catch (error) {
          console.error('Error fetching recommendations:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [origen, destino])

  return (
    <div className='mt-6 p-4 border rounded-md bg-gray-900 text-white'>
      <h3 className='text-lg font-bold'>Recomendaciones para tu ruta</h3>
      {loading ? (
        <p>Generando recomendaciones...</p>
      ) : (
        recommendations && (
          <div className='mt-4'>
            <p>{recommendations}</p>
          </div>
        )
      )}
    </div>
  )
}
