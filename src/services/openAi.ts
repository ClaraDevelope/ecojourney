export const fetchRecommendations = async (
  origen: string,
  destino: string
): Promise<string> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ origen, destino })
    })
    console.log(response.body)
    console.log(response)

    if (!response.ok) {
      throw new Error('Error en la respuesta del backend')
    }

    const data = await response.json()
    return data.recommendations
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return 'No se pudo obtener información en este momento.'
  }
}
