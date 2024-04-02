import { Outlet } from 'react-router-dom'

import { Images, ListVideo } from 'lucide-react'

import { TabLink, TabRouter } from '@/components/router/tab-router'
import { ModeToggle } from '@/components/theme/theme-mode'
import { ThemeProvider } from '@/components/theme/theme-provider'

const Root = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen w-full flex flex-col items-center gap-2 px-4 pb-4">
        <ModeToggle />
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
        <main className="rounded-md border border-border w-full flex-1">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default Root
