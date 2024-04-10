import { PictureCard } from '@/components/gallery/picture-card'
import { Button } from '@/components/ui/button'
import { SearchBox } from '@/components/ui/search-box'
import { useGallery } from '@/hooks/use-gallery'
import { useWallpaperManager } from '@/providers/wallpaper-manager'
import { Wallpaper } from 'lucide-react'

const GalleryView = () => {
  const { changeWallpaper, config } = useWallpaperManager()
  const { galleryWallpapers, handleSearch } = useGallery()

  return (
    <div className="flex flex-col gap-2">
      <header className="sticky top-0 z-30 bg-background/40 backdrop-blur-md">
        <SearchBox placeholder="Search in gallery" onSearch={handleSearch} />
      </header>
      <section className="flex flex-row flex-wrap gap-2 mx-5 py-4 justify-center">
        {galleryWallpapers.map(({ filename, path: systemPath, assetPath }) => (
          <PictureCard
            key={filename}
            isDesktopPicture={config?.current_picture === systemPath}
            name={filename}
            imageUrl={assetPath}
          >
            <Button
              onClick={() => changeWallpaper(systemPath)}
              variant="secondary"
              className="bg-emerald-500 hover:bg-emerald-700"
            >
              <Wallpaper className="h-5 w-5 mr-2" /> Set desktop picture
            </Button>
          </PictureCard>
        ))}
      </section>
    </div>
  )
}

export default GalleryView
