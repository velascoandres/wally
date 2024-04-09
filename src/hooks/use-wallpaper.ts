import { WallpaperContext, type WallpaperContextType } from '@/providers/wallpaper-provider'
import { useContext } from 'react'

export const useWallpaper = () => {
  const { wallpapers } = useContext(WallpaperContext) as WallpaperContextType

  return {
    wallpapers,
  }
}
