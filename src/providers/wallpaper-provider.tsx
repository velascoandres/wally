import { invoke } from '@tauri-apps/api'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { createContext, useContext, useEffect, useState } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { type Event } from '@tauri-apps/api/event'

export interface Wallpaper {
  filename: string
  path: string
}

export interface WallpaperContextType {
  currentDir: string
  isLoading: boolean
  wallpapers: Wallpaper[]

  changeFolder: (dir: string) => void
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
  const [currentDir, setCurrentDir] = useState('')

  const changeFolder = (dir: string) => invoke('change_folder', { dir })

  const filePathAssetDto = (file: Wallpaper): Wallpaper => ({
    filename: file.filename,
    path: convertFileSrc(file.path),
  })

  useEffect(() => {
    setIsLoading(true)

    void invoke('init_listen')
    void invoke<string>('get_current_dir').then(setCurrentDir)
    void invoke<FilesResponse>('get_files')
      .then(({ files }: FilesResponse) => files.map(filePathAssetDto))
      .then(setWallpapers)
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    appWindow.listen('files', (event: Event<FilesEventPayload>) => {
      const { payload } = event

      setWallpapers(payload.data.map(filePathAssetDto))
    })
  }, [])

  return (
    <WallpaperContext.Provider value={{ isLoading, wallpapers, currentDir, changeFolder }}>
      {children}
    </WallpaperContext.Provider>
  )
}

export const useWallpaper = () => useContext(WallpaperContext) as WallpaperContextType
