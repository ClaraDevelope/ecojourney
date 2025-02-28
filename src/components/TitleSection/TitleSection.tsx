interface TitleSectionProps {
  title: string
}

export default function TitleSection(params: TitleSectionProps) {
  return (
    <div className='relative size-32 m-auto mt-20 w-full flex items-center justify-center'>
      <h2 className='absolute inset-x-0 bottom-0 h-16 text-center text-4xl'>
        {params.title}
      </h2>
    </div>
  )
}
