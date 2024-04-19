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

interface WallpaperConfigRaw {
  current_picture?: string
  contained_folder: Folder
  playlist_enable: boolean
  playlist_time: number
}

export interface WallpaperConfig {
  currentPicture?: string
  containedFolder: Folder
  playlistEnable: boolean
  playlistTime: number
}

export type PlaylistSettingsOptions = Pick<WallpaperConfig, 'playlistTime' | 'playlistEnable'>

export interface WallpaperManagerContextType {
  config?: WallpaperConfig
  isLoading: boolean
  wallpapers: GalleryWallpaper[]

  changeWallpaper: (path: string) => Promise<void>
  changeWallpapersFolder: () => Promise<void>
  changePlaylistSettings: (settings: PlaylistSettingsOptions) => Promise<void>
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

const wallpaperDto = (rawConfig: WallpaperConfigRaw): WallpaperConfig => ({
  containedFolder: rawConfig.contained_folder,
  playlistEnable: rawConfig.playlist_enable,
  playlistTime: rawConfig.playlist_time,
  currentPicture: rawConfig.current_picture,
})

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
    try {
      const documentsPath = await documentDir()

      const selectedDir = await open({ defaultPath: documentsPath, directory: true })

      await invoke(COMMANDS.CHANGE_FOLDER, { dir: selectedDir })
      const updatedConfig = await invoke<WallpaperConfigRaw>(COMMANDS.GET_WALLPAPER_CONFIG)

      setConfig(wallpaperDto(updatedConfig))

      toast({
        title: '🚀 Source folder changed',
        description: selectedDir,
      })
    } catch (err) {
      console.error(err)

      toast({
        title: '🚨 Error on changing folder',
      })
    }
  }

  const reloadConfig = async () => {
    const config = await invoke<WallpaperConfigRaw>(COMMANDS.GET_WALLPAPER_CONFIG)
    setConfig(wallpaperDto(config))
  }

  const changeWallpaper = async (picturePath: string) => {
    await invoke(COMMANDS.SET_WALLPAPER, { picturePath })

    await reloadConfig()

    toast({
      title: '🚀 Wallpaper changed',
      description: picturePath,
    })
  }

  const changePlaylistSettings = async (settings: PlaylistSettingsOptions) => {
    try {
      await invoke<void>(COMMANDS.CHANGE_PLAYLIST_SETTINGS, settings)

      await reloadConfig()

      toast({
        title: '🚀 Updated playlist settings',
      })
    } catch (error) {
      toast({
        title: '🚨 Error on updating playlist settings',
      })
    }
  }

  useEffect(() => {
    setIsLoading(true)
    void invoke<WallpaperConfigRaw>(COMMANDS.GET_WALLPAPER_CONFIG).then((rawConfig) => {
      setConfig({
        containedFolder: rawConfig.contained_folder,
        playlistEnable: rawConfig.playlist_enable,
        playlistTime: rawConfig.playlist_time,
        currentPicture: rawConfig.current_picture,
      })
    })
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
          currentPicture: payload.data.path,
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
        changeWallpapersFolder,
        changeWallpaper,
        changePlaylistSettings,
      }}
    >
      {children}
    </WallpaperManagerContext.Provider>
  )
}

export const useWallpaperManager = () => useContext(WallpaperManagerContext)!
