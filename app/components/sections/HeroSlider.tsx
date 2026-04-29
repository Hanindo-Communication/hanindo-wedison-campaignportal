'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiX, FiMaximize2 } from 'react-icons/fi'
import { MODELS, WHATSAPP_CTA } from '@/utils/constants'
import { WHATSAPP_LINKS } from '@/utils/whatsappLinks'
import { trackWhatsAppClick } from '@/utils/analytics'

interface Slide {
  id: string
  type: 'image' | 'video'
  src: string
  model: string
  title: string
  description: string
  price: string
  ctaText: string
  ctaLink: string
  highlight?: string
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const slides: Slide[] = [
    {
      id: 'sewa',
      type: 'image',
      src: '/images/hero-slider/hero-sewa.webp',
      model: 'Sewa',
      title: 'Sewa Mulai Rp 50/Hari',
      description: 'Promo Terbatas Hanya Bulan Ini • Kuota Terbatas • Harian atau Sewa Hak Milik',
      price: 'Rp 50 Per Hari',
      ctaText: WHATSAPP_CTA.button,
      ctaLink: WHATSAPP_LINKS.general,
      highlight: 'Promo Terbatas',
    },
    {
      id: 'voucher-charging',
      type: 'image',
      src: '/images/hero-slider/hero-voucher-charging.webp',
      model: 'Voucher',
      title: 'Bonus Voucher Charging',
      description: 'Voucher Charging Rp 3 Juta (Cash) • Rp 500 Ribu (Sewa)',
      price: 'Voucher Rp 3 Juta',
      ctaText: WHATSAPP_CTA.button,
      ctaLink: WHATSAPP_LINKS.general,
      highlight: 'Bonus Spesial',
    },
    {
      id: 'models',
      type: 'image',
      src: '/images/hero-slider/hero-models.png',
      model: 'Model',
      title: 'Explore Our Models',
      description: '4 Model Pilihan • Entry Level hingga Premium • SuperCharge 15 Menit',
      price: '',
      ctaText: 'Lihat Semua Model',
      ctaLink: '#models', // Scroll to models section
      highlight: 'Pilih Model Anda',
    },
  ]

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  // Handle video play/pause
  useEffect(() => {
    slides.forEach((slide, index) => {
      const video = videoRefs.current[index]
      if (video && slide.type === 'video') {
        if (index === currentSlide) {
          video.play().catch(() => {
            // Autoplay might be blocked by browser
          })
        } else {
          video.pause()
        }
      }
    })
  }, [currentSlide, slides])

  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentSlide(index)
  }

  const openImageModal = () => {
    setIsImageModalOpen(true)
    setIsAutoPlaying(false) // Pause autoplay saat modal open
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
  }

  const currentSlideData = slides[currentSlide]

  // Check if hero image is already loaded (cached) to hide placeholder badge
  useEffect(() => {
    if (currentSlideData.type === 'image' && currentSlideData.src.startsWith('/images/hero-slider/')) {
      const img = new Image()
      img.src = currentSlideData.src
      
      // Check if image is already cached
      if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        const placeholderBadge = document.getElementById(`placeholder-badge-${currentSlide}`)
        if (placeholderBadge) {
          placeholderBadge.style.display = 'none'
        }
      } else {
        img.onload = () => {
          const placeholderBadge = document.getElementById(`placeholder-badge-${currentSlide}`)
          if (placeholderBadge) {
            placeholderBadge.style.display = 'none'
          }
        }
      }
    }
  }, [currentSlide, currentSlideData.src, currentSlideData.type])

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isImageModalOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImageModal()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isImageModalOpen])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-900">
      {/* Slider Container */}
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Background Media */}
            {currentSlideData.type === 'video' ? (
              <video
                ref={(el) => {
                  videoRefs.current[currentSlide] = el
                }}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              >
                <source src={currentSlideData.src} type="video/mp4" />
              </video>
            ) : (
              <div className="relative h-full w-full">
                {/* Background Image - menggunakan img tag untuk better control */}
                <img
                  src={currentSlideData.src}
                  alt={currentSlideData.model}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Jika image gagal load, fallback ke Unsplash
                    const target = e.target as HTMLImageElement
                    // Cek apakah sudah menggunakan local path
                    if (target.src.includes('/images/hero-slider/')) {
                      const unsplashKeywords = ['electric', 'motorcycle', 'scooter', 'vehicle', 'green', 'technology']
                      const randomKeyword = unsplashKeywords[Math.floor(Math.random() * unsplashKeywords.length)]
                      target.src = `https://source.unsplash.com/featured/1920x1080/?${randomKeyword},motorcycle`
                    }
                    // Hide placeholder badge jika error
                    if (typeof document !== 'undefined') {
                      const placeholderBadge = document.getElementById(`placeholder-badge-${currentSlide}`)
                      if (placeholderBadge) {
                        placeholderBadge.style.display = 'none'
                      }
                    }
                  }}
                  onLoad={(e) => {
                    // Jika image berhasil load, hide placeholder badge
                    if (typeof document !== 'undefined') {
                      const placeholderBadge = document.getElementById(`placeholder-badge-${currentSlide}`)
                      const target = e.currentTarget as HTMLImageElement
                      // Check if image is actually loaded (handle cached images)
                      if (placeholderBadge && target.complete && target.naturalWidth > 0 && target.naturalHeight > 0) {
                        // Hanya hide jika menggunakan local image (bukan Unsplash)
                        if (target.src.includes('/images/hero-slider/')) {
                          placeholderBadge.style.display = 'none'
                        }
                      }
                    }
                  }}
                />
                {/* Placeholder Badge - akan hilang otomatis jika gambar berhasil load */}
                {currentSlideData.src.startsWith('/images/hero-slider/') && (
                  <div 
                    id={`placeholder-badge-${currentSlide}`}
                    className="absolute top-4 left-4 z-20 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg border-2 border-yellow-600"
                  >
                    PLACEHOLDER IMAGE - Upload actual asset
                  </div>
                )}
                
                {/* Fallback Placeholder - hanya muncul jika image tidak load */}
                <div 
                  id={`placeholder-${currentSlide}`}
                  className="absolute inset-0 h-full w-full bg-gradient-to-br from-electric-blue/30 via-slate-800/80 to-slate-900/90 flex items-center justify-center"
                  style={{ display: 'none' }}
                >
                  <div className="text-center text-white/50">
                    <p className="text-xl mb-2">{currentSlideData.model}</p>
                    <p className="text-sm mt-2">Image placeholder - Replace with actual photo</p>
                    <p className="text-xs mt-1">Path: {currentSlideData.src}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Overlay Gradient - lebih gelap untuk readability teks */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

            {/* Content Overlay - kembali ke tengah dengan padding bottom untuk tab indicators */}
            <div className="absolute inset-0 flex items-center justify-center px-12 md:px-4 pb-24 md:pb-32">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-white z-10"
                >
                  {/* Model Badge */}
                  {currentSlideData.highlight && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="inline-block bg-electric-blue px-4 py-2 rounded-full text-sm font-semibold mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                    >
                      {currentSlideData.highlight}
                    </motion.div>
                  )}

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
                  >
                    {currentSlideData.title}
                  </motion.h1>

                  {/* Description - USP Only */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl sm:text-3xl text-white mb-8 font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                  >
                    {currentSlideData.description}
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4 md:mb-0 relative z-30"
                  >
                    <a
                      href={currentSlideData.ctaLink}
                      onClick={(e) => {
                        // Jika link ke WhatsApp, langsung buka (tidak prevent default)
                        if (currentSlideData.ctaLink.startsWith('https://wa.me') || currentSlideData.ctaLink.startsWith('http')) {
                          trackWhatsAppClick(`hero-slider-${currentSlideData.id}`)
                          return // Let default behavior (open WhatsApp)
                        }
                        
                        // Jika link ke section, scroll dengan smooth
                        e.preventDefault()
                        if (typeof document !== 'undefined' && currentSlideData.ctaLink.startsWith('#')) {
                          const element = document.querySelector(currentSlideData.ctaLink)
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        }
                        
                        trackWhatsAppClick(`hero-slider-${currentSlideData.id}`)
                      }}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-full hover:bg-slate-100 transition-all hover:scale-105 shadow-2xl cursor-pointer"
                    >
                      {currentSlideData.ctaText} →
                    </a>
                    
                    {/* Lihat Detail Button */}
                    {currentSlideData.type === 'image' && (
                      <button
                        onClick={openImageModal}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold text-lg rounded-full hover:bg-white/30 transition-all hover:scale-105 shadow-2xl border-2 border-white/30 cursor-pointer"
                      >
                        <FiMaximize2 className="text-xl" />
                        <span>Lihat Detail</span>
                      </button>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Responsive positioning untuk mobile */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-[35%] md:top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="text-2xl md:text-3xl text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-[35%] md:top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <FiChevronRight className="text-2xl md:text-3xl text-white" />
      </button>

      {/* Model Indicators (Bottom Center) - Horizontal */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex gap-2 bg-black/30 backdrop-blur-md rounded-full px-2 py-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`px-4 py-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white text-slate-900 font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              <div className="text-sm font-medium">{slide.model}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Image Modal/Popup */}
      <AnimatePresence>
        {isImageModalOpen && currentSlideData.type === 'image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={closeImageModal}
          >
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-md p-3 rounded-full transition-all hover:scale-110 text-white"
              aria-label="Close modal"
            >
              <FiX className="text-2xl" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking on image
            >
              <img
                src={currentSlideData.src}
                alt={currentSlideData.model}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Instruction Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-sm"
            >
              Klik di luar gambar atau tekan ESC untuk menutup
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
