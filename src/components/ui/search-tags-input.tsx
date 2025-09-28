import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchTagsInputProps<T> {
  value: T[]
  onChange: (items: T[]) => void
  onSearch: (query: string) => Promise<T[]>
  getItemLabel: (item: T) => string
  getItemKey: (item: T) => string
  placeholder?: string
  disabled?: boolean
  className?: string
  maxItems?: number
  minSearchLength?: number
  loading?: boolean
}

export function SearchTagsInput<T>({
  value,
  onChange,
  onSearch,
  getItemLabel,
  getItemKey,
  placeholder = 'Cerca e aggiungi...',
  disabled = false,
  className,
  maxItems = 10,
  minSearchLength = 2,
  loading = false,
}: SearchTagsInputProps<T>) {
  const [input, setInput] = useState('')
  const [searchResults, setSearchResults] = useState<T[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < minSearchLength) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        const results = await onSearch(query)
        // Filter out already selected items
        const filteredResults = results.filter(
          (result) =>
            !value.some((item) => getItemKey(item) === getItemKey(result))
        )
        setSearchResults(filteredResults.slice(0, maxItems))
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300),
    [onSearch, value, getItemKey, maxItems, minSearchLength]
  )

  // Handle input changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setInput(query)
    setSelectedIndex(-1)

    if (query.length >= minSearchLength) {
      setShowDropdown(true)
      debouncedSearch(query)
    } else {
      setShowDropdown(false)
      setSearchResults([])
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        addItem(searchResults[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setSelectedIndex(-1)
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  // Add item to selection
  const addItem = (item: T) => {
    if (
      !value.some(
        (existingItem) => getItemKey(existingItem) === getItemKey(item)
      )
    ) {
      onChange([...value, item])
    }
    setInput('')
    setShowDropdown(false)
    setSelectedIndex(-1)
    setSearchResults([])
    inputRef.current?.focus()
  }

  // Remove item from selection
  const removeItem = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
    inputRef.current?.focus()
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle input focus
  const handleFocus = () => {
    if (input.length >= minSearchLength && searchResults.length > 0) {
      setShowDropdown(true)
    }
  }

  return (
    <div className='relative'>
      <div
        className={cn(
          'bg-background ring-ring flex min-h-[32px] flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 transition focus-within:ring-2',
          className
        )}
      >
        {/* Search icon */}
        <Search className='text-muted-foreground h-3 w-3 flex-shrink-0' />

        {/* Selected items as tags */}
        {value.map((item, idx) => (
          <span
            key={getItemKey(item)}
            className='bg-muted flex items-center rounded px-1.5 py-0.5 text-xs'
          >
            {getItemLabel(item)}
            <button
              type='button'
              className='text-muted-foreground hover:text-destructive ml-1 focus:outline-none'
              onClick={() => removeItem(idx)}
              tabIndex={-1}
              aria-label={`Rimuovi ${getItemLabel(item)}`}
              disabled={disabled}
            >
              <X className='h-2.5 w-2.5' />
            </button>
          </span>
        ))}

        {/* Input field */}
        <input
          ref={inputRef}
          type='text'
          className='min-w-[100px] flex-1 border-none bg-transparent py-0.5 text-sm outline-none'
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          aria-label='Cerca e aggiungi elementi'
        />

        {/* Loading indicator */}
        {(isSearching || loading) && (
          <Loader2 className='text-muted-foreground h-3 w-3 flex-shrink-0 animate-spin' />
        )}
      </div>

      {/* Dropdown with search results */}
      {showDropdown && (searchResults.length > 0 || isSearching) && (
        <div
          ref={dropdownRef}
          className='bg-background absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border shadow-lg'
        >
          {isSearching ? (
            <div className='text-muted-foreground flex items-center justify-center p-3 text-sm'>
              <Loader2 className='mr-2 h-3 w-3 animate-spin' />
              Ricerca in corso...
            </div>
          ) : (
            <div className='py-1'>
              {searchResults.map((item, index) => (
                <button
                  key={getItemKey(item)}
                  type='button'
                  className={cn(
                    'hover:bg-accent focus:bg-accent w-full px-3 py-1.5 text-left text-sm focus:outline-none',
                    selectedIndex === index && 'bg-accent'
                  )}
                  onClick={() => addItem(item)}
                >
                  {getItemLabel(item)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
