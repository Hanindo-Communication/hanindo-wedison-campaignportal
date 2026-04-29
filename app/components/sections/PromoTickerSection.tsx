'use client'

import Image from 'next/image'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useReducedMotion } from 'framer-motion'
import { FiPause, FiPlay } from 'react-icons/fi'
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

function TickerImageSlide({ src, label }: { src: string; label: string }) {
  return (
    <div
      className="relative w-[min(88vw,340px)] shrink-0 overflow-hidden rounded-xl bg-slate-800 ring-1 ring-white/15 aspect-[16/9] sm:w-[400px] md:w-[480px]"
    >
      <Image
        src={src}
        alt=""
        fill
        unoptimized={src.endsWith('.svg')}
        className="object-cover object-center"
        sizes="(max-width:768px) 88vw, 480px"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

const marqueePaused = (paused: boolean) =>
  `${paused ? '[animation-play-state:paused]' : ''} group-hover:[animation-play-state:paused]`

function PromoTickerSectionInner() {
  const searchParams = useSearchParams()
  const reduceMotion = useReducedMotion()
  const [userPaused, setUserPaused] = useState(false)
  const { openPreChat } = useWhatsAppPreChat()

  const adSourceLine = getAdSourceLine(searchParams)

  const runMarquee = !reduceMotion

  return (
    <section
      id="promo-ticker"
      className="relative z-10 scroll-mt-20 border-y border-white/10 bg-slate-950 py-8 md:py-10"
      aria-labelledby="promo-ticker-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Promo</p>
            <h2 id="promo-ticker-heading" className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Sorotan program
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {runMarquee ? (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-pressed={userPaused}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-electric-blue/60"
              >
                {userPaused ? (
                  <>
                    <FiPlay className="h-4 w-4" aria-hidden />
                    Putar
                  </>
                ) : (
                  <>
                    <FiPause className="h-4 w-4" aria-hidden />
                    Jeda
                  </>
                )}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() =>
                openPreChat({
                  kind: 'promo052026',
                  promoParts: { adSourceLine: adSourceLine || undefined },
                })
              }
              className="inline-flex items-center gap-2 rounded-full bg-success-green px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <BsWhatsapp className="text-lg" aria-hidden />
              {WHATSAPP_CTA.button}
            </button>
          </div>
        </div>

        {runMarquee ? (
          <div className="group mt-6 space-y-3">
            {/* Strip 1: banner gambar (atas) */}
            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-slate-900 py-3">
              <div
                className={`flex w-max will-change-transform animate-marquee ${marqueePaused(
                  userPaused,
                )}`}
              >
                {[0, 1].map((copy) => (
                  <div
                    key={`img-${copy}`}
                    className="flex shrink-0 items-center gap-5 px-5 md:gap-7 md:px-8"
                    aria-hidden={copy === 1}
                  >
                    {TICKER_ITEMS.map((item) => (
                      <TickerImageSlide key={`${copy}-img-${item.id}`} src={item.imageSrc} label={item.text} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Strip 2: teks (bawah), animasi terpisah */}
            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-slate-900/95 py-3.5">
              <div
                className={`flex w-max will-change-transform animate-marquee-text ${marqueePaused(
                  userPaused,
                )}`}
              >
                {[0, 1].map((copy) => (
                  <div
                    key={`txt-${copy}`}
                    className="flex shrink-0 items-center gap-10 px-6 md:gap-16 md:px-10"
                    aria-hidden={copy === 1}
                  >
                    {TICKER_ITEMS.map((item) => (
                      <span
                        key={`${copy}-txt-${item.id}`}
                        className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-white md:text-[15px]"
                      >
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-secondary-teal shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                          aria-hidden
                        />
                        {item.text}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <p className="sr-only">
              Dua baris promo bergulir: banner gambar di atas, teks di bawah. Hover atau jeda untuk membaca. Gambar
              placeholder hingga materi resmi tersedia.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <ul className="flex flex-col gap-3 rounded-xl border border-white/15 bg-slate-900 p-4 md:p-5">
              {TICKER_ITEMS.map((item) => (
                <li key={`still-${item.id}`} className="list-none">
                  <TickerImageSlide src={item.imageSrc} label={item.text} />
                </li>
              ))}
            </ul>
            <ul className="space-y-3 rounded-xl border border-white/15 bg-slate-900 p-4 text-sm text-slate-100 md:p-5">
              {TICKER_ITEMS.map((item) => (
                <li key={item.id} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-teal" aria-hidden />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

function PromoTickerFallback() {
  return (
    <section className="border-y border-white/10 bg-slate-950 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:px-8">
        <div className="h-24 animate-pulse rounded-xl bg-slate-800/80" />
        <div className="h-14 animate-pulse rounded-xl bg-slate-800/60" />
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
