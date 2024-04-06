import { Outlet } from 'react-router-dom'

import { Images, ListVideo } from 'lucide-react'

import { TabLink, TabRouter } from '@/components/navigation/tab-router'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { CommandMenu } from '@/components/navigation/command-menu'
import { useEffect } from 'react'
import { invoke } from '@tauri-apps/api'

const Root = () => {
  useEffect(() => {
    void invoke('listen_folder')
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen w-full flex flex-col items-center gap-2 pb-4">
        <header className="inline-flex gap-2 justify-start w-full px-2 py-1 items-center z-50">
          <h1 className="text-2xl font-bold">Wally</h1>
          <CommandMenu />
        </header>
        <TabRouter>
          <TabLink path="/">
            <div className="flex flex-row items-center justify-center gap-1">
              <Images className="w-4" /> <span>Gallery</span>
            </div>
          </TabLink>
          <TabLink path="/playlist">
            <div className="flex flex-row items-center justify-center gap-1">
              <ListVideo className="w-4" /> <span>Playlist</span>
            </div>
          </TabLink>
        </TabRouter>
        <main className="w-full flex-1">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default Root
