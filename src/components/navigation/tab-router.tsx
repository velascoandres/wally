import { cn } from '@/lib/utils'
import { Children } from 'react'
import { NavLink } from 'react-router-dom'

interface TabProps {
  path: string
  children: React.ReactNode
}

interface Props {
  children: React.ReactNode
}

export const TabRouter = ({ children }: Props) => {
  const tabs = Children.toArray(children)

  return <nav className="flex flex-row gap-2 w-full px-2 py-1 bg-secondary rounded-md">{tabs.map((tab) => tab)}</nav>
}

export const TabLink = ({ path, children }: TabProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn('transition ease-in px-4 py-1 rounded-md bg-secondary text-primary text-sm  hover:bg-neutral-700', {
          'bg-background hover:bg-background': isActive,
        })
      }
    >
      {children}
    </NavLink>
  )
}
