import { invoke } from '@tauri-apps/api'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { createContext, useContext, useEffect, useState } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { type Event } from '@tauri-apps/api/event'
import { open } from '@tauri-apps/api/dialog'
import { documentDir } from '@tauri-apps/api/path'
import { COMMANDS } from '@/constants/commands'
import { EVENTS } from '@/constants/events'
import { useToast } from '@/hooks/use-toast'

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

  changePlaylistTime: (time: number) => Promise<void>
  changeWallpaper: (path: string) => Promise<void>
  changeWallpapersFolder: () => Promise<void>
  togglePlaylist: () => Promise<void>
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

interface WallpaperEventPayload {
  message: string
  data: BaseWallpaper
}

export const WallpaperManagerContext = createContext<WallpaperManagerContextType | null>(null)

export const WallpaperManagerProvider = ({ children }: Props) => {
  const [wallpapers, setWallpapers] = useState<GalleryWallpaper[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<WallpaperConfig>()
  const { toast } = useToast()

  const filePathAssetDto = (baseWallpaper: BaseWallpaper): GalleryWallpaper => ({
    ...baseWallpaper,
    assetPath: convertFileSrc(baseWallpaper.path),
  })

  const changeWallpapersFolder = async () => {
    const documentsPath = await documentDir()

    const selectedDir = await open({ defaultPath: documentsPath, directory: true })

    await invoke(COMMANDS.CHANGE_FOLDER, { dir: selectedDir })
    await invoke<WallpaperConfig>(COMMANDS.GET_WALLPAPER_CONFIG).then(setConfig)

    toast({
      title: 'Source folder changed',
      description: selectedDir,
    })
  }

  const changeWallpaper = async (picturePath: string) => {
    await invoke(COMMANDS.SET_WALLPAPER, { picturePath })
    await invoke<WallpaperConfig>(COMMANDS.GET_WALLPAPER_CONFIG).then(setConfig)

    toast({
      title: 'Wallpaper changed',
      description: picturePath,
    })
  }

  const togglePlaylist = () => invoke<void>(COMMANDS.TOGGLE_PLAYLIST)

  const changePlaylistTime = (time: number) => invoke<void>(COMMANDS.CHANGE_PLAYLIST_TIME, { time })

  useEffect(() => {
    setIsLoading(true)

    void invoke(COMMANDS.START_LISTENING_FOLDER)
    void invoke(COMMANDS.START_LISTENING_PLAYLIST)
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

  useEffect(() => {
    void appWindow.listen(EVENTS.WALLPAPER, (event: Event<WallpaperEventPayload>) => {
      const { payload } = event

      setConfig((currentConfig) => {
        if (!currentConfig) {
          return
        }

        return {
          ...currentConfig,
          current_picture: payload.data.path,
        }
      })
    })
  }, [])

  return (
    <WallpaperManagerContext.Provider
      value={{
        isLoading,
        wallpapers,
        config,
        changePlaylistTime,
        changeWallpapersFolder,
        changeWallpaper,
        togglePlaylist,
      }}
    >
      {children}
    </WallpaperManagerContext.Provider>
  )
}

export const useWallpaperManager = () => useContext(WallpaperManagerContext)!
