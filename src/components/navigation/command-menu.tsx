import * as React from 'react'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Folder, CoffeeIcon } from 'lucide-react'
import { open } from '@tauri-apps/api/shell'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Theme, useTheme } from '../theme/theme-provider'
import { useWallpaperManager } from '@/providers/wallpaper-manager'
import { LINKS } from '@/constants/links'
import { THEMES } from '@/constants/themes'

export const CommandMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { setTheme } = useTheme()
  const { changeWallpapersFolder } = useWallpaperManager()

  const handleChangeTheme = (theme: Theme) => {
    setTheme(theme)
    setIsOpen(false)
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <p className="text-sm text-muted-foreground">
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-sm">⌘</span>K
        </kbd>
      </p>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem key={1} onSelect={changeWallpapersFolder}>
              <Folder className="mr-2 h-4 w-4" />
              <span>Change folder</span>
            </CommandItem>
            <CommandSeparator />
          </CommandGroup>
          <CommandGroup heading="Themes">
            {THEMES.map((theme) => (
              <CommandItem
                key={theme.param}
                value={`Change Theme: ${theme.name}`}
                onSelect={() => handleChangeTheme(theme.param as Theme)}
              >
                <theme.icon size={22} strokeWidth={1.5} />
                <span>{theme.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Links">
            <CommandItem key={3} onSelect={() => void open(LINKS.GITHIB_REPOSITORY)}>
              <GitHubLogoIcon className="mr-2 h-4 w-4" />
              <span>Github repository</span>
            </CommandItem>
            <CommandItem key={4} onSelect={() => void open(LINKS.GITHIB_REPOSITORY)}>
              <CoffeeIcon className="mr-2 h-4 w-4" />
              <span>Buy me a coffee</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
