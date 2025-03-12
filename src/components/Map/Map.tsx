'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L, { LatLngExpression, Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { apiFetch } from '@/utils/api'

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
  const { data: session } = useSession() // 🔹 Obtenemos la sesión
  const [zoom, setZoom] = useState(8)
  const [route, setRoute] = useState<LatLngExpression[] | null>(null)

  const ENABLE_FETCH = true // ❌ Cambia a true cuando quieras activar la API

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

      const fetchRoute = async () => {
        if (!ENABLE_FETCH) {
          console.log('🚧 fetchRoute desactivado temporalmente')
          return
        }

        if (!session?.user?.email) {
          console.error('⛔ No hay usuario autenticado')
          return
        }

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
          const data = await apiFetch(
            `/routes/fetch-route?mode=${mode}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`,
            { token: session.user.email }
          )

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
  }, [origin, destination, transportMode, session])

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
