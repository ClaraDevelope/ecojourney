'use client'
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L, { LatLngExpression, Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 🔹 Solución para el icono de Leaflet en Next.js
const defaultIcon = new Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface Coordinates {
  lat: number
  lng: number
}

interface MapProps {
  origin: Coordinates
  destination: Coordinates
  transportMode: string
}

export default function Map({ origin, destination, transportMode }: MapProps) {
  const [zoom, setZoom] = useState(8)
  const [route, setRoute] = useState<LatLngExpression[] | null>(null)

  useEffect(() => {
    if (origin && destination && transportMode) {
      const originLatLng = L.latLng(origin.lat, origin.lng)
      const destinationLatLng = L.latLng(destination.lat, destination.lng)

      // 🔹 Calcular distancia y ajustar zoom
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

      // 🔹 Obtener ruta desde OpenRouteService
      const fetchRoute = async () => {
        let mode = ''
        switch (transportMode) {
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
  }, [origin, destination, transportMode])

  return (
    <div className='relative w-full h-full'>
      <MapContainer
        center={origin || { lat: 41.65, lng: -4.72 }}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 🔹 Marcadores de origen y destino usando el icono forzado */}
        {origin && <Marker position={origin} icon={defaultIcon} />}
        {destination && <Marker position={destination} icon={defaultIcon} />}

        {/* 🔹 Dibujar ruta si existe */}
        {route && route.length > 0 && (
          <Polyline positions={route} color='blue' />
        )}
      </MapContainer>
    </div>
  )
}
