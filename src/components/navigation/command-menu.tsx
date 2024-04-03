import * as React from 'react'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Images, ListVideo, CoffeeIcon, SunIcon, MoonIcon, MonitorIcon } from 'lucide-react'

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

export const themes = [
  {
    name: 'Light Theme',
    param: 'light',
    icon: SunIcon,
  },
  {
    name: 'Dark Theme',
    param: 'dark',
    icon: MoonIcon,
  },
  {
    name: 'System Theme',
    param: 'system',
    icon: MonitorIcon,
  },
]

export const CommandMenu = () => {
  const [open, setOpen] = React.useState(false)
  const { setTheme } = useTheme()

  const handleChangeTheme = (theme: Theme) => {
    setTheme(theme)
    setOpen(false)
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <p className="text-sm text-muted-foreground">
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem key={1} onSelect={() => console.log('')}>
              <Images className="mr-2 h-4 w-4" />
              <span>Gallery</span>
            </CommandItem>
            <CommandItem key={2}>
              <ListVideo className="mr-2 h-4 w-4" />
              <span>Playlist</span>
            </CommandItem>
            <CommandSeparator />
          </CommandGroup>
          <CommandGroup heading="Themes">
            {themes.map((theme) => (
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
            <CommandItem key={3}>
              <GitHubLogoIcon className="mr-2 h-4 w-4" />
              <span>Github repository</span>
            </CommandItem>
            <CommandItem>
              <CoffeeIcon className="mr-2 h-4 w-4" />
              <span>Buy me a coffee</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
