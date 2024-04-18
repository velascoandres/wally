import { Button } from '@/components/ui/button'
import { SearchBox } from '@/components/ui/search-box'
import { PictureCard } from '@/components/wallpaper/picture-card'
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
            isDesktopPicture={config?.current_picture === systemPath}
            name={filename}
            imageUrl={assetPath}
          >
            <Button
              onClick={() => void changeWallpaper(systemPath)}
              variant="secondary"
              className="bg-emerald-500 hover:bg-emerald-700"
            >
              <Wallpaper className="mr-2 h-5 w-5" /> Set desktop picture
            </Button>
          </PictureCard>
        ))}
      </section>
    </div>
  )
}

export default GalleryView
