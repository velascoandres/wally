import { Fullscreen, Wallpaper, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  name: string
  imageUrl: string
  inPlaylist?: boolean
  isDesktopPicture?: boolean
}

export const PictureCard = ({ name, imageUrl, inPlaylist, isDesktopPicture }: Props) => {
  return (
    <>
      <article className="relative overflow-hidden h-48 w-72 md:w-96 rounded-md border border-border group">
        <div className="absolute backdrop-blur-sm group-hover:block transition ease-out duration-300 hidden bg-neutral-800/50 h-full w-full z-20">
          <div className="flex flex-col justify-center items-center w-full h-full gap-2">
            <h3 className="text-white font-bold text-xl">{name}</h3>
            <Button variant="secondary" className="bg-emerald-500 hover:bg-emerald-700">
              <Wallpaper className="h-5 w-5 mr-2" /> Set desktop picture
            </Button>

            <div className="inline-flex gap-2 justify-center text-white">
              <div className="group/tp relative basis-1/3 flex-1">
                <Button variant="ghost" className="transition ease-in">
                  <Fullscreen className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <img
          src={imageUrl}
          alt={name}
          className="transition ease-in aspect-video object-cover group-hover:scale-105 h-48 w-72 md:w-96"
        />
        {inPlaylist && (
          <span className="absolute bottom-0 right-0 z-30 py-1 px-4 text-xs rounded-tl-md border-neutral-800 border-t border-l bg-indigo-600 text-white">
            In playlist
          </span>
        )}
        {isDesktopPicture && <Star className="w-5 h-5 z-30 absolute top-0 left-1 text-black" fill="yellow" />}
      </article>
    </>
  )
}
