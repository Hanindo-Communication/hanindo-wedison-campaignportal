'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSectionRevealMotion } from '@/lib/motionPreferences'
import { FiMapPin, FiClock, FiNavigation, FiCalendar } from 'react-icons/fi'
import { type CampaignConfig } from '@/lib/campaigns'
import { CONTACT, SHOWROOM_LOCATIONS, WHATSAPP_CTA } from '@/utils/constants'
import { useWhatsAppPreChat } from '@/app/contexts/WhatsAppPreChatContext'
import { OPEN_PRECHAT_SHOWROOM_TEST_DRIVE } from '@/lib/preChatSmartDefaults'

const SHOWROOM_FEATURES = [
  'Test drive semua model',
  'Konsultasi gratis',
  'Proses kredit di tempat',
  'Service dan after-sales',
] as const

const MAPS_EMBED_KEY = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'

export default function ShowroomSection({ config }: { config?: CampaignConfig }) {
  const { openPreChat, registerBrowseContext } = useWhatsAppPreChat()
  const reveal = useSectionRevealMotion()

  useEffect(() => {
    registerBrowseContext({ section: 'showroom' })
  }, [registerBrowseContext])

  const openTestDriveWa = () => {
    if (config?.whatsappLink === 'promo052026') {
      openPreChat({ kind: 'promo052026', promoParts: {} }, OPEN_PRECHAT_SHOWROOM_TEST_DRIVE)
    } else {
      openPreChat({ kind: 'messageKey', messageKey: 'testDrive' })
    }
  }

  return (
    <motion.section
      {...reveal}
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
          <p className="text-sm font-semibold uppercase tracking-wide text-electric-blue mb-2">Lokasi</p>
          <h2
            id="showroom-heading"
            className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
          >
            Showroom Wedison
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {SHOWROOM_LOCATIONS.map((loc, idx) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-32px' }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="flex min-h-0 flex-col gap-4"
            >
              <h3 className="text-center text-xl font-bold tracking-tight text-electric-blue sm:text-2xl lg:text-left">
                {loc.title}
              </h3>
              <div className="relative min-h-[240px] flex-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100/40 shadow-sm shadow-slate-200/50 ring-1 ring-slate-900/[0.04] transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-300/40 sm:min-h-[280px] lg:min-h-[320px]">
                <iframe
                  title={`Peta lokasi showroom Wedison ${loc.title}`}
                  src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_EMBED_KEY}&q=${encodeURIComponent(loc.embedQuery)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 min-h-[240px] sm:min-h-[280px] lg:min-h-[320px]"
                />
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-electric-blue/15 to-secondary-teal/10 text-electric-blue">
                    <FiMapPin className="text-lg" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-semibold text-slate-900">{loc.area}</h4>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed" translate="no">
                      {loc.address}
                    </p>
                    <a
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-electric-blue hover:underline"
                    >
                      <FiNavigation className="shrink-0 text-base" aria-hidden />
                      Buka di Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-32px' }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="mx-auto mt-10 flex max-w-3xl flex-col gap-5 md:mt-12 md:gap-6"
        >
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
            <h3 className="text-lg font-semibold text-slate-900">Fasilitas</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SHOWROOM_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 text-[15px] text-slate-700">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric-blue/15 text-xs font-bold text-electric-blue"
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
            <button
              type="button"
              onClick={openTestDriveWa}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 border-electric-blue bg-white px-6 py-3.5 text-center text-base font-semibold text-electric-blue shadow-sm transition-all hover:bg-electric-blue/5 hover:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/40"
            >
              <FiCalendar className="shrink-0 text-xl" aria-hidden />
              <span>{WHATSAPP_CTA.testDrive}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
