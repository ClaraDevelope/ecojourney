'use client'
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
  const [route, setRoute] = useState<LatLngExpression[] | null>(null) // Estado para la ruta

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
            mode = 'foot-walking'
            break
          case 'Tren':
          case 'Autobús':
          case 'Avión (Corto Alcance)':
            mode = 'public-transport'
            break
          default:
            return
        }

        try {
          const url = `https://api.openrouteservice.org/v2/directions/${mode}?api_key=${process.env.NEXT_PUBLIC_OPENROUTE_API_KEY}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`
          const response = await fetch(url)
          const data = await response.json()

          if (data.features && data.features.length > 0) {
            const routeSteps = data.features[0].geometry.coordinates.map(
              ([lng, lat]: [number, number]) => [lat, lng] as LatLngExpression
            )
            setRoute(routeSteps)
          }
        } catch (error) {
          console.error('Error al obtener la ruta:', error)
        }
      }

      fetchRoute()
    }
  }, [origin, destination, selectedTransport])

  return (
    <div className='relative w-full h-96 sm:h-[500px] overflow-hidden rounded-md sm:rounded-lg'>
      <MapContainer
        center={origin || { lat: 41.65, lng: -4.72 }} // Usamos el origen como centro
        zoom={zoom} // Pasamos el estado de zoom
        style={{ height: '100%', width: '100vw' }} // Ocupar todo el ancho en móvil
        key={`${origin?.lat}-${origin?.lng}-${zoom}`} // Aseguramos que el mapa se re-renderice cuando el zoom cambie
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {origin && <Marker position={origin} />}

        {destination && <Marker position={destination} />}

        {route && route.length > 0 && (
          <Polyline positions={route} color='blue' />
        )}
      </MapContainer>
    </div>
  )
}

export default RouteMap
