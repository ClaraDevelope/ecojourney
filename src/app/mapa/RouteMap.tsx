import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Coordinates {
  lat: number
  lng: number
}

interface Props {
  origin: Coordinates | null
  destination: Coordinates | null
  selectedTransport: string | null
}

const RouteMap: React.FC<Props> = ({
  origin,
  destination,
  selectedTransport
}) => {
  const [zoom, setZoom] = useState(8) // Estado para el nivel de zoom
  const [route, setRoute] = useState<[number, number][] | null>(null) // Estado para la ruta

  useEffect(() => {
    if (origin && destination && selectedTransport) {
      const originLatLng = L.latLng(origin.lat, origin.lng)
      const destinationLatLng = L.latLng(destination.lat, destination.lng)

      const distanceInMeters = originLatLng.distanceTo(destinationLatLng)
      const distanceInKm = distanceInMeters / 1000

      let newZoom = 12
      if (distanceInKm < 100) {
        newZoom = 11
      } else if (distanceInKm < 550) {
        newZoom = 8
      } else if (distanceInKm < 2000) {
        newZoom = 4
      } else {
        newZoom = 2
      }

      setZoom(newZoom)

      const fetchRoute = async () => {
        let mode = ''
        switch (selectedTransport) {
          case 'Coche Diesel':
          case 'Coche Gasolina':
          case 'Coche Eléctrico':
            mode = 'driving-car'
            break
          case 'Bicicleta':
            mode = 'cycling-regular'
            break
          case 'Caminar':
            mode = 'walking'
            break
          case 'Tren':
            mode = 'driving-car'
            break
          case 'Autobús':
            mode = 'driving-car'
            break
          case 'Avión (Corto Alcance)':
            mode = 'driving-car'
            break
          default:
            return
        }

        const url = `https://api.openrouteservice.org/v2/directions/${mode}?api_key=${process.env.NEXT_PUBLIC_OPENROUTE_API_KEY}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`
        const response = await fetch(url, { method: 'GET' })
        const data = await response.json()

        if (data.features && data.features.length > 0) {
          const routeSteps = data.features[0].geometry.coordinates
          setRoute(routeSteps)
        }
      }

      fetchRoute()
    }
  }, [origin, destination, selectedTransport])

  return (
    <div className='relative w-full h-96 overflow-hidden rounded-md'>
      <MapContainer
        center={origin || { lat: 41.65, lng: -4.72 }} // Usamos el origen como centro
        zoom={zoom} // Pasamos el estado de zoom
        style={{ height: '100%', width: '100%' }}
        key={`${origin?.lat}-${origin?.lng}-${zoom}`} // Aseguramos que el mapa se re-renderice cuando el zoom cambie
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

        {origin && destination && route && route.length > 0 && (
          <Polyline
            positions={route
              .map((step) => {
                const [lng, lat] = step // Usamos directamente las coordenadas [lng, lat]
                console.log(`Coordenadas paso: ${lat}, ${lng}`) // Verifica las coordenadas
                return [lat, lng] as LatLngExpression // Explicitamos que la posición es LatLngExpression
              })
              .filter(
                (position): position is LatLngExpression => position !== null
              )} // Filtramos solo posiciones válidas
            color='blue'
          />
        )}
      </MapContainer>
    </div>
  )
}

export default RouteMap
