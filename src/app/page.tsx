import GridLandingLayout from '@/components/GridLandingLayout/GridLandingLayout'
// import TitleSection from '@/components/TitleSection/TitleSection'

export default function Home() {
  return (
    <section className='min-h-screen flex flex-col justify-center'>
      <h3 className='mt-20 text-[var(--paragraph)] flex justify-center items-center text-xl w-1/2 mx-auto text-center'>
        Queremos que tus viajes sean inolvidables, y que la huella que dejes en
        el planeta sea lo más pequeña posible.
      </h3>
      <GridLandingLayout />
    </section>
  )
}
