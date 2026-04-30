'use client'

import Image from 'next/image'
import { Suspense, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { useSectionRevealMotion } from '@/lib/motionPreferences'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { getAdSourceLine } from '@/lib/adSourceFromUrl'
import { useWhatsAppPreChat } from '@/app/contexts/WhatsAppPreChatContext'
import { WHATSAPP_CTA } from '@/utils/constants'

/**
 * Placeholder banner — ganti `imageSrc` per item saat asset siap.
 * Rasio tampilan: 16:9 (disarankan aset **1920×1080** px; cocok untuk strip horizontal).
 */
const TICKER_BANNER_PLACEHOLDER = '/images/promo-ticker-banner-placeholder.svg'

const TICKER_ITEMS = [
  { id: 'apr-2026', text: 'Promo Mei 2026', imageSrc: TICKER_BANNER_PLACEHOLDER },
  { id: 'supercharge', text: 'SuperCharge', imageSrc: TICKER_BANNER_PLACEHOLDER },
  { id: 'konsultasi', text: 'Model & cicilan', imageSrc: TICKER_BANNER_PLACEHOLDER },
  { id: 'test-drive', text: 'Test drive · Jakarta', imageSrc: TICKER_BANNER_PLACEHOLDER },
  { id: 'trade-in', text: 'Trade-in & kredit', imageSrc: TICKER_BANNER_PLACEHOLDER },
] as const

const SLIDE_GAP_PX = 16

function PromoTickerSectionInner() {
  const searchParams = useSearchParams()
  const reduceMotion = useReducedMotion()
  const reveal = useSectionRevealMotion()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const { openPreChat } = useWhatsAppPreChat()

  const adSourceLine = getAdSourceLine(searchParams)

  const scrollByOneSlide = useCallback(
    (direction: -1 | 1) => {
      const el = scrollerRef.current
      if (!el) return
      const first = el.querySelector<HTMLElement>('[data-promo-slide]')
      if (!first) return
      const delta = first.getBoundingClientRect().width + SLIDE_GAP_PX
      el.scrollBy({
        left: direction * delta,
        behavior: reduceMotion ? 'auto' : 'smooth',
      })
    },
    [reduceMotion],
  )

  return (
    <motion.section
      {...reveal}
      id="promo-ticker"
      className="relative z-10 scroll-mt-20 border-y border-slate-200 bg-white py-8 md:py-10"
      aria-labelledby="promo-ticker-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-electric-blue">Promo</p>
            <h2 id="promo-ticker-heading" className="mt-1 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Sorotan program
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <button
              type="button"
              onClick={() =>
                openPreChat({
                  kind: 'promo052026',
                  promoParts: { adSourceLine: adSourceLine || undefined },
                })
              }
              className="inline-flex items-center gap-2 rounded-full bg-success-green px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-electric-blue/40"
            >
              <BsWhatsapp className="text-lg" aria-hidden />
              {WHATSAPP_CTA.button}
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-stretch gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => scrollByOneSlide(-1)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/40"
            aria-controls="promo-ticker-slides"
            aria-label="Slide promo sebelumnya"
          >
            <FiChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <div
            id="promo-ticker-slides"
            ref={scrollerRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Sorotan promo geser"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                scrollByOneSlide(-1)
                e.preventDefault()
              }
              if (e.key === 'ArrowRight') {
                scrollByOneSlide(1)
                e.preventDefault()
              }
            }}
            className="flex min-w-0 flex-1 gap-4 overflow-x-auto scroll-smooth pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          >
            {TICKER_ITEMS.map((item) => (
              <article
                key={item.id}
                data-promo-slide
                className="w-[min(72vw,420px)] shrink-0 snap-start sm:w-[380px] md:w-[460px]"
              >
                <div
                  className={`relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 transition-transform duration-300 ${
                    reduceMotion ? '' : 'hover:scale-[1.02]'
                  }`}
                >
                  <Image
                    src={item.imageSrc}
                    alt=""
                    fill
                    unoptimized={item.imageSrc.endsWith('.svg')}
                    className="object-cover object-center"
                    sizes="(max-width:768px) 72vw, 460px"
                  />
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-800 md:text-[15px]">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-secondary-teal shadow-[0_0_8px_rgba(54,179,126,0.55)]"
                    aria-hidden
                  />
                  <span className="leading-snug">{item.text}</span>
                </p>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByOneSlide(1)}
            className="self-center inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/40"
            aria-controls="promo-ticker-slides"
            aria-label="Slide promo berikutnya"
          >
            <FiChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <p className="sr-only">
          Geser ke samping, gunakan tombol panah di layar, atau panah di keyboard untuk melihat setiap promo. Tidak ada
          putar otomatis.
        </p>
      </div>
    </motion.section>
  )
}

function PromoTickerFallback() {
  return (
    <section className="border-y border-slate-200 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:px-8">
        <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </section>
  )
}

export default function PromoTickerSection() {
  return (
    <Suspense fallback={<PromoTickerFallback />}>
      <PromoTickerSectionInner />
    </Suspense>
  )
}
