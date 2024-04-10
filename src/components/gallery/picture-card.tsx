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
      <article className="relative overflow-hidden h-48 w-72 md:w-96 rounded-md border border-border group">
        <div className="absolute backdrop-blur-sm group-hover:block transition ease-out duration-300 hidden bg-neutral-800/50 h-full w-full z-20">
          <div className="flex flex-col justify-center items-center w-full h-full gap-2">
            <h3 className="text-white font-bold text-xl">{name}</h3>
            {children}
          </div>
        </div>
        <img
          src={imageUrl}
          alt={name}
          className="transition ease-in aspect-video object-cover group-hover:scale-105 h-48 w-72 md:w-96"
        />
        {isDesktopPicture && <Star className="w-8 h-8 z-30 absolute top-0 left-1 text-black" fill="yellow" />}
      </article>
    </>
  )
}
