import { SunIcon, MoonIcon, MonitorIcon } from 'lucide-react'

export const THEMES = [
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
] as const
