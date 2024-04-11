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

  return <nav className="flex w-full flex-row gap-2 rounded-md bg-secondary px-2 py-1">{tabs.map((tab) => tab)}</nav>
}

export const TabLink = ({ path, children }: TabProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn('rounded-md bg-secondary px-4 py-1 text-sm text-primary transition ease-in  hover:bg-neutral-700', {
          'bg-background hover:bg-background': isActive,
        })
      }
    >
      {children}
    </NavLink>
  )
}
