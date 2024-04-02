import { Fullscreen, Split, CopyPlus, Trash, Wallpaper, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  name: string
  imageUrl: string
  inPlaylist?: boolean
  isDesktopPicture?: boolean
}

interface OptionTooltipProps {
  label: string
  icon: React.ReactNode
  onClick?: () => void
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
              <OptionTooltip label="Preview" icon={<Fullscreen className="h-5 w-5" />} />
              {inPlaylist ? (
                <OptionTooltip label="kick of playlist" icon={<Split className="h-5 w-5" />} />
              ) : (
                <OptionTooltip label="Add to playlist" icon={<CopyPlus className="h-5 w-5" />} />
              )}

              <OptionTooltip label="Delete" icon={<Trash className="h-5 w-5" />} />
            </div>
          </div>
        </div>
        <img
          src={imageUrl}
          alt={name}
          className="transition ease-in object-cover group-hover:scale-105 h-48 w-72 md:w-96"
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

const OptionTooltip = ({ icon, label }: OptionTooltipProps) => {
  return (
    <div className="group/tp relative basis-1/3 flex-1">
      <Button variant="ghost" className="transition ease-in">
        {icon}
      </Button>
      <div className="absolute top-10 rounded-md px-2 py-1 bg-primary text-secondary hidden group-hover/tp:block text-xs">
        <span className="w-full">{label}</span>
      </div>
    </div>
  )
}
