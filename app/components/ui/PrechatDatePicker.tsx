'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const WEEKDAYS_MON = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

function isoToLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function dateToIso(d: Date): string {
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${mo}-${day}`
}

function startOfWeekMonday(ref: Date): Date {
  const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate())
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

function monthIndexFromMin(minIso: string): { y: number; m: number } {
  const d = isoToLocalDate(minIso)
  return { y: d.getFullYear(), m: d.getMonth() }
}

function clampMonth(minIso: string, y: number, m: number): { y: number; m: number } {
  const minT = isoToLocalDate(minIso).getTime()
  const cur = new Date(y, m, 1).getTime()
  if (cur >= minT) return { y, m }
  return monthIndexFromMin(minIso)
}

function formatDisplayId(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [y, mo, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS_ID[mo - 1]?.slice(0, 3) ?? ''} ${y}`
}

/** Ruang vertikal perkiraan untuk popover (header + grid + footer). */
const POPOVER_MIN_HEIGHT = 300
const VIEW_MARGIN = 12

function computePlacement(rect: DOMRect): 'above' | 'below' {
  if (typeof window === 'undefined') return 'above'
  const vh = window.innerHeight
  const spaceBelow = vh - rect.bottom - VIEW_MARGIN
  const spaceAbove = rect.top - VIEW_MARGIN
  if (spaceBelow >= POPOVER_MIN_HEIGHT) return 'below'
  if (spaceAbove >= POPOVER_MIN_HEIGHT) return 'above'
  return spaceAbove >= spaceBelow ? 'above' : 'below'
}

export type PrechatDatePickerProps = {
  id: string
  value: string
  min: string
  onChange: (iso: string) => void
  hasError?: boolean
}

export default function PrechatDatePicker({
  id,
  value,
  min,
  onChange,
  hasError,
}: PrechatDatePickerProps) {
  const pickerId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<'above' | 'below'>('above')
  const todayIso = useMemo(() => dateToIso(new Date()), [])

  const initialView = useCallback(() => {
    const anchor = value || min || todayIso
    const d = isoToLocalDate(anchor)
    return clampMonth(min, d.getFullYear(), d.getMonth())
  }, [value, min, todayIso])

  const [view, setView] = useState(() => initialView())

  useEffect(() => {
    if (open) setView(initialView())
  }, [open, initialView])

  const viewYear = view.y
  const viewMonth = view.m

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const el = rootRef.current
      if (!el?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onResize = () => {
      const el = rootRef.current
      if (!el) return
      setPlacement(computePlacement(el.getBoundingClientRect()))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [open])

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const gridStart = startOfWeekMonday(first)
    const out: { iso: string; day: number; inMonth: boolean; disabled: boolean }[] = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      const iso = dateToIso(d)
      const inMonth = d.getMonth() === viewMonth
      const disabled = iso < min
      out.push({ iso, day: d.getDate(), inMonth, disabled })
    }
    return out
  }, [viewYear, viewMonth, min])

  const canPrevMonth = useMemo(() => {
    const minYm = monthIndexFromMin(min)
    const cur = viewYear * 12 + viewMonth
    const minT = minYm.y * 12 + minYm.m
    return cur > minT
  }, [viewYear, viewMonth, min])

  const goPrev = () => {
    let m = viewMonth - 1
    let y = viewYear
    if (m < 0) {
      m = 11
      y -= 1
    }
    const c = clampMonth(min, y, m)
    setView(c)
  }

  const goNext = () => {
    let m = viewMonth + 1
    let y = viewYear
    if (m > 11) {
      m = 0
      y += 1
    }
    setView({ y, m })
  }

  const selectDay = (iso: string, disabled: boolean) => {
    if (disabled) return
    onChange(iso)
    setOpen(false)
  }

  const canPickToday = todayIso >= min

  const triggerLabel = value ? formatDisplayId(value) : 'Pilih tanggal'

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        id={id}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? pickerId : undefined}
        onClick={() => {
          setOpen((prev) => {
            const next = !prev
            if (next && rootRef.current) {
              setPlacement(computePlacement(rootRef.current.getBoundingClientRect()))
            }
            return next
          })
        }}
        className={`flex min-h-[48px] w-full items-center justify-between gap-2 rounded-xl border-2 bg-white px-3 py-3 text-left text-base outline-none transition focus-visible:border-electric-blue focus-visible:ring-2 focus-visible:ring-electric-blue/15 ${
          hasError ? 'border-red-300' : 'border-slate-200 hover:border-slate-300'
        } ${value ? 'text-slate-800' : 'text-slate-400'}`}
      >
        <span className="min-w-0 truncate">{triggerLabel}</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-electric-blue ring-1 ring-slate-200/80">
          <FiCalendar className="h-5 w-5" aria-hidden />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={pickerId}
            role="dialog"
            aria-modal="true"
            aria-label="Kalender pilih tanggal"
            initial={{
              opacity: 0,
              y: placement === 'above' ? 10 : -10,
              scale: 0.98,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: placement === 'above' ? 6 : -6,
              scale: 0.98,
            }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className={`absolute left-0 right-0 z-[130] flex max-h-[min(72dvh,420px)] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_16px_50px_-12px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/[0.04] sm:left-0 sm:right-auto sm:min-w-[300px] sm:max-w-none ${
              placement === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            <div className="shrink-0 border-b border-slate-100 bg-gradient-to-br from-slate-50/90 to-white px-3 py-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={!canPrevMonth}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white hover:text-electric-blue disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Bulan sebelumnya"
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                <p className="min-w-0 flex-1 text-center text-base font-semibold tracking-tight text-slate-800">
                  {MONTHS_ID[viewMonth]} {viewYear}
                </p>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white hover:text-electric-blue"
                  aria-label="Bulan berikutnya"
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2 pt-2">
              <div className="grid grid-cols-7 gap-0.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                {WEEKDAYS_MON.map((w) => (
                  <div key={w} className="py-1.5">
                    {w}
                  </div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {cells.map((cell) => {
                  const selected = value === cell.iso
                  const isToday = cell.iso === todayIso
                  return (
                    <button
                      key={cell.iso}
                      type="button"
                      disabled={cell.disabled}
                      onClick={() => selectDay(cell.iso, cell.disabled)}
                      className={`flex min-h-[44px] items-center justify-center rounded-xl text-base font-semibold transition ${
                        cell.disabled
                          ? 'cursor-not-allowed text-slate-300'
                          : cell.inMonth
                            ? 'text-slate-800 hover:bg-slate-50'
                            : 'text-slate-300 hover:bg-slate-50/80'
                      } ${
                        selected
                          ? 'bg-electric-blue text-white shadow-sm hover:bg-electric-blue'
                          : isToday && !selected
                            ? 'ring-2 ring-inset ring-electric-blue/35'
                            : ''
                      }`}
                    >
                      {cell.day}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-3 py-2.5">
              <button
                type="button"
                className="rounded-lg px-2 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-700"
                onClick={() => {
                  onChange('')
                  setOpen(false)
                }}
              >
                Hapus
              </button>
              <button
                type="button"
                disabled={!canPickToday}
                className="rounded-lg px-2 py-2 text-sm font-semibold text-electric-blue transition hover:bg-white disabled:opacity-40"
                onClick={() => {
                  if (!canPickToday) return
                  onChange(todayIso)
                  setOpen(false)
                }}
              >
                Hari ini
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
