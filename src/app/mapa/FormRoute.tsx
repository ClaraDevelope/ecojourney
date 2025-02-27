'use client'
import { useState } from 'react'
import LocationInput from './LocationInput'
import TransportOptions from './TransportOptions'
import RouteMap from './RouteMap'
import SaveRouteButton from './SaveRouteButton'
interface Coordinates {
  lat: number
  lng: number
}

export default function FormRoute() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [originCoords, setOriginCoords] = useState<Coordinates | null>(null)
  const [destinationCoords, setDestinationCoords] =
    useState<Coordinates | null>(null)
  const [transportMode, setTransportMode] = useState('Caminar')

  return (
    <div className='flex flex-col items-center gap-6 mt-8 p-6 text-white rounded-lg shadow-lg max-w-4xl mx-auto'>
      <div className='flex flex-col sm:flex-row justify-between gap-6 w-full bg-gray-800 p-4 rounded-md shadow-md'>
        <LocationInput
          label='Origen'
          value={origin}
          setValue={setOrigin}
          setCoords={setOriginCoords}
        />
        <LocationInput
          label='Destino'
          value={destination}
          setValue={setDestination}
          setCoords={setDestinationCoords}
        />
      </div>

      <div className='w-full bg-gray-800 p-4 rounded-md shadow-md text-center'>
        <TransportOptions
          origin={originCoords}
          destination={destinationCoords}
          onTransportChange={setTransportMode}
        />
      </div>

      <p className='mt-2 text-gray-300 text-center'>
        Modo de transporte seleccionado:{' '}
        <span className='font-semibold text-white'>{transportMode}</span>
      </p>
      <SaveRouteButton
        origin={originCoords}
        originName={origin}
        destinationName={destination}
        destination={destinationCoords}
        transportMode={transportMode}
      />

      <div className='mt-6 w-full'>
        <RouteMap
          origin={originCoords}
          destination={destinationCoords}
          selectedTransport={transportMode}
        />
      </div>
    </div>
  )
}
