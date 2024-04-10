import { useEffect, useState } from 'react'
import { type GalleryWallpaper, useWallpaperManager } from '@/providers/wallpaper-manager'

export const useGallery = () => {
  const { wallpapers } = useWallpaperManager()
  const [galleryWallpapers, setGalleryWallpapers] = useState<GalleryWallpaper[]>([])

  const searchWallpapers = (search: string) => {
    if (!search) {
      return wallpapers
    }

    return wallpapers.filter(({ filename }) => filename.toLowerCase().includes(search.toLowerCase()))
  }

  const handleSearch = (search: string) => {
    const filtered = searchWallpapers(search)

    setGalleryWallpapers(filtered)
  }

  useEffect(() => {
    setGalleryWallpapers(wallpapers)
  }, [wallpapers])

  return {
    galleryWallpapers,
    handleSearch,
  }
}
