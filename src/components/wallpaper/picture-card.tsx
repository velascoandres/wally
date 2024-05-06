import { Star } from 'lucide-react'

interface Props {
  name: string
  imageUrl: string
  isDesktopPicture?: boolean
  children?: React.ReactNode
}

export const PictureCard = ({ name, imageUrl, isDesktopPicture, children }: Props) => {
  return (
    <article className="group relative h-48 w-80 overflow-hidden rounded-md border border-border">
      <div className="absolute z-20 hidden h-full w-full bg-neutral-800/50 backdrop-blur-sm transition duration-300 ease-out group-hover:block">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <h3 className="line-clamp-1 overflow-hidden text-pretty text-xl font-bold text-white">{name}</h3>
          {children}
        </div>
      </div>
      <img
        src={imageUrl}
        alt={name}
        className="aspect-video h-48 w-80 object-cover transition ease-in group-hover:scale-105"
      />
      {isDesktopPicture && (
        <div className="absolute left-0 top-0 z-20 inline-flex items-center gap-1 rounded-br-md bg-white px-2 py-1">
          <Star className="z-20 h-3 w-3 text-black" fill="white" />{' '}
          <span className="text-pretty text-xs text-black">Current wallpaper</span>
        </div>
      )}
    </article>
  )
}
