import Image from 'next/image'

export default function GridLandingLayout() {
  return (
    <div className='grid grid-cols-5 grid-rows-5 gap-2 p-2 h-96 my-10 mx-4'>
      <div className='col-span-3 row-span-5 col-start-1'>
        <div className='relative w-full h-full'>
          <Image
            src='/viaje.gif'
            alt='caminando-montaña'
            fill={true}
            objectFit='cover'
            loading='lazy'
          />
        </div>
      </div>
      <div className='row-span-3 col-start-4 col-span-2 '>
        <div className='relative w-full h-full'>
          <Image
            src='/viaje-grupo.gif'
            alt='caminando-montaña-grupo'
            fill={true}
            objectFit='cover'
            loading='lazy'
          />
        </div>
      </div>
      <div className='row-span-2 col-start-4 row-start-4 col-span-2 '>
        <div className='relative w-full h-full'>
          <Image
            src='/caminando-pareja.gif'
            alt='caminando-pareja'
            fill={true}
            objectFit='cover'
            loading='lazy'
          />
        </div>
      </div>
    </div>
  )
}
