import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Coordinates {
  lat: number
  lng: number
}

interface Props {
  origin: Coordinates | null
  destination: Coordinates | null
}

const RouteMap: React.FC<Props> = ({ origin, destination }) => {
  const [zoom, setZoom] = useState(8) // Estado para el nivel de zoom

  useEffect(() => {
    if (origin && destination) {
      const originLatLng = L.latLng(origin.lat, origin.lng)
      const destinationLatLng = L.latLng(destination.lat, destination.lng)

      // Calcular la distancia entre origen y destino en metros
      const distanceInMeters = originLatLng.distanceTo(destinationLatLng)

      // Convertir la distancia a kilómetros
      const distanceInKm = distanceInMeters / 1000
      console.log(`Distancia: ${distanceInKm} km`)

      // Ajustar el zoom en función de la distancia
      let newZoom = 12 // Valor predeterminado
      if (distanceInKm < 100) {
        newZoom = 11 // Más cercano para distancias cortas
      } else if (distanceInKm < 550) {
        newZoom = 8 // Para distancias medianas
      } else if (distanceInKm < 2000) {
        newZoom = 4 // Para distancias más largas
      } else {
        newZoom = 2 // Menos zoom para distancias muy largas
      }

      console.log(`Nuevo zoom: ${newZoom}`)
      setZoom(newZoom) // Actualizamos el zoom
    }
  }, [origin, destination])

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

        {origin && destination && (
          <Polyline positions={[origin, destination]} color='blue' />
        )}
      </MapContainer>
    </div>
  )
}

export default RouteMap
