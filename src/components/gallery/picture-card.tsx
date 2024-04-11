import { Star } from 'lucide-react'

interface Props {
  name: string
  imageUrl: string
  isDesktopPicture?: boolean
  children?: React.ReactNode
}

export const PictureCard = ({ name, imageUrl, isDesktopPicture, children }: Props) => {
  return (
    <>
      <article className="group relative h-48 w-72 overflow-hidden rounded-md border border-border md:w-96">
        <div className="absolute z-20 hidden h-full w-full bg-neutral-800/50 backdrop-blur-sm transition duration-300 ease-out group-hover:block">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <h3 className="text-xl font-bold text-white">{name}</h3>
            {children}
          </div>
        </div>
        <img
          src={imageUrl}
          alt={name}
          className="aspect-video h-48 w-72 object-cover transition ease-in group-hover:scale-105 md:w-96"
        />
        {isDesktopPicture && <Star className="absolute left-1 top-0 z-30 h-8 w-8 text-black" fill="yellow" />}
      </article>
    </>
  )
}
