import React, { useState } from 'react'
import { Search } from 'lucide-react'

import { useDebounceCallback } from '@/hooks/use-debounce-callback'

import { Input } from './input'

interface Props {
  value?: string
  placeholder?: string
  onSearch: (search: string) => void
}

export const SearchBox = ({ value, onSearch, placeholder = 'Search something' }: Props) => {
  const debounce = useDebounceCallback()

  const [inputValue, setInputValue] = useState(value)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = evt

    setInputValue(value)

    debounce(() => onSearch(value))
  }

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2 z-10 h-5 w-5" />
      <Input
        value={inputValue}
        placeholder={placeholder}
        className="w-full border-none pl-10 focus-visible:ring-0"
        onChange={handleChange}
      />
    </div>
  )
}
