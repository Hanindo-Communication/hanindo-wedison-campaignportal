'use client'

import { motion } from 'framer-motion'
import { FiMapPin, FiClock, FiNavigation } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { type CampaignConfig } from '@/lib/campaigns'
import { CONTACT } from '@/utils/constants'
import { useLandingWhatsApp } from '@/app/contexts/AdAttributionContext'
import { trackWhatsAppClick } from '@/utils/analytics'

const SHOWROOM_FEATURES = [
  'Test drive semua model',
  'Konsultasi gratis',
  'Proses kredit di tempat',
  'Service dan after-sales',
] as const

export default function ShowroomSection({ config }: { config?: CampaignConfig }) {
  const { linkFor, promo042026Link } = useLandingWhatsApp()
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.showroomAddress)}`
  const testDriveHref =
    config?.navigation === 'minimal' ? promo042026Link() : linkFor('testDrive')

  return (
    <section
      id="showroom"
      className="relative scroll-mt-20 md:scroll-mt-24 overflow-hidden bg-gradient-to-b from-white via-slate-50/90 to-slate-50 py-16 md:py-24"
      aria-labelledby="showroom-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-electric-blue mb-2">
            Experience Center
          </p>
          <h2
            id="showroom-heading"
            className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
          >
            Test drive di{' '}
            <span className="text-electric-blue">Showroom Wedison</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Kunjungi kami di Pondok Indah — rasakan motor listrik &amp; tanya promo langsung ke tim.
          </p>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-32px' }}
            transition={{ duration: 0.4 }}
            className="relative w-full min-h-0 rounded-2xl border border-slate-200/80 bg-slate-100/40 shadow-sm shadow-slate-200/50 ring-1 ring-slate-900/[0.04] overflow-hidden"
          >
            <div className="relative aspect-[3/4] sm:aspect-square lg:aspect-auto lg:h-full lg:min-h-[400px]">
              <iframe
                title="Peta lokasi showroom Wedison Pondok Indah"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(CONTACT.showroomAddress)}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-br from-electric-blue/10 to-cyan-500/10 opacity-0 transition-opacity duration-300">
                <div className="text-center text-slate-600">
                  <FiMapPin className="text-4xl mx-auto mb-2 text-electric-blue" aria-hidden />
                  <p className="font-semibold">Showroom Wedison</p>
                  <p className="text-sm">Pondok Indah, Jakarta Selatan</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-32px' }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="flex flex-col gap-5 md:gap-6"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-electric-blue/15 to-secondary-teal/10 text-electric-blue">
                  <FiMapPin className="text-xl" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900">Alamat</h3>
                  <p className="mt-1 text-slate-600 leading-relaxed" translate="no">
                    {CONTACT.showroomAddress}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-electric-blue hover:underline"
                  >
                    <FiNavigation className="text-base shrink-0" aria-hidden />
                    Buka di Google Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-success-green/15 to-emerald-500/10 text-success-green">
                  <FiClock className="text-xl" aria-hidden />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Jam operasional</h3>
                  <p className="mt-1 text-slate-600">{CONTACT.showroomHours.weekday}</p>
                  <p className="text-slate-600">{CONTACT.showroomHours.weekend}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-electric-blue/15 bg-gradient-to-br from-electric-blue/[0.07] to-secondary-teal/[0.05] p-6 ring-1 ring-slate-900/[0.03]">
              <h3 className="text-lg font-semibold text-slate-900">Yang bisa kamu lakukan</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SHOWROOM_FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-[15px] text-slate-700">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric-blue/15 text-electric-blue text-xs font-bold"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <a
                href={testDriveHref}
                onClick={() => trackWhatsAppClick('showroom-test-drive')}
                className="flex w-full min-h-[52px] items-center justify-center gap-2 rounded-full bg-success-green px-6 py-3.5 text-center text-base font-semibold text-white shadow-md transition-all hover:bg-green-600 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-success-green/50"
              >
                <BsWhatsapp className="text-xl shrink-0" aria-hidden />
                <span>Booking test drive</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
