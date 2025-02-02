import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Función para decodificar la polilínea (sin librerías externas)
const decodePolyline = (encoded: string) => {
  let index = 0
  const len = encoded.length
  const points: L.LatLngTuple[] = [] // Cambié el tipo de array a LatLngTuple
  let lat = 0
  let lng = 0

  while (index < len) {
    let shift = 0
    let result = 0
    let byte
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    const dlat = result & 1 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    const dlng = result & 1 ? ~(result >> 1) : result >> 1
    lng += dlng

    points.push([lat / 1e5, lng / 1e5]) // Ahora estamos empujando LatLngTuple
  }

  return points
}

interface Coordinates {
  lat: number
  lng: number
}

interface Props {
  origin: Coordinates | null
  destination: Coordinates | null
  routeData: string | null // Ruta codificada
}

const RouteMap: React.FC<Props> = ({ origin, destination, routeData }) => {
  useEffect(() => {
    if (!origin || !destination) return
  }, [origin, destination])

  // Decodificando la ruta usando la función personalizada
  const decodedRoute = routeData ? decodePolyline(routeData) : null

  return (
    <div className='relative w-full h-96 overflow-hidden rounded-md'>
      <MapContainer
        center={origin || { lat: 41.65, lng: -4.72 }}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />

        {origin && (
          <Marker
            position={origin}
            icon={L.icon({
              iconUrl: '/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: '/marker-shadow.png',
              shadowSize: [41, 41],
              shadowAnchor: [12, 41]
            })}
          />
        )}

        {destination && (
          <Marker
            position={destination}
            icon={L.icon({
              iconUrl: '/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: '/marker-shadow.png',
              shadowSize: [41, 41],
              shadowAnchor: [12, 41]
            })}
          />
        )}

        {origin && destination && !routeData && (
          <Polyline positions={[origin, destination]} color='blue' />
        )}

        {decodedRoute && <Polyline positions={decodedRoute} color='green' />}
      </MapContainer>
    </div>
  )
}

export default RouteMap

// import React, { useEffect } from 'react'
// import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'

// interface Coordinates {
//   lat: number
//   lng: number
// }

// interface Props {
//   origin: Coordinates | null
//   destination: Coordinates | null
// }

// const RouteMap: React.FC<Props> = ({ origin, destination }) => {
//   useEffect(() => {
//     console.log(origin)
//     if (!origin || !destination) return
//   }, [origin, destination])

//   return (
//     <div className='relative w-full h-96 overflow-hidden rounded-md'>
//       <MapContainer
//         center={origin || { lat: 41.65, lng: -4.72 }} // Usamos el origen como centro
//         zoom={13}
//         style={{ height: '100%', width: '100%' }}
//         key={`${origin?.lat}-${origin?.lng}`} // Aseguramos que el mapa se re-renderice cuando las coordenadas cambian
//       >
//         <TileLayer
//           url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />

//         {origin && (
//           <Marker
//             position={origin}
//             icon={L.icon({
//               iconUrl: '/marker-icon.png',
//               iconSize: [25, 41],
//               iconAnchor: [12, 41],
//               popupAnchor: [1, -34],
//               shadowUrl: '/marker-shadow.png',
//               shadowSize: [41, 41],
//               shadowAnchor: [12, 41]
//             })}
//           />
//         )}

//         {destination && (
//           <Marker
//             position={destination}
//             icon={L.icon({
//               iconUrl: '/marker-icon.png',
//               iconSize: [25, 41],
//               iconAnchor: [12, 41],
//               popupAnchor: [1, -34],
//               shadowUrl: '/marker-shadow.png',
//               shadowSize: [41, 41],
//               shadowAnchor: [12, 41]
//             })}
//           />
//         )}

//         {origin && destination && (
//           <Polyline positions={[origin, destination]} color='blue' />
//         )}
//       </MapContainer>
//     </div>
//   )
// }

// export default RouteMap
