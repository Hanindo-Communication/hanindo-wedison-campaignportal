'use client'

import { useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FiChevronDown, FiMapPin, FiMousePointer, FiNavigation, FiX } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { type CampaignConfig } from '@/lib/campaigns'
import { estimateRouteSavings, type RouteEstimateResult } from '@/lib/estimateOjolRouteSavings'
import { useLandingWhatsApp } from '@/app/contexts/AdAttributionContext'
import { OJOL_ROUTE_LOCATION_SUGGESTIONS } from '@/lib/ojolRouteLocations'
import { firePromoEstimateConfetti } from '@/lib/promoEstimateConfetti'
import { getPromoModelPlaceholders, type PromoModelPlaceholder } from '@/lib/promoModelPlaceholders'
import { MODEL_SPECS } from '@/utils/modelSpecs'
import { trackWhatsAppClick } from '@/utils/analytics'
import PromoTickerSection from '@/app/components/sections/PromoTickerSection'

const SOCIAL_PROOF = [
  {
    quote: 'Dulu BBM habis ratusan ribu sebulan. Sekarang operasional listrik jauh lebih ringan — cocok buat narik seharian.',
    name: 'Budi Santoso',
    role: 'Driver ojek online',
  },
  {
    quote: 'SuperCharge 15 menit itu yang bikin yakin: istirahat sebentar, lanjut jalan lagi.',
    name: 'Sari Dewi',
    role: 'Driver & komuter',
  },
]

function OjolRoutePromoSectionContent({ config }: { config: CampaignConfig }) {
  const { hero } = config
  const { promo042026Link } = useLandingWhatsApp()
  const reduceMotion = useReducedMotion()

  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<RouteEstimateResult | null>(null)
  const [modalModel, setModalModel] = useState<PromoModelPlaceholder | null>(null)

  const models = useMemo(() => getPromoModelPlaceholders(), [])

  const waBase = useMemo(
    () =>
      promo042026Link({
        pickup: pickup.trim() || undefined,
        dropoff: dropoff.trim() || undefined,
        distanceKm: result?.distanceKm,
        savingsIdr: result?.savingsIdr,
        promoTierLabel: result?.promoTierLabel,
      }),
    [promo042026Link, pickup, dropoff, result]
  )

  const waWithModel = (m: PromoModelPlaceholder) =>
    promo042026Link({
      pickup: pickup.trim() || undefined,
      dropoff: dropoff.trim() || undefined,
      distanceKm: result?.distanceKm,
      savingsIdr: result?.savingsIdr,
      promoTierLabel: result?.promoTierLabel,
      modelName: m.name,
    })

  const handleEstimate = () => {
    setError('')
    if (!pickup.trim() || !dropoff.trim()) {
      setError('Lengkapi rute perjalanan dulu ya.')
      return
    }
    flushSync(() => {
      setResult(estimateRouteSavings(pickup, dropoff))
    })

    const scrollAndCelebrate = () => {
      const el = document.getElementById('route-promo-estimate')
      el?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
      if (!reduceMotion) {
        void firePromoEstimateConfetti()
      }
    }

    // Wait for layout/paint (esp. mobile) so the result node is measured before scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollAndCelebrate)
    })
  }

  const bgImage = hero.backgroundImage

  return (
    <section
      className="relative -mt-16 md:-mt-20 pt-16 md:pt-20 min-h-[min(100dvh,920px)] overflow-hidden"
      aria-labelledby="ojol-promo-headline"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-electric-blue/40">
        {bgImage ? (
          <Image
            src={bgImage}
            alt=""
            fill
            priority
            className="object-cover opacity-35"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-lg md:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        {hero.highlightBadge ? (
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <span className="inline-flex items-center rounded-full border border-white/20 bg-slate-950/85 px-4 py-2 text-sm font-semibold text-secondary-teal backdrop-blur-md">
              {hero.highlightBadge}
            </span>
          </motion.p>
        ) : null}

        <h1
          id="ojol-promo-headline"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-sm"
        >
          {hero.headline}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-200/95 max-w-2xl leading-relaxed">
          {hero.subheadline}
        </p>

        {/* Routing card — frosted outer, opaque inner for text */}
        <div
          id="route-promo-form"
          className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-1 shadow-2xl backdrop-blur-xl"
        >
          <div className="rounded-xl bg-slate-950/90 p-4 sm:p-6">
            <p className="text-sm font-medium text-slate-300 mb-4">Rute perjalanan</p>

            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-2">
                <span className="h-3 w-3 shrink-0 rounded-full border-2 border-electric-blue bg-electric-blue/30" aria-hidden />
                <span className="my-1 w-px flex-1 min-h-[44px] bg-gradient-to-b from-electric-blue/80 to-white/30" aria-hidden />
                <span className="h-3 w-3 shrink-0 rounded-sm border-2 border-white/70 bg-white/10" aria-hidden />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label htmlFor="pickup" className="sr-only">
                    Lokasi jemput
                  </label>
                  <div className="relative">
                    <FiNavigation className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-electric-blue" aria-hidden />
                    <FiChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                      aria-hidden
                    />
                    <input
                      id="pickup"
                      name="pickup"
                      autoComplete="off"
                      list="route-location-suggestions"
                      placeholder="Lokasi jemput"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="min-h-[48px] w-full rounded-xl border border-white/15 bg-slate-900/90 pl-11 pr-10 text-base text-white placeholder:text-slate-500 focus:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/40"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="dropoff" className="sr-only">
                    Lokasi tujuan
                  </label>
                  <div className="relative">
                    <FiMapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-teal" aria-hidden />
                    <FiChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                      aria-hidden
                    />
                    <input
                      id="dropoff"
                      name="dropoff"
                      autoComplete="off"
                      list="route-location-suggestions"
                      placeholder="Lokasi tujuan"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      className="min-h-[48px] w-full rounded-xl border border-white/15 bg-slate-900/90 pl-11 pr-10 text-base text-white placeholder:text-slate-500 focus:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/40"
                    />
                  </div>
                </div>
              </div>
            </div>

            <datalist id="route-location-suggestions">
              {OJOL_ROUTE_LOCATION_SUGGESTIONS.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>

            {error ? (
              <p className="mt-3 text-sm text-amber-300" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleEstimate}
                className="min-h-[48px] flex-1 rounded-xl bg-gradient-to-r from-electric-blue to-secondary-teal px-6 py-3 text-center text-base font-semibold text-white shadow-lg hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {hero.ctaText}
              </button>
              <a
                href={waBase}
                onClick={() => trackWhatsAppClick('promo-042026-hero')}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-success-green px-6 py-3 text-base font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-success-green/60"
              >
                <BsWhatsapp className="text-xl" aria-hidden />
                {hero.secondaryCtaText ?? 'Chat WhatsApp'}
              </a>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Jarak ilustratif (bukan peta). Perbandingan BBM vs listrik memakai{' '}
              <strong className="font-medium text-slate-400">rumus yang sama</strong> dengan kalkulator &ldquo;Hitung Hemat&rdquo; di
              landing utama (Pertalite, tarif listrik rumah, asumsi model EdPower). Bagian promo di hasil adalah tambahan — bukan
              penawaran resmi; detail lewat WhatsApp.
            </p>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result ? (
            <motion.div
              id="route-promo-estimate"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35 }}
              className="mt-10 scroll-mt-20 md:scroll-mt-24 rounded-2xl border border-white/15 bg-white/10 p-1 shadow-2xl backdrop-blur-xl"
            >
              <div className="rounded-xl bg-slate-950/95 p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Perkiraan untuk rute kamu</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Jarak ~{result.distanceKm.toFixed(1)} km · bandingan biaya operasional ilustratif
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Asumsi perhitungan utama:{' '}
                  {MODEL_SPECS.find((m) => m.id === result.assumptionModelId)?.name ?? 'EdPower'} · BBM Pertalite · listrik rumah (
                  kalkulator hemat)
                </p>

                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-slate-900/80 p-4">
                    <dt className="text-sm text-slate-400">Perkiraan biaya BBM (motor konvensional)</dt>
                    <dd className="mt-1 text-2xl font-bold tabular-nums text-white">
                      Rp {result.baselineBbmIdr.toLocaleString('id-ID')}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-electric-blue/30 bg-electric-blue/10 p-4">
                    <dt className="text-sm text-electric-blue/90">Perkiraan biaya listrik (ilustrasi)</dt>
                    <dd className="mt-1 text-2xl font-bold tabular-nums text-white">
                      Rp {result.electricCostIdr.toLocaleString('id-ID')}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-xl border border-success-green/30 bg-success-green/10 px-4 py-4">
                  <p className="text-sm font-medium text-success-green">Perkiraan hemat vs BBM (ilustrasi)</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-white">
                    Rp {result.savingsIdr.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-secondary-teal/40 bg-slate-900/90 p-4">
                  <p className="text-sm font-semibold text-secondary-teal">Promo &amp; nilai untuk perjalanan ini</p>
                  <p className="mt-2 text-lg font-bold text-white">
                    Setelah diskon promo ~{result.promoDiscountPercent}%:{' '}
                    <span className="text-secondary-teal">
                      Rp {result.promoElectricIdr.toLocaleString('id-ID')}
                    </span>{' '}
                    <span className="text-base font-normal text-slate-400">(perkiraan biaya energi)</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-400">{result.promoTierLabel}</p>
                </div>

                <details className="mt-4 group rounded-xl border border-white/10 bg-slate-900/60">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-200 [&::-webkit-details-marker]:hidden flex items-center justify-between gap-2">
                    Detail promo &amp; ketentuan
                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="border-t border-white/10 px-4 py-3 text-sm text-slate-400 leading-relaxed">
                    Promo April bersifat promosi umum; syarat dan ketersediaan unit mengikuti kebijakan Wedison. Chat WhatsApp untuk
                    konfirmasi promo yang berlaku untuk kamu.
                  </div>
                </details>

                <details className="mt-2 group rounded-xl border border-white/10 bg-slate-900/60">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-200 [&::-webkit-details-marker]:hidden flex items-center justify-between gap-2">
                    Bagaimana perkiraan ini dihitung?
                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="border-t border-white/10 px-4 py-3 text-sm text-slate-400 leading-relaxed">
                    Jarak antar titik adalah ilustrasi (bukan routing GPS). Biaya BBM mengikuti kalkulator landing: konsumsi{' '}
                    ~40 km/liter × harga Pertalite. Biaya listrik: jarak ÷ efisiensi model (km/kWh, sama seperti &ldquo;Hitung
                    Hemat&rdquo;) × tarif listrik rumah Rp 1.445/kWh. Blok promo menambahkan diskon ilustratif pada biaya listrik untuk
                    menggambarkan promo April — bisa diganti API rute &amp; harga resmi nanti.
                  </div>
                </details>

                <p className="mt-6 text-base text-slate-300">
                  Langkah berikutnya: tanya jadwal test ride atau lokasi Experience Center lewat WhatsApp — tim kami bantu cocokkan model
                  dan promo.
                </p>

                <a
                  href={waBase}
                  onClick={() => trackWhatsAppClick('promo-042026-after-estimate')}
                  className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-success-green px-6 py-3 text-lg font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <BsWhatsapp className="text-xl" aria-hidden />
                  Chat WhatsApp — lanjut &amp; tanya promo
                </a>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Model chips */}
        <div className="mt-12">
          <h3 className="flex flex-wrap items-center gap-2 text-lg font-semibold text-white">
            <FiMousePointer
              className="h-5 w-5 shrink-0 text-secondary-teal"
              aria-hidden
            />
            Lihat model motor
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-0.5 text-slate-300 ring-1 ring-white/10">
              <FiMousePointer className="h-3.5 w-3.5 text-electric-blue" aria-hidden />
              Klik / tap
            </span>{' '}
            salah satu model di bawah untuk buka preview — foto masih placeholder (ganti ke aset resmi Wedison kapan saja).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {models.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setModalModel(m)}
                title={`Klik untuk preview ${m.name}`}
                aria-label={`Buka preview model ${m.name}`}
                className="group relative min-h-[44px] cursor-pointer select-none overflow-hidden rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-electric-blue/45 hover:bg-white/20 hover:shadow-lg hover:shadow-electric-blue/15 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <span className="relative z-10">{m.name}</span>
                <span
                  className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-electric-blue/15 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-14 space-y-4">
          <h3 className="text-lg font-semibold text-white">Yang sudah beralih</h3>
          {SOCIAL_PROOF.map((s) => (
            <blockquote
              key={s.name}
              className="rounded-xl border border-white/10 bg-slate-950/80 p-4 text-slate-200 backdrop-blur-sm"
            >
              <p className="text-base leading-relaxed">&ldquo;{s.quote}&rdquo;</p>
              <footer className="mt-3 text-sm text-slate-500">
                {s.name} — {s.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>

      <PromoTickerSection />

      {/* Modal */}
      <AnimatePresence>
        {modalModel ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="model-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setModalModel(null)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-slate-950 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setModalModel(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-slate-900/90 p-2 text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Tutup"
              >
                <FiX className="h-5 w-5" />
              </button>
              <div className="relative aspect-[4/3] w-full bg-slate-900">
                <Image
                  src={modalModel.imageSrc}
                  alt={`Wedison ${modalModel.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 512px"
                />
              </div>
              <div className="p-5">
                <h4 id="model-modal-title" className="text-xl font-bold text-white">
                  Wedison {modalModel.name}
                </h4>
                <Link
                  href={modalModel.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-electric-blue hover:underline"
                >
                  Pelajari di wedison.co →
                </Link>
                {modalModel.highlights.length > 0 ? (
                  <div
                    className="mt-4 flex flex-wrap gap-2"
                    role="list"
                    aria-label="Ringkasan spesifikasi model"
                  >
                    {modalModel.highlights.map((label) => (
                      <span
                        key={`${modalModel.id}-${label}`}
                        role="listitem"
                        className="inline-flex max-w-full cursor-default select-none items-center rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-left text-xs font-medium leading-snug text-slate-200 ring-1 ring-white/[0.04]"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                ) : null}
                <a
                  href={waWithModel(modalModel)}
                  onClick={() => {
                    trackWhatsAppClick('promo-042026-model-modal')
                    setModalModel(null)
                  }}
                  className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-success-green px-4 py-3 font-semibold text-white hover:bg-green-600"
                >
                  <BsWhatsapp className="text-xl" aria-hidden />
                  Tanya model ini via WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

export default function OjolRoutePromoSection({ config }: { config?: CampaignConfig }) {
  if (!config) return null
  return <OjolRoutePromoSectionContent config={config} />
}
