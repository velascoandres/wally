import { cn } from '@/lib/utils'

interface Props {
  playlistEnable: boolean
}

export const PlaylistFlag = ({ playlistEnable }: Props) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 z-20 cursor-default select-none rounded-tr-md border border-border bg-red-800 px-4 py-2',
        {
          'bg-red-700': playlistEnable,
          'bg-green-700': !playlistEnable,
        },
      )}
    >
      <p className="mx-auto text-pretty text-xs font-semibold text-white">
        {playlistEnable ? 'Playlist' : 'Normal'} mode
      </p>
    </div>
  )
}
