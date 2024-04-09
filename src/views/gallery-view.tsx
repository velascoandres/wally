import { PictureCard } from '@/components/gallery/picture-card'
import { SearchBox } from '@/components/ui/search-box'
import { useGallery } from '@/hooks/use-gallery'

const GalleryView = () => {
  const { galleryWallpapers, handleSearch } = useGallery()

  return (
    <div className="flex flex-col gap-2">
      <header className="sticky top-0 z-50 bg-background/40 backdrop-blur-md">
        <SearchBox placeholder="Search in gallery" onSearch={handleSearch} />
      </header>
      <section className="flex flex-row flex-wrap gap-2 mx-5 py-4 justify-center">
        {galleryWallpapers.map(({ filename, path }) => (
          <PictureCard key={filename} name={filename} imageUrl={path} />
        ))}
      </section>
    </div>
  )
}

export default GalleryView
