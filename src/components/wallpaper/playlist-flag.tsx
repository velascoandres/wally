interface Props {
  playlistEnable: boolean
}

export const PlaylistFlag = ({ playlistEnable }: Props) => {
  return (
    <div className="fixed bottom-0 left-0 z-20 inline-flex cursor-default select-none items-center gap-2 rounded-tr-md border border-border bg-background px-2 py-1">
      {playlistEnable && (
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/75 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary/75"></span>
        </span>
      )}
      <p className="mx-auto text-pretty text-xs font-semibold text-primary/75">
        {playlistEnable ? 'Playlist' : 'Single'} mode
      </p>
    </div>
  )
}
