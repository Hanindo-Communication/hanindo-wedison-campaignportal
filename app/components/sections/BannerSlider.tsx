'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import { WHATSAPP_LINKS } from '@/utils/whatsappLinks'
import { trackWhatsAppClick } from '@/utils/analytics'

interface BannerSlide {
  id: string
  image: string
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  alt: string
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'sewa',
    image: '/images/hero-slider/hero-sewa.webp',
    title: 'Sewa Mulai Rp 50/Hari',
    subtitle: 'Promo Terbatas • Kuota Terbatas',
    ctaText: 'Ambil Sekarang',
    ctaLink: WHATSAPP_LINKS.general,
    alt: 'Sewa Motor Listrik',
  },
  {
    id: 'voucher',
    image: '/images/hero-slider/hero-voucher-charging.webp',
    title: 'Bonus Voucher Charging',
    subtitle: 'Voucher Charging Rp 3 Juta',
    ctaText: 'Info Voucher',
    ctaLink: WHATSAPP_LINKS.general,
    alt: 'Voucher Charging',
  },
]

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length)
  }

  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentSlide(index)
  }

  const currentSlideData = BANNER_SLIDES[currentSlide]

  const handleCtaClick = (link?: string) => {
    if (link?.startsWith('https://wa.me') || link?.startsWith('http')) {
      trackWhatsAppClick(`banner-${currentSlideData.id}`)
    }
  }

  return (
    <section className="relative w-full bg-slate-900 overflow-hidden">
      <div className="relative h-[180px] sm:h-[220px] md:h-[280px] lg:h-[350px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              {!imageErrors[currentSlide] ? (
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.alt}
                  className="w-full h-full object-cover object-center"
                  style={{ objectFit: 'cover' }}
                  onError={() => {
                    setImageErrors({ ...imageErrors, [currentSlide]: true })
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-electric-blue to-secondary-teal flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-xl font-bold">{currentSlideData.title}</p>
                    {currentSlideData.subtitle && (
                      <p className="text-sm mt-2">{currentSlideData.subtitle}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto w-full">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                    {/* Text Content */}
                    <div className="flex-1 text-center md:text-left">
                      {currentSlideData.title && (
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">
                          {currentSlideData.title}
                        </h3>
                      )}
                      {currentSlideData.subtitle && (
                        <p className="text-sm sm:text-base md:text-lg text-white/90 drop-shadow-md">
                          {currentSlideData.subtitle}
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    {currentSlideData.ctaText && currentSlideData.ctaLink && (
                      <a
                        href={currentSlideData.ctaLink}
                        onClick={() => handleCtaClick(currentSlideData.ctaLink)}
                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white text-slate-900 font-bold text-sm sm:text-base rounded-full hover:bg-slate-100 transition-all hover:scale-105 shadow-xl whitespace-nowrap min-h-[44px] touch-target"
                      >
                        {currentSlideData.ctaText} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
        <button
          onClick={prevSlide}
          className="hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all hover:scale-110 min-w-[44px] min-h-[44px] items-center justify-center"
          aria-label="Previous slide"
        >
          <FiChevronLeft className="text-xl md:text-2xl text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all hover:scale-110 min-w-[44px] min-h-[44px] items-center justify-center"
          aria-label="Next slide"
        >
          <FiChevronRight className="text-xl md:text-2xl text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex gap-2 bg-black/30 backdrop-blur-md rounded-full px-2 py-2">
            {BANNER_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
