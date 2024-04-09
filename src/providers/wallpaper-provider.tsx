import { invoke } from '@tauri-apps/api'
import { createContext, useEffect, useState } from 'react'

export interface WallpaperContextType {
  isLoading: boolean
  filePaths: string[]

  changeFolder: (dir: string) => void
}

interface Props {
  children: React.ReactNode
}

interface FilesResponse {
  file_paths: string[]
}

export const WallpaperContext = createContext<WallpaperContextType | null>(null)

export const WallpaperProvider = ({ children }: Props) => {
  const [filePaths, setFilePaths] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const changeFolder = (dir: string) => invoke('change_folder', { dir })

  useEffect(() => {
    setIsLoading(true)

    void invoke('init_listen')
    void invoke<FilesResponse>('get_files')
      .then(({ file_paths }: FilesResponse) => setFilePaths(file_paths))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <WallpaperContext.Provider value={{ isLoading, filePaths, changeFolder }}>{children}</WallpaperContext.Provider>
  )
}
