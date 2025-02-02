import TitleSection from '@/components/TitleSection/TitleSection'
import FormRoute from './FormRoute'

export default function PageTravelSection() {
  return (
    <section className='min-h-screen'>
      <TitleSection title='Planifica tu viaje' />
      <FormRoute />
    </section>
  )
}
