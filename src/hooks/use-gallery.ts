import { useEffect, useState } from 'react'
import { type Wallpaper, useWallpaper } from '@/providers/wallpaper-provider'

export const useGallery = () => {
  const { wallpapers } = useWallpaper()
  const [galleryWallpapers, setGalleryWallpapers] = useState<Wallpaper[]>([])

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
