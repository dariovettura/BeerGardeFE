import React, { useRef, useState } from 'react'

interface EmailTagsInputProps {
  value: string[]
  onChange: (emails: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function EmailTagsInput({
  value,
  onChange,
  placeholder,
  disabled,
}: EmailTagsInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addEmail = (email: string) => {
    const trimmed = email.trim()
    if (trimmed && validateEmail(trimmed) && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addEmail(input)
      setInput('')
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const handleBlur = () => {
    addEmail(input)
    setInput('')
  }

  const removeEmail = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
    inputRef.current?.focus()
  }

  return (
    <div className='bg-background ring-ring flex min-h-[42px] flex-wrap items-center gap-2 rounded-md border px-2 py-1 transition focus-within:ring-2'>
      {value.map((email, idx) => (
        <span
          key={email}
          className='bg-muted flex items-center rounded px-2 py-0.5 text-sm'
        >
          {email}
          <button
            type='button'
            className='text-muted-foreground hover:text-destructive ml-1 focus:outline-none'
            onClick={() => removeEmail(idx)}
            tabIndex={-1}
            aria-label={`Rimuovi ${email}`}
            disabled={disabled}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type='email'
        className='min-w-[120px] flex-1 border-none bg-transparent py-1 text-base outline-none'
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-label='Aggiungi email'
      />
    </div>
  )
}

function validateEmail(email: string) {
  // Semplice validazione email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
