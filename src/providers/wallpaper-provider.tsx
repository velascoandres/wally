import { invoke } from '@tauri-apps/api'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { createContext, useContext, useEffect, useState } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { type Event } from '@tauri-apps/api/event'
import { open } from '@tauri-apps/api/dialog'
import { documentDir } from '@tauri-apps/api/path'
import { COMMANDS } from '@/constants/commands'
import { EVENTS } from '@/constants/events'

export interface Wallpaper {
  filename: string
  path: string
}

export interface Folder {
  dirname: string
  path: string
}

export interface WallpaperContextType {
  currentDir?: Folder
  isLoading: boolean
  wallpapers: Wallpaper[]

  changeWallpapersFolder: () => void
}

interface Props {
  children: React.ReactNode
}

interface FilesResponse {
  files: Wallpaper[]
}

interface FilesEventPayload {
  message: string
  data: Wallpaper[]
}

export const WallpaperContext = createContext<WallpaperContextType | null>(null)

export const WallpaperProvider = ({ children }: Props) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentDir, setCurrentDir] = useState<Folder>()

  const filePathAssetDto = (file: Wallpaper): Wallpaper => ({
    filename: file.filename,
    path: convertFileSrc(file.path),
  })

  const changeWallpapersFolder = async () => {
    const documentsPath = await documentDir()

    const selectedDir = await open({ defaultPath: documentsPath, directory: true })

    await invoke(COMMANDS.CHANGE_FOLDER, { dir: selectedDir })
    await invoke<Folder>(COMMANDS.GET_CURRENT_DIR).then(setCurrentDir)
  }

  useEffect(() => {
    setIsLoading(true)

    void invoke(COMMANDS.START_LISTENING_FOLDER)
    void invoke<Folder>(COMMANDS.GET_CURRENT_DIR).then(setCurrentDir)
    void invoke<FilesResponse>(COMMANDS.GET_FILES)
      .then(({ files }: FilesResponse) => files.map(filePathAssetDto))
      .then(setWallpapers)
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    appWindow.listen(EVENTS.FILES, (event: Event<FilesEventPayload>) => {
      const { payload } = event

      setWallpapers(payload.data.map(filePathAssetDto))
    })
  }, [])

  return (
    <WallpaperContext.Provider value={{ isLoading, wallpapers, currentDir, changeWallpapersFolder }}>
      {children}
    </WallpaperContext.Provider>
  )
}

export const useWallpaper = () => useContext(WallpaperContext) as WallpaperContextType
