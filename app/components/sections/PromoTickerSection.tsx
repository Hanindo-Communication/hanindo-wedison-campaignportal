'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useReducedMotion } from 'framer-motion'
import { FiPause, FiPlay } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { getAdSourceLine } from '@/lib/adSourceFromUrl'
import { buildPromo042026WhatsAppLink } from '@/utils/whatsappLinks'
import { trackWhatsAppClick } from '@/utils/analytics'

/** Placeholder saluran promo — ganti teks ini saat materi resmi ada */
const TICKER_ITEMS = [
  'Promo April 2026 — paket & diskon mengikuti kebijakan Wedison (detail via WhatsApp)',
  'SuperCharge — pengisian cepat di jaringan Wedison untuk dukung operasional harian',
  'Konsultasi model & cicilan — tim kami bantu cocokkan kebutuhan kamu',
  'Test drive & pengalaman langsung di Experience Center Pondok Indah',
  'Program trade-in & pembiayaan — tanya ketersediaan promo periode ini',
] as const

function PromoTickerSectionInner() {
  const searchParams = useSearchParams()
  const reduceMotion = useReducedMotion()
  const [userPaused, setUserPaused] = useState(false)

  const adSourceLine = getAdSourceLine(searchParams)
  const waHref = buildPromo042026WhatsAppLink({
    adSourceLine: adSourceLine || undefined,
  })

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
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Info promo</p>
            <h2 id="promo-ticker-heading" className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              Program &amp; promo
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-200">
              Ringkasan jalur promo (placeholder). Detail resmi, syarat, dan periode berlaku selalu dikonfirmasi lewat tim
              Wedison — pakai tombol jeda jika teks terlalu cepat.
            </p>
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
            <a
              href={waHref}
              onClick={() => trackWhatsAppClick('promo-ticker-section')}
              className="inline-flex items-center gap-2 rounded-full bg-success-green px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <BsWhatsapp className="text-lg" aria-hidden />
              Tanya promo
            </a>
          </div>
        </div>

        {runMarquee ? (
          <div className="group relative mt-6 overflow-hidden rounded-xl border border-white/15 bg-slate-900 py-3.5">
            <div
              className={`flex w-max gap-0 will-change-transform animate-marquee ${
                userPaused ? '[animation-play-state:paused]' : ''
              } group-hover:[animation-play-state:paused]`}
            >
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex shrink-0 items-center gap-10 px-6 md:gap-16 md:px-10"
                  aria-hidden={copy === 1}
                >
                  {TICKER_ITEMS.map((text) => (
                    <span
                      key={`${copy}-${text.slice(0, 24)}`}
                      className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-white md:text-[15px]"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-secondary-teal shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                      {text}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <p className="sr-only">
              Teks promo bergulir; hover atau jeda untuk membaca. Konten placeholder hingga materi resmi tersedia.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3 rounded-xl border border-white/15 bg-slate-900 p-4 text-sm text-slate-100 md:p-5">
            {TICKER_ITEMS.map((text) => (
              <li key={text} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-teal" aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function PromoTickerFallback() {
  return (
    <section className="border-y border-white/10 bg-slate-950 py-10">
      <div className="mx-auto h-20 max-w-7xl animate-pulse rounded-xl bg-slate-800/80 px-4 sm:px-6 lg:px-8" />
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
