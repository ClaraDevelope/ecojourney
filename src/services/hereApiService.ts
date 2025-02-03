import { HERE_API_CONFIG } from '@/config/hereApiConfig'

export async function fetchSuggestions(
  query: string,
  lat: number | null = null,
  lon: number | null = null
) {
  try {
    const params = new URLSearchParams({
      q: query.trim(),
      limit: '5',
      apiKey: HERE_API_CONFIG.API_KEY
    })

    // console.log(`${HERE_API_CONFIG.AUTOCOMPLETE_URL}?${params.toString()}`)

    if (lat !== null && lon !== null) {
      params.append('at', `${lat},${lon}`)
    }

    const response = await fetch(
      `${HERE_API_CONFIG.AUTOCOMPLETE_URL}?${params.toString()}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error en la respuesta del servidor:', errorData)
      throw new Error('Error al obtener las sugerencias')
    }

    const data = await response.json()
    // console.log(data)
    return data.items
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function fetchGeocode(query: string) {
  try {
    const params = new URLSearchParams({
      q: query.trim(),
      apiKey: HERE_API_CONFIG.API_KEY
    })

    const response = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?${params}`
    )
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error en la respuesta del servidor:', errorData)
      throw new Error('Error al obtener las coordenadas')
    }

    const data = await response.json()

    // Retorna la primera sugerencia con coordenadas (lat, lon)
    const location = data.items[0]?.position
    return location ? location : null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function fetchRoute(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  transportMode: string = 'bicycle',
  origin: string
) {
  try {
    const params = new URLSearchParams({
      apiKey: HERE_API_CONFIG.API_KEY,
      departure: `${lat1},${lon1}`,
      destination: `${lat2},${lon2}`,
      transportMode: transportMode,
      origin: origin
    })
    params.forEach((value, key) => {
      console.log(`${key}: ${value}`)
    })

    // console.log('Parámetros URL:')
    // Object.entries(Object.fromEntries(params)).forEach(([key, value]) => {
    //   console.log(`${key}: ${value}`)
    // })

    const response = await fetch(
      `https://router.hereapi.com/v8/routes?${params.toString()}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error en la respuesta del servidor:', errorData)
      throw new Error('Error al obtener la ruta')
    }

    const data = await response.json()
    console.log(data)

    if (data.routes && data.routes[0] && data.routes[0].sections[0]) {
      return data.routes[0].sections[0].polyline
    }

    throw new Error('No se encontró una ruta.')
  } catch (error) {
    console.error('Error en fetchRoute:', error)
    throw new Error('Hubo un error al obtener la ruta')
  }
}

// export async function fetchRoute(
//   startLat: number,
//   startLon: number,
//   endLat: number,
//   endLon: number,
//   mode: string = 'bicycle' // Cambiar a un modo válido como 'bicycle', 'car', 'publicTransport', etc.
// ) {
//   try {
//     const params = new URLSearchParams({
//       origin: `${startLat},${startLon}`,
//       destination: `${endLat},${endLon}`,
//       // Agregar parámetros para los modos de transporte que necesitamos
//       // Si no quieres añadir más opciones de transporte, usa el parámetro básico 'mode'
//       'vehicle[modes]': mode,
//       alternatives: '3', // Definir cuántas rutas alternativas quieres recibir
//       apiKey: HERE_API_CONFIG.API_KEY // La API Key sigue igual
//     })

//     const response = await fetch(
//       `https://intermodal.router.hereapi.com/v8/routes?${params}`
//     )

//     if (!response.ok) {
//       const errorData = await response.json()
//       console.error('Error en la respuesta del servidor:', errorData)
//       throw new Error('Error al obtener la ruta')
//     }

//     const data = await response.json()
//     console.log(data)
//     return data?.routes[0]
//     // return data.routes[0]?.sections[0]?.polyline
//   } catch (error) {
//     console.error(error)
//     return null
//   }
// }
