import { Outlet } from 'react-router-dom'

import { Folder } from 'lucide-react'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { CommandMenu } from '@/components/navigation/command-menu'
import { Button } from '@/components/ui/button'
import { useWallpaperManager } from '@/providers/wallpaper-manager'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const Root = () => {
  const { config, changeWallpapersFolder } = useWallpaperManager()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-screen w-full flex-col items-center gap-2 pb-4">
        <header className="z-50 inline-flex w-full items-center justify-start gap-2 px-2 py-1">
          <h1 className="text-2xl font-bold">Wally</h1>
          <CommandMenu />
          {config && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={changeWallpapersFolder} variant="outline" className="sticky bottom-2">
                    <Folder className="mr-1 w-4" /> {config.contained_folder.dirname}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="z-50">{config.contained_folder.path}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </header>
        <main className="w-full flex-1">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default Root
