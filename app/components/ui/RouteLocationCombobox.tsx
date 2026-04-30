'use client'

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'

export type RouteLocationComboboxProps = {
  id: string
  name?: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  suggestions: readonly string[]
  iconLeft: ReactNode
  'aria-label'?: string
  /** `light` untuk hero promo terang; default gelap. */
  variant?: 'dark' | 'light'
}

/**
 * Combobox lokasi rute: buka saat fokus, filter ketik, pilih dari daftar.
 * `variant` mengatur kontras field & dropdown (gelap vs terang).
 */
export default function RouteLocationCombobox({
  id,
  name,
  value,
  onChange,
  placeholder,
  suggestions,
  iconLeft,
  'aria-label': ariaLabel,
  variant = 'dark',
}: RouteLocationComboboxProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return [...suggestions]
    return suggestions.filter((s) => s.toLowerCase().includes(q))
  }, [value, suggestions])

  useLayoutEffect(() => {
    if (highlighted > filtered.length - 1) {
      setHighlighted(Math.max(0, filtered.length - 1))
    }
  }, [filtered.length, highlighted])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (open) setHighlighted(0)
  }, [open, value])

  const pick = (s: string) => {
    onChange(s)
    setOpen(false)
    inputRef.current?.blur()
  }

  const onInputFocus = () => setOpen(true)

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const next = e.relatedTarget as Node | null
    if (!next || !rootRef.current?.contains(next)) setOpen(false)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setOpen(true)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (open) {
        e.preventDefault()
        setOpen(false)
      }
      return
    }
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true)
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((i) => Math.max(0, i - 1))
    }
    if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault()
      pick(filtered[highlighted]!)
    }
  }

  /** Tap area field (bukan hanya panah): fokus ke input. */
  const focusInput = () => {
    inputRef.current?.focus()
  }

  const light = variant === 'light'
  const shellClass = light
    ? 'relative cursor-text rounded-xl border border-slate-200 bg-white shadow-sm transition-colors focus-within:border-electric-blue focus-within:ring-2 focus-within:ring-electric-blue/30'
    : 'relative cursor-text rounded-xl border border-white/15 bg-slate-900/90 transition-colors focus-within:border-electric-blue focus-within:ring-2 focus-within:ring-electric-blue/40'
  const inputClass = light
    ? 'min-h-[48px] w-full rounded-xl bg-transparent py-3 pl-11 pr-10 text-base text-slate-900 placeholder:text-slate-500 focus:outline-none'
    : 'min-h-[48px] w-full rounded-xl bg-transparent py-3 pl-11 pr-10 text-base text-white placeholder:text-slate-500 focus:outline-none'
  const listClass = light
    ? 'absolute left-0 right-0 z-[60] mt-1 max-h-[min(50vh,280px)] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-slate-200/80'
    : 'absolute left-0 right-0 z-[60] mt-1 max-h-[min(50vh,280px)] overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-slate-950/95 py-1 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-md'
  const optionClass = (active: boolean) =>
    light
      ? active
        ? 'bg-electric-blue/15 text-electric-blue'
        : 'text-slate-700 hover:bg-slate-50'
      : active
        ? 'bg-electric-blue/25 text-white'
        : 'text-slate-200 hover:bg-white/10'
  const emptyTextClass = light
    ? 'px-3 py-3 text-center text-sm leading-snug text-slate-500'
    : 'px-3 py-3 text-center text-sm leading-snug text-slate-400'

  return (
    <div ref={rootRef} className="relative">
      <div
        className={shellClass}
        onMouseDown={(e) => {
          if (e.target === inputRef.current) return
          e.preventDefault()
          focusInput()
        }}
      >
        <span className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 [&>svg]:block">
          {iconLeft}
        </span>
        <FiChevronDown
          className="pointer-events-none absolute right-3 top-1/2 z-[1] h-5 w-5 -translate-y-1/2 text-slate-500"
          aria-hidden
        />
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-autocomplete="list"
          aria-label={ariaLabel}
          placeholder={placeholder}
          value={value}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          className={inputClass}
        />
      </div>

      <AnimatePresence>
        {open && (filtered.length > 0 || value.trim()) ? (
          <motion.div
            id={listboxId}
            role="listbox"
            aria-label="Saran lokasi"
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className={listClass}
          >
            {filtered.length > 0 ? (
              filtered.map((s, i) => {
                const active = i === highlighted
                return (
                  <button
                    key={s}
                    type="button"
                    tabIndex={-1}
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setHighlighted(i)}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      pick(s)
                    }}
                    className={`flex w-full items-center px-3 py-2.5 text-left text-[15px] font-medium transition ${optionClass(active)}`}
                  >
                    {s}
                  </button>
                )
              })
            ) : value.trim() ? (
              <p className={emptyTextClass}>
                Tidak ada di daftar singkat — lokasi yang kamu ketik tetap dipakai.
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
