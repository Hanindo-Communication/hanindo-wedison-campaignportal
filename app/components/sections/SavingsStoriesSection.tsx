'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiChevronLeft, FiChevronRight, FiMapPin, FiCalendar } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { WHATSAPP_LINKS } from '@/utils/whatsappLinks'
import { WHATSAPP_CTA } from '@/utils/constants'
import { trackWhatsAppClick } from '@/utils/analytics'

interface SavingsStory {
  id: string
  name: string
  role: string
  location: string
  model: string
  image: string
  quote: string
  savings: {
    monthly: string
    yearly: string
    percentage: string
  }
  beforeAfter: {
    before: string
    after: string
  }
  rating: number
  usageSince: string
}

const STORIES: SavingsStory[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    role: 'Driver Ojek Online',
    location: 'Jakarta Selatan',
    model: 'Wedison EdPower',
    image: '/images/testimonials/driver-1.jpg',
    quote: 'Dulu BBM habis Rp 600rb sebulan. Sekarang listrik cuma Rp 150rb. Hemat banyak banget!',
    savings: {
      monthly: 'Rp 450.000',
      yearly: 'Rp 5.400.000',
      percentage: '75%',
    },
    beforeAfter: {
      before: 'Rp 600.000/bulan (BBM)',
      after: 'Rp 150.000/bulan (Listrik)',
    },
    rating: 5,
    usageSince: 'Agustus 2025',
  },
  {
    id: '2',
    name: 'Sari Dewi',
    role: 'Daily Commuter',
    location: 'Tangerang',
    model: 'Wedison Victory',
    image: '/images/testimonials/driver-2.jpg',
    quote: 'Ke kantor PP 40km sehari. Dulu habis Rp 300rb/bulan, sekarang cuma Rp 80rb. Plus charging di rumah praktis!',
    savings: {
      monthly: 'Rp 220.000',
      yearly: 'Rp 2.640.000',
      percentage: '73%',
    },
    beforeAfter: {
      before: 'Rp 300.000/bulan (BBM)',
      after: 'Rp 80.000/bulan (Listrik)',
    },
    rating: 5,
    usageSince: 'September 2025',
  },
  {
    id: '3',
    name: 'Andi Wijaya',
    role: 'Kurir Ekspedisi',
    location: 'Bekasi',
    model: 'Wedison EdPower',
    image: '/images/testimonials/driver-3.jpg',
    quote: 'Saya pakai full-time untuk antar paket. Range 135km cukup banget, charging cepat 15 menit saat istirahat.',
    savings: {
      monthly: 'Rp 520.000',
      yearly: 'Rp 6.240.000',
      percentage: '65%',
    },
    beforeAfter: {
      before: 'Rp 800.000/bulan (BBM)',
      after: 'Rp 280.000/bulan (Listrik)',
    },
    rating: 5,
    usageSince: 'Juli 2025',
  },
]

export default function SavingsStoriesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  const activeStory = STORIES[activeIndex]

  const nextStory = () => {
    setActiveIndex((prev) => (prev + 1) % STORIES.length)
  }

  const prevStory = () => {
    setActiveIndex((prev) => (prev - 1 + STORIES.length) % STORIES.length)
  }

  return (
    <section id="savings-stories" className="py-12 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-success-green/10 text-success-green rounded-full text-sm font-semibold mb-4">
            Cerita Nyata
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Berapa Mereka{' '}
            <span className="text-success-green">Hemat?</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Lihat pengalaman nyata dari pengguna Wedison yang sudah merasakan penghematan
          </p>
        </motion.div>

        {/* Story Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-slate-100"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left: Profile & Quote */}
            <div className="p-6 md:p-10 bg-gradient-to-br from-slate-50 to-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Profile */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                      {!imageError[activeStory.id] ? (
                        <img
                          src={activeStory.image}
                          alt={activeStory.name}
                          className="w-full h-full object-cover"
                          onError={() => setImageError({ ...imageError, [activeStory.id]: true })}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-electric-blue text-white text-2xl font-bold">
                          {activeStory.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800" translate="no">{activeStory.name}</h3>
                      <p className="text-electric-blue font-medium">{activeStory.role}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <FiMapPin className="text-xs" />
                        <span translate="no">{activeStory.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-slate-700 mb-6 relative">
                    <span className="absolute -top-4 -left-2 text-6xl text-electric-blue/20 font-serif">"</span>
                    <p className="relative z-10 italic">{activeStory.quote}</p>
                  </blockquote>

                  {/* Rating & Model */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(activeStory.rating)].map((_, i) => (
                        <FiStar key={i} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full" translate="no">
                      {activeStory.model}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-slate-500">
                      <FiCalendar className="text-xs" />
                      Sejak {activeStory.usageSince}
                    </span>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={prevStory}
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                      aria-label="Previous story"
                    >
                      <FiChevronLeft className="text-xl text-slate-600" />
                    </button>
                    <div className="flex gap-2">
                      {STORIES.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === activeIndex
                              ? 'w-6 bg-electric-blue'
                              : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                          aria-label={`Go to story ${index + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextStory}
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                      aria-label="Next story"
                    >
                      <FiChevronRight className="text-xl text-slate-600" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Savings Breakdown */}
            <div className="p-6 md:p-10 bg-gradient-to-br from-success-green to-emerald-600 text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStory.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Savings Highlight */}
                  <div className="text-center mb-8">
                    <p className="text-white/80 text-sm mb-2">Total Hemat per Bulan</p>
                    <div className="text-5xl md:text-6xl font-bold mb-2">
                      {activeStory.savings.monthly}
                    </div>
                    <p className="text-white/80">
                      atau <span className="font-semibold">{activeStory.savings.yearly}/tahun</span>
                    </p>
                  </div>

                  {/* Before/After */}
                  <div className="space-y-4 mb-8">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-sm text-white/70 mb-1">Sebelum (Motor BBM)</div>
                      <div className="text-xl font-bold text-red-200">{activeStory.beforeAfter.before}</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-sm text-white/70 mb-1">Sesudah (Wedison)</div>
                      <div className="text-xl font-bold text-green-200">{activeStory.beforeAfter.after}</div>
                    </div>
                  </div>

                  {/* Percentage Badge */}
                  <div className="text-center mb-8">
                    <span className="inline-block px-6 py-3 bg-white text-success-green text-2xl font-bold rounded-full">
                      Hemat {activeStory.savings.percentage}
                    </span>
                  </div>

                  {/* CTA */}
                  <a
                    href={WHATSAPP_LINKS.general}
                    onClick={() => trackWhatsAppClick('savings-story')}
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white text-success-green font-bold rounded-full hover:bg-slate-50 transition-colors"
                  >
                    <BsWhatsapp className="text-xl" />
                    <span>{WHATSAPP_CTA.savings}</span>
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
