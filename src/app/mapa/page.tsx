import TitleSection from '@/components/TitleSection/TitleSection'
import FormRouteWrapper from './FormRouteWrapper'

export default function PageTravelSection() {
  return (
    <section className='min-h-screen'>
      <TitleSection title='Planifica tu viaje' />
      <FormRouteWrapper />
    </section>
  )
}
