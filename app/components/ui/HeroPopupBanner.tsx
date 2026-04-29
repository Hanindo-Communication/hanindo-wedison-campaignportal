'use client'

import { useState, useEffect } from 'react'
import { useScrollLock } from '@/lib/useScrollLock'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

const SHOW_DELAY_MS = 1000

export type HeroPopupBannerProps = {
  /** Path ke asset di `public/` — set di `lib/campaigns.ts` → `heroPopupBanner.imageSrc` */
  imageSrc: string
  alt?: string
}

export default function HeroPopupBanner({ imageSrc, alt = 'Promo' }: HeroPopupBannerProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [])

  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const panelVariants = {
    initial: { opacity: 0, scale: 0.86 },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 0.2 },
        scale: {
          type: 'spring' as const,
          stiffness: 420,
          damping: 20,
          mass: 0.82,
        },
      },
    },
    closed: {
      opacity: 0,
      scale: 0.96,
      transition: {
        opacity: { duration: 0.14, ease: [0.4, 0, 1, 1] as const },
        scale: { duration: 0.18, ease: [0.4, 0, 0.2, 1] as const },
      },
    },
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] backdrop-blur-[2px] md:bg-black/70 md:p-8 md:pt-[max(0.75rem,env(safe-area-inset-top))] md:pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          {/* Panel: kartu terpusat — sedikit lebih lega di mobile (bukan full layar) */}
          <motion.div
            className="relative w-full max-w-[min(calc(100vw-1rem),480px)] rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-slate-800/95 via-slate-900 to-slate-950 p-3 shadow-2xl ring-1 ring-white/5 sm:p-5 md:max-w-[min(400px,34vw)] md:p-6"
            style={{ transformOrigin: 'center center' }}
            variants={panelVariants}
            initial="initial"
            animate="open"
            exit="closed"
          >
            {/* Gambar 9:16 — max-height sedikit lebih tinggi di mobile */}
            <div
              className="relative mx-auto aspect-[9/16] w-full max-h-[min(76dvh,calc(100dvh-6.5rem))] overflow-hidden rounded-2xl bg-slate-950/70 shadow-inner ring-1 ring-inset ring-white/10 md:max-h-[min(72dvh,calc(100dvh-8rem))]"
            >
              <Image
                src={imageSrc}
                alt={alt}
                fill
                priority
                unoptimized={imageSrc.endsWith('.svg')}
                className="object-cover object-center"
                sizes="(max-width:768px) 95vw, 380px"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-950/85 text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-900/90 sm:right-2.5 sm:top-2.5 sm:h-10 sm:w-10 md:right-3 md:top-3 md:h-11 md:w-11"
                aria-label="Tutup"
              >
                <FiX className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5 md:h-6 md:w-6" strokeWidth={2.25} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
