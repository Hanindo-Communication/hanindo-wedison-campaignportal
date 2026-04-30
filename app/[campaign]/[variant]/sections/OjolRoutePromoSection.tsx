'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FiHeadphones, FiMapPin, FiNavigation, FiX } from 'react-icons/fi'
import { type CampaignConfig } from '@/lib/campaigns'
import { estimateRouteSavings, type RouteEstimateResult } from '@/lib/estimateOjolRouteSavings'
import { useWhatsAppPreChat } from '@/app/contexts/WhatsAppPreChatContext'
import { WHATSAPP_CTA } from '@/utils/constants'
import { OJOL_ROUTE_LOCATION_SUGGESTIONS } from '@/lib/ojolRouteLocations'
import { firePromoEstimateConfetti } from '@/lib/promoEstimateConfetti'
import { getPromoModelPlaceholders, type PromoModelPlaceholder } from '@/lib/promoModelPlaceholders'
import { distanceExceedsRatedRange, recommendPromoModelIdForDistanceKm } from '@/lib/recommendPromoModelForRoute'
import { useScrollLock } from '@/lib/useScrollLock'
import { MODEL_SPECS } from '@/utils/modelSpecs'
import PromoTickerSection from '@/app/components/sections/PromoTickerSection'
import RouteLocationCombobox from '@/app/components/ui/RouteLocationCombobox'
import { useSectionRevealMotion } from '@/lib/motionPreferences'

/** Urutan tampilan section Model (marketing); tidak mengubah urutan data internal */
const MODEL_SECTION_ORDER = ['bees', 'athena', 'victory', 'edpower'] as const

function OjolRoutePromoSectionContent({ config }: { config: CampaignConfig }) {
  const { hero } = config
  const salesCtaLabel = hero.secondaryCtaText ?? WHATSAPP_CTA.button
  const { openPreChat, registerBrowseContext } = useWhatsAppPreChat()
  const reduceMotion = useReducedMotion()
  const reveal = useSectionRevealMotion()

  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<RouteEstimateResult | null>(null)
  const [modalModel, setModalModel] = useState<PromoModelPlaceholder | null>(null)
  /** Modal dibuka dari estimasi rute (auto / tombol rekomendasi), bukan dari chip "Lihat model motor" */
  const [modelModalFromRouteRecommendation, setModelModalFromRouteRecommendation] = useState(false)
  const skipAutoRecommendationPopup = useRef(false)

  useScrollLock(modalModel != null)

  useEffect(() => {
    registerBrowseContext({ section: 'route-promo' })
  }, [registerBrowseContext])

  const openModelModal = (m: PromoModelPlaceholder, fromRouteRecommendation: boolean) => {
    setModalModel(m)
    setModelModalFromRouteRecommendation(fromRouteRecommendation)
  }

  const closeModelModal = () => {
    setModalModel(null)
    setModelModalFromRouteRecommendation(false)
  }

  const models = useMemo(() => getPromoModelPlaceholders(), [])

  const modelsForSection = useMemo(() => {
    const order = new Map<string, number>(MODEL_SECTION_ORDER.map((id, i) => [id, i]))
    return [...models].sort((a, b) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99))
  }, [models])

  const recommendedModel = useMemo(() => {
    if (!result) return null
    const id = recommendPromoModelIdForDistanceKm(result.distanceKm)
    return models.find((m) => m.id === id) ?? null
  }, [result, models])

  const recommendedSpec = useMemo(() => {
    if (!recommendedModel) return null
    return MODEL_SPECS.find((m) => m.id === recommendedModel.id) ?? null
  }, [recommendedModel])

  const routeExceedsRatedRange =
    result && recommendedModel ? distanceExceedsRatedRange(result.distanceKm, recommendedModel.id) : false

  useEffect(() => {
    if (!result || !recommendedModel) return
    skipAutoRecommendationPopup.current = false
    const t = window.setTimeout(() => {
      if (!skipAutoRecommendationPopup.current) {
        openModelModal(recommendedModel, true)
      }
    }, 1000)
    return () => window.clearTimeout(t)
  }, [result, recommendedModel])

  const promoWaParts = useMemo(
    () => ({
      pickup: pickup.trim() || undefined,
      dropoff: dropoff.trim() || undefined,
      distanceKm: result?.distanceKm,
      savingsIdr: result?.savingsIdr,
      promoTierLabel: result?.promoTierLabel,
    }),
    [pickup, dropoff, result],
  )

  const openPromoWa = (extra?: { modelName?: string }) => {
    const hintParts: string[] = []
    if (result) {
      hintParts.push(
        `Simulasi rute promo Mei (~${result.distanceKm.toFixed(1)} km, hemat vs BBM) — mau detail promo & langkah lanjut.`
      )
    }
    if (extra?.modelName) {
      hintParts.push(`Fokus ke model ${extra.modelName}.`)
    }
    const hint = hintParts.length > 0 ? hintParts.join(' ') : undefined
    openPreChat(
      { kind: 'promo052026', promoParts: { ...promoWaParts, ...extra } },
      hint ? { kebutuhanHint: hint, suggestedIntent: 'explore' } : undefined
    )
  }

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
    <motion.section
      {...reveal}
      className="relative -mt-16 md:-mt-20 pt-16 md:pt-20 min-h-[min(100dvh,920px)] overflow-hidden"
      aria-labelledby="ojol-promo-headline"
    >
      {/* Background — satu nuansa terang */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-electric-blue/10">
        {bgImage ? (
          <Image
            src={bgImage}
            alt=""
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/92 to-slate-100" />
      </div>

      <div className="relative z-10 max-w-lg md:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        {hero.highlightBadge ? (
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <span className="inline-flex items-center rounded-full border border-electric-blue/25 bg-white/90 px-4 py-2 text-sm font-semibold text-electric-blue shadow-sm backdrop-blur-sm">
              {hero.highlightBadge}
            </span>
          </motion.p>
        ) : null}

        <h1
          id="ojol-promo-headline"
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-electric-blue"
        >
          {hero.headline}
        </h1>
        {hero.subheadline?.trim() ? (
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">{hero.subheadline}</p>
        ) : null}

        {/* Routing card — frosted outer, opaque inner for text */}
        <div
          id="route-promo-form"
          aria-labelledby="route-promo-form-heading"
          className="mt-8 rounded-2xl border border-slate-200/80 bg-white/80 p-1 shadow-xl shadow-slate-200/50 backdrop-blur-md"
        >
          <div className="rounded-xl bg-white p-4 sm:p-6 ring-1 ring-slate-100">
            <div className="mb-5">
              <h2
                id="route-promo-form-heading"
                className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
              >
                Info Hemat & Rekomendasi Motor Wedison
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                Cek seberapa hemat kamu dengan motor Wedison berdasarkan{' '}
                <strong className="font-semibold text-slate-900">Lokasi dan Jarak Tempuh</strong>
                .
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-2">
                <span className="h-3 w-3 shrink-0 rounded-full border-2 border-electric-blue bg-electric-blue/20" aria-hidden />
                <span className="my-1 w-px flex-1 min-h-[44px] bg-gradient-to-b from-electric-blue/70 to-slate-300/80" aria-hidden />
                <span className="h-3 w-3 shrink-0 rounded-sm border-2 border-slate-400 bg-slate-100" aria-hidden />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label htmlFor="pickup" className="sr-only">
                    Lokasi jemput
                  </label>
                  <RouteLocationCombobox
                    id="pickup"
                    name="pickup"
                    value={pickup}
                    onChange={setPickup}
                    placeholder="Lokasi jemput"
                    suggestions={OJOL_ROUTE_LOCATION_SUGGESTIONS}
                    aria-label="Lokasi jemput"
                    variant="light"
                    iconLeft={<FiNavigation className="h-5 w-5 text-electric-blue" aria-hidden />}
                  />
                </div>
                <div>
                  <label htmlFor="dropoff" className="sr-only">
                    Lokasi tujuan
                  </label>
                  <RouteLocationCombobox
                    id="dropoff"
                    name="dropoff"
                    value={dropoff}
                    onChange={setDropoff}
                    placeholder="Lokasi tujuan"
                    suggestions={OJOL_ROUTE_LOCATION_SUGGESTIONS}
                    aria-label="Lokasi tujuan"
                    variant="light"
                    iconLeft={<FiMapPin className="h-5 w-5 text-secondary-teal" aria-hidden />}
                  />
                </div>
              </div>
            </div>

            {error ? (
              <p className="mt-3 text-sm text-amber-700" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleEstimate}
                className="min-h-[48px] flex-1 rounded-xl bg-gradient-to-r from-electric-blue to-secondary-teal px-6 py-3 text-center text-base font-semibold text-white shadow-lg hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-electric-blue/40"
              >
                {hero.ctaText}
              </button>
              <button
                type="button"
                onClick={() => openPromoWa()}
                aria-label={WHATSAPP_CTA.ariaSalesCta}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-electric-blue/30 bg-electric-blue px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-electric-blue-dark focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
              >
                <FiHeadphones className="text-xl shrink-0" aria-hidden />
                {salesCtaLabel}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">Ilustrasi · bukan GPS · konfirmasi ke tim.</p>
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
              className="mt-10 scroll-mt-20 md:scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white/80 p-1 shadow-xl shadow-slate-200/50 backdrop-blur-md"
            >
              <div className="rounded-xl bg-white p-5 sm:p-8 ring-1 ring-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Estimasi · ~{result.distanceKm.toFixed(1)} km
                </h2>

                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <dt className="text-sm text-slate-500">BBM</dt>
                    <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                      Rp {result.baselineBbmIdr.toLocaleString('id-ID')}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-electric-blue/25 bg-electric-blue/10 p-4">
                    <dt className="text-sm font-medium text-electric-blue">Listrik</dt>
                    <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                      Rp {result.electricCostIdr.toLocaleString('id-ID')}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-xl border border-success-green/35 bg-success-green/10 px-4 py-4">
                  <p className="text-sm font-medium text-success-green">Hemat vs BBM</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
                    Rp {result.savingsIdr.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-secondary-teal/35 bg-secondary-teal/10 p-4">
                  <p className="text-sm font-semibold text-secondary-teal">Promo (ilustrasi)</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    ~{result.promoDiscountPercent}%:{' '}
                    <span className="text-secondary-teal">Rp {result.promoElectricIdr.toLocaleString('id-ID')}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{result.promoTierLabel}</p>
                </div>

                {recommendedModel && recommendedSpec ? (
                  <div
                    id="route-promo-model-recommendation"
                    className="mt-6 rounded-xl border border-electric-blue/30 bg-gradient-to-br from-electric-blue/10 via-white to-slate-50 p-4 sm:p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-electric-blue">Rekomendasi</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                      {recommendedModel.name}
                      {recommendedSpec.range ? ` · ~${recommendedSpec.range}` : ''}
                    </h3>
                    {routeExceedsRatedRange ? (
                      <p className="mt-2 rounded-lg border border-amber-300/80 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                        Jarak &gt; sekali charge — charge di tengah rute atau tanya tim.
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-32 sm:w-44">
                        <Image
                          src={recommendedModel.imageSrc}
                          alt={`Wedison ${recommendedModel.name}`}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width:640px) 100vw, 176px"
                          unoptimized={recommendedModel.imageSrc.endsWith('.svg')}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => {
                            skipAutoRecommendationPopup.current = true
                            openModelModal(recommendedModel, true)
                          }}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-electric-blue/40 bg-electric-blue/10 px-4 py-2 text-sm font-semibold text-electric-blue transition hover:bg-electric-blue/15 focus:outline-none focus:ring-2 focus:ring-electric-blue/40"
                        >
                          Detail model
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <details className="mt-4 group rounded-xl border border-slate-200 bg-slate-50/80">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-800 [&::-webkit-details-marker]:hidden flex items-center justify-between gap-2">
                    Detail promo
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                    <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-600 leading-relaxed">
                      Syarat mengikuti Wedison — konfirmasi ke tim sales.
                    </div>
                </details>

                <details className="mt-2 group rounded-xl border border-slate-200 bg-slate-50/80">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-800 [&::-webkit-details-marker]:hidden flex items-center justify-between gap-2">
                    Rumus singkat
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>
                      <strong className="text-slate-800">Jarak</strong> ~{result.distanceKm.toFixed(1)} km (heuristik lokasi, bukan
                      peta).
                    </p>
                    <p>
                      <strong className="text-slate-800">BBM (motor konvensional)</strong> ≈ liter × harga/liter. Liter = jarak ÷{' '}
                      {result.breakdown.fuelKmPerLiter} km/L ={' '}
                      <span className="tabular-nums text-slate-900">
                        {result.breakdown.fuelLiters.toLocaleString('id-ID', { maximumFractionDigits: 2 })} L
                      </span>{' '}
                      × Rp {result.breakdown.fuelPriceIdrPerLiter.toLocaleString('id-ID')} →{' '}
                      <span className="tabular-nums text-slate-900">
                        Rp {result.baselineBbmIdr.toLocaleString('id-ID')}
                      </span>
                      .
                    </p>
                    <p>
                      <strong className="text-slate-800">
                        Listrik (ilustrasi,{' '}
                        {MODEL_SPECS.find((m) => m.id === result.assumptionModelId)?.name ?? 'EdPower'})
                      </strong>{' '}
                      ≈ kWh × Rp/kWh. kWh = jarak ÷ {result.breakdown.kmPerKwhElectric.toFixed(2)} km/kWh ={' '}
                      <span className="tabular-nums text-slate-900">
                        {result.breakdown.electricityKWh.toLocaleString('id-ID', { maximumFractionDigits: 2 })} kWh
                      </span>{' '}
                      × Rp {result.breakdown.electricityIdrPerKwh.toLocaleString('id-ID')} →{' '}
                      <span className="tabular-nums text-slate-900">
                        Rp {result.electricCostIdr.toLocaleString('id-ID')}
                      </span>
                      .
                    </p>
                    <p>
                      <strong className="text-slate-800">Hemat vs BBM</strong> = BBM − listrik (sebelum promo). Promo: diskon
                      ilustratif ~{result.promoDiscountPercent}% pada listrik.
                    </p>
                  </div>
                </details>

                <button
                  type="button"
                  onClick={() => openPromoWa()}
                  aria-label={WHATSAPP_CTA.ariaSalesCta}
                  className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-electric-blue/30 bg-electric-blue px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-electric-blue-dark focus:outline-none focus:ring-2 focus:ring-electric-blue/40"
                >
                  <FiHeadphones className="text-xl shrink-0" aria-hidden />
                  {salesCtaLabel}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Model grid — judul + gambar; urutan marketing */}
        <div id="route-promo-models" className="mt-12 scroll-mt-24 md:scroll-mt-28">
          <h3 className="text-lg font-semibold text-slate-900">Model</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {modelsForSection.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  skipAutoRecommendationPopup.current = true
                  openModelModal(m, false)
                }}
                title={`Klik untuk preview ${m.name}`}
                aria-label={`Buka preview model ${m.name}`}
                className="group flex min-h-[44px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-electric-blue/35 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-white active:scale-[0.99]"
              >
                <span className="text-center text-xs font-bold uppercase tracking-wide text-slate-900 sm:text-sm">
                  {m.name}
                </span>
                <div className="relative mt-3 aspect-[4/3] w-full overflow-hidden rounded-lg bg-white">
                  <motion.div
                    className="relative h-full w-full"
                    initial={false}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : { scale: 1.08, y: -4 }
                    }
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  >
                    <Image
                      src={m.imageSrc}
                      alt={`Wedison ${m.name}`}
                      fill
                      unoptimized={m.imageSrc.endsWith('.svg')}
                      className="object-contain object-center"
                      sizes="(max-width:768px) 45vw, 200px"
                    />
                  </motion.div>
                </div>
              </button>
            ))}
          </div>
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
            onClick={closeModelModal}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-lg overflow-hidden rounded-2xl bg-slate-950 shadow-2xl ${
                modelModalFromRouteRecommendation
                  ? 'border border-electric-blue/35 ring-1 ring-electric-blue/20'
                  : 'border border-white/15'
              }`}
            >
              <button
                type="button"
                onClick={closeModelModal}
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
                {modelModalFromRouteRecommendation ? (
                  <p
                    id="model-modal-route-context"
                    className="mb-3 text-xs font-medium text-electric-blue/95"
                  >
                    Dari estimasi rute — detail &amp; syarat lewat tim.
                  </p>
                ) : null}
                <h4
                  id="model-modal-title"
                  className="text-xl font-bold text-white"
                  aria-describedby={modelModalFromRouteRecommendation ? 'model-modal-route-context' : undefined}
                >
                  Wedison {modalModel.name}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Informasi lebih lanjut terkait model{' '}
                  <span className="font-semibold text-slate-100">{modalModel.name}</span>
                  {'. '}
                  Kunjungi halaman resmi produk di bawah untuk spesifikasi lengkap.
                </p>
                <Link
                  href={modalModel.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-electric-blue underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Pelajari Wedison {modalModel.name} di wedison.co
                  <span aria-hidden>→</span>
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
                <button
                  type="button"
                  onClick={() => {
                    openPromoWa({ modelName: modalModel.name })
                    closeModelModal()
                  }}
                  aria-label={WHATSAPP_CTA.ariaSalesCta}
                  className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-electric-blue/30 bg-electric-blue px-4 py-3 font-semibold text-white shadow-md hover:bg-electric-blue-dark focus:outline-none focus:ring-2 focus:ring-electric-blue/40"
                >
                  <FiHeadphones className="text-xl shrink-0" aria-hidden />
                  {salesCtaLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  )
}

export default function OjolRoutePromoSection({ config }: { config?: CampaignConfig }) {
  if (!config) return null
  return <OjolRoutePromoSectionContent config={config} />
}
