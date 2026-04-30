'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useSectionRevealMotion } from '@/lib/motionPreferences'
import Image from 'next/image'
import { FiZap, FiBattery, FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { type CampaignConfig } from '@/lib/campaigns'

interface HeroSectionProps {
  config: CampaignConfig
}

const QUICK_STATS = [
  { icon: FiDollarSign, label: 'Hemat 60%', sublabel: 'biaya BBM' },
  { icon: FiZap, label: '15 menit', sublabel: 'SuperCharge' },
  { icon: FiBattery, label: '135 km', sublabel: 'range' },
]

// Banner slides data - Aspect ratio 4:5 (width:height = 1400:900 approx)
const BANNER_SLIDES = [
  {
    id: 'sewa',
    image: '/images/hero-slider/hero-sewa.webp',
    alt: 'Sewa Motor Listrik - Mulai Rp 50rb per hari',
  },
  {
    id: 'subsidi',
    image: '/images/hero-slider/hero-beli-subsidi.webp',
    alt: 'Beli Motor Listrik dengan Subsidi 8 Juta',
  },
  {
    id: 'voucher',
    image: '/images/hero-slider/hero-voucher-charging.webp',
    alt: 'Bonus Voucher Charging Rp 3 Juta',
  },
]

// Slider auto-play interval (ms)
const AUTOPLAY_INTERVAL = 5000

export default function HeroSection({ config }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { hero } = config
  const reduceMotion = useReducedMotion()
  const reveal = useSectionRevealMotion()

  // Navigate to next slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length)
  }, [])

  // Navigate to previous slide
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length)
  }, [])

  // Go to specific slide
  const goToSlide = useCallback((index: number) => {
    setIsAutoPlaying(false)
    setCurrentSlide(index)
  }, [])

  // Handle manual navigation (pauses autoplay)
  const handleManualNav = useCallback((direction: 'next' | 'prev') => {
    setIsAutoPlaying(false)
    if (direction === 'next') {
      nextSlide()
    } else {
      prevSlide()
    }
  }, [nextSlide, prevSlide])

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(nextSlide, AUTOPLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [isAutoPlaying, nextSlide])

  return (
    <motion.section
      {...reveal}
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden -mt-16 md:-mt-20 pt-16 md:pt-20"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-electric-blue/30">
        {hero.backgroundImage && (
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${hero.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-success-green/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
        {/* Highlight Badge */}
        {hero.highlightBadge && (
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-success-green/20 border border-success-green/30 text-success-green rounded-full text-sm font-semibold backdrop-blur-sm">
              <FiZap className="text-lg" />
              {hero.highlightBadge}
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
        >
          {hero.headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto"
        >
          {hero.subheadline}
        </motion.p>

        {/* Quick Stats */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8"
        >
          {QUICK_STATS.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
            >
              <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
                <stat.icon className="text-xl text-electric-blue" />
              </div>
              <div className="text-left">
                <div className="text-white font-bold">{stat.label}</div>
                <div className="text-slate-400 text-sm">{stat.sublabel}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== PROMO BANNER SLIDER ===== */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative w-full max-w-3xl mx-auto mb-8"
        >
          {/* Slider Container - Aspect ratio 14:9 to match promo images */}
          <div 
            className="relative w-full overflow-hidden rounded-2xl shadow-2xl border border-white/20"
            style={{ aspectRatio: '14 / 9' }}
          >
            {/* Slides */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0.2 : 0.4, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={BANNER_SLIDES[currentSlide].image}
                  alt={BANNER_SLIDES[currentSlide].alt}
                  fill
                  priority={currentSlide === 0}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={() => handleManualNav('prev')}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Slide sebelumnya"
            >
              <FiChevronLeft className="text-xl text-white" />
            </button>

            <button
              onClick={() => handleManualNav('next')}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Slide berikutnya"
            >
              <FiChevronRight className="text-xl text-white" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-2">
                {BANNER_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    aria-label={`Ke slide ${index + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? 'w-6 h-2 bg-white'
                        : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            {isAutoPlaying && !reduceMotion && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                <motion.div
                  key={currentSlide}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
                  className="h-full bg-white/60"
                />
              </div>
            )}
          </div>

          {/* Slide Counter */}
          <div className="absolute -bottom-6 right-0 text-white/60 text-sm font-medium">
            {currentSlide + 1} / {BANNER_SLIDES.length}
          </div>
        </motion.div>
        {/* ===== END PROMO BANNER SLIDER ===== */}

      </div>
    </motion.section>
  )
}
