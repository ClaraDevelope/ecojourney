import Image from 'next/image'

export default function GridLandingLayout() {
  return (
    <div className='grid grid-cols-6 grid-rows-6 gap-2 p-2 h-[500px] lg:h-[500px] lg:my-10 lg:mx-40 sm:mx-0 sm:min-h-[350px]'>
      <div className='col-span-2 row-span-6 opacity-90 hover:opacity-100 transition-opacity duration-300 filter contrast-125'>
        <div className='relative w-full h-full'>
          <Image
            src='/imagen-2.webp'
            alt='imagen-1'
            fill={true}
            objectFit='cover'
            loading='lazy'
            className='mix-blend-overlay'
          />
        </div>
      </div>
      <div className='col-span-2 row-span-3 col-start-3 opacity-90 hover:opacity-100 transition-opacity duration-300 filter contrast-125'>
        <div className='relative w-full h-full'>
          <Image
            src='/imagen-6.webp'
            alt='imagen-2'
            fill={true}
            objectFit='cover'
            loading='lazy'
            className='mix-blend-overlay'
          />
        </div>
      </div>
      <div className='col-span-2 row-span-3 col-start-3 row-start-4 opacity-90 hover:opacity-100 transition-opacity duration-300 filter contrast-125'>
        <div className='relative w-full h-full'>
          <Image
            src='/imagen-3.webp'
            alt='imagen-3'
            fill={true}
            objectFit='cover'
            loading='lazy'
            className='mix-blend-overlay'
          />
        </div>
      </div>
      <div className='col-span-2 row-span-6 col-start-5 row-start-1 opacity-90 hover:opacity-100 transition-opacity duration-300 filter contrast-125'>
        <div className='relative w-full h-full'>
          <Image
            src='/imagen-4.webp'
            alt='imagen-4'
            fill={true}
            objectFit='cover'
            loading='lazy'
            className='mix-blend-overlay'
          />
        </div>
      </div>
    </div>
  )
}

// import Image from 'next/image'

// export default function GridLandingLayout() {
//   return (
//     <div className='grid grid-cols-5 grid-rows-5 gap-2 p-2 h-96 my-10 mx-4'>
//       <div className='col-span-3 row-span-5 col-start-1'>
//         <div className='relative w-full h-full'>
//           <Image
//             src='/viaje.gif'
//             alt='caminando-montaña'
//             fill={true}
//             objectFit='cover'
//             loading='lazy'
//           />
//         </div>
//       </div>
//       <div className='row-span-3 col-start-4 col-span-2 '>
//         <div className='relative w-full h-full'>
//           <Image
//             src='/viaje-grupo.gif'
//             alt='caminando-montaña-grupo'
//             fill={true}
//             objectFit='cover'
//             loading='lazy'
//           />
//         </div>
//       </div>
//       <div className='row-span-2 col-start-4 row-start-4 col-span-2 '>
//         <div className='relative w-full h-full'>
//           <Image
//             src='/caminando-pareja.gif'
//             alt='caminando-pareja'
//             fill={true}
//             objectFit='cover'
//             loading='lazy'
//           />
//         </div>
//       </div>
//     </div>
//   )
// }
