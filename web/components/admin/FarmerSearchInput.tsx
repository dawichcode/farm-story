'use client'

import { useEffect, useRef, useState } from 'react'
import Input from '@/components/ui/Input'
import { Search } from 'lucide-react'

interface Props {
  onSearch: (term: string) => void
  placeholder?: string
}

export default function FarmerSearchInput({ onSearch, placeholder = 'Search farmers...' }: Props) {
  const [value, setValue] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(value.trim())
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value, onSearch])

  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
        aria-label="Search farmers"
      />
    </div>
  )
}
