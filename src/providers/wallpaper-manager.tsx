import { invoke } from '@tauri-apps/api'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { createContext, useContext, useEffect, useState } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { type Event } from '@tauri-apps/api/event'
import { open } from '@tauri-apps/api/dialog'
import { documentDir } from '@tauri-apps/api/path'
import { COMMANDS } from '@/constants/commands'
import { EVENTS } from '@/constants/events'

interface BaseWallpaper {
  filename: string
  path: string
}

export interface GalleryWallpaper extends BaseWallpaper {
  assetPath: string
}

export interface Folder {
  dirname: string
  path: string
}

export interface WallpaperConfig {
  current_picture?: string
  contained_folder: Folder
  playlist_enable: boolean
  playlist_time: number
}

export interface WallpaperManagerContextType {
  config?: WallpaperConfig
  isLoading: boolean
  wallpapers: GalleryWallpaper[]

  changeWallpaper: (path: string) => Promise<void>
  changeWallpapersFolder: () => Promise<void>
}

interface Props {
  children: React.ReactNode
}

interface FilesResponse {
  files: GalleryWallpaper[]
}

interface FilesEventPayload {
  message: string
  data: GalleryWallpaper[]
}

export const WallpaperManagerContext = createContext<WallpaperManagerContextType | null>(null)

export const WallpaperManagerProvider = ({ children }: Props) => {
  const [wallpapers, setWallpapers] = useState<GalleryWallpaper[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<WallpaperConfig>()

  const filePathAssetDto = (baseWallpaper: BaseWallpaper): GalleryWallpaper => ({
    ...baseWallpaper,
    assetPath: convertFileSrc(baseWallpaper.path),
  })

  const changeWallpapersFolder = async () => {
    const documentsPath = await documentDir()

    const selectedDir = await open({ defaultPath: documentsPath, directory: true })

    await invoke(COMMANDS.CHANGE_FOLDER, { dir: selectedDir })
    await invoke<WallpaperConfig>(COMMANDS.GET_WALLPAPER_CONFIG).then(setConfig)
  }

  const changeWallpaper = async (picturePath: string) => {
    await invoke(COMMANDS.SET_WALLPAPER, { picturePath })
    await invoke<WallpaperConfig>(COMMANDS.GET_WALLPAPER_CONFIG).then(setConfig)
  }

  useEffect(() => {
    setIsLoading(true)

    void invoke(COMMANDS.START_LISTENING_FOLDER)
    void invoke<WallpaperConfig>(COMMANDS.GET_WALLPAPER_CONFIG).then(setConfig)
    void invoke<FilesResponse>(COMMANDS.GET_FILES)
      .then(({ files }: FilesResponse) => files.map(filePathAssetDto))
      .then(setWallpapers)
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void appWindow.listen(EVENTS.FILES, (event: Event<FilesEventPayload>) => {
      const { payload } = event

      setWallpapers(payload.data.map(filePathAssetDto))
    })
  }, [])

  return (
    <WallpaperManagerContext.Provider
      value={{
        isLoading,
        wallpapers,
        config,
        changeWallpapersFolder,
        changeWallpaper,
      }}
    >
      {children}
    </WallpaperManagerContext.Provider>
  )
}

export const useWallpaperManager = () => useContext(WallpaperManagerContext)!
