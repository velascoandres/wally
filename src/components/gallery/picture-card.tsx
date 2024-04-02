import { Fullscreen, Split, CopyPlus, Trash, Wallpaper } from 'lucide-react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Button } from '../ui/button'

interface Props {
  name: string
  imageUrl: string
  inPlaylist?: boolean
}

export const PictureCard = ({ name, imageUrl, inPlaylist = false }: Props) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <article className="relative overflow-hidden h-48 w-96 rounded-md border border-border group">
          <div className="absolute transition ease-in hidden bg-neutral-800/30 h-full w-full backdrop-blur-sm group-hover:block z-20">
            <div className="flex flex-row justify-center items-center w-full h-full">
              <Button variant="secondary">
                <Fullscreen className="h-5 w-5 mr-2" /> Preview
              </Button>
            </div>
          </div>
          <img
            src={imageUrl}
            alt={name}
            className="transition ease-in object-cover hover:scale-105 w-full h-auto z-10"
          />
        </article>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem className="cursor-pointer flex justify-start gap-2">
          <Wallpaper className="h-5 w-5" />
          Set as wallpaper
        </ContextMenuItem>
        {inPlaylist ? (
          <ContextMenuItem className="cursor-pointer flex justify-start gap-2">
            <Split className="h-5 w-5" />
            Remove of playlist
          </ContextMenuItem>
        ) : (
          <ContextMenuItem className="cursor-pointer flex justify-start gap-2">
            <CopyPlus className="h-5 w-5" />
            Add to playlist
          </ContextMenuItem>
        )}
        <ContextMenuItem className="cursor-pointer flex justify-start gap-2">
          <Trash className="h-5 w-5" /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
