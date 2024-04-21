import { Button } from '@/components/ui/button'
import { SearchBox } from '@/components/ui/search-box'
import { PictureCard } from '@/components/wallpaper/picture-card'
import { PlaylistFlag } from '@/components/wallpaper/playlist-flag'
import { useGallery } from '@/hooks/use-gallery'
import { useWallpaperManager } from '@/providers/wallpaper-manager'
import { Wallpaper } from 'lucide-react'

const GalleryView = () => {
  const { changeWallpaper, config } = useWallpaperManager()
  const { galleryWallpapers, handleSearch } = useGallery()

  return (
    <div className="flex flex-col items-center gap-2">
      <header className="sticky top-0 z-30 w-full bg-background/40 backdrop-blur-md">
        <SearchBox placeholder="Search in gallery" onSearch={handleSearch} />
      </header>
      <section className="mx-5 flex flex-row flex-wrap justify-center gap-2 py-4">
        {galleryWallpapers.map(({ filename, path: systemPath, assetPath }) => (
          <PictureCard
            key={filename}
            isDesktopPicture={config?.currentPicture === systemPath}
            name={filename}
            imageUrl={assetPath}
          >
            {config?.currentPicture !== systemPath && (
              <Button onClick={() => void changeWallpaper(systemPath)} variant="outline">
                <Wallpaper className="mr-2 h-5 w-5" /> Set desktop picture
              </Button>
            )}
          </PictureCard>
        ))}
      </section>
      <PlaylistFlag playlistEnable={!!config?.playlistEnable} />
    </div>
  )
}

export default GalleryView
