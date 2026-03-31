'use client'

import { Suspense, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BsWhatsapp } from 'react-icons/bs'
import { FiX } from 'react-icons/fi'
import { useLandingWhatsApp } from '@/app/contexts/AdAttributionContext'
import { trackWhatsAppClick } from '@/utils/analytics'

function FloatingWhatsAppButtonInner() {
  const pathname = usePathname()
  const { linkFor, promo042026Link } = useLandingWhatsApp()
  const isPromo042026 = pathname?.includes('/042026/promo')
  const waHref = isPromo042026 ? promo042026Link() : linkFor('general')
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Show button after scrolling 300px
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Show tooltip after 5 seconds if button is visible
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowTooltip(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute bottom-full right-0 mb-3 bg-white rounded-lg shadow-xl p-4 w-64"
              >
                <button
                  onClick={() => setShowTooltip(false)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Close tooltip"
                >
                  <FiX className="text-lg" />
                </button>
                <p className="text-sm text-slate-700 pr-6">
                  <span className="font-semibold">Butuh bantuan?</span>
                  <br />
                  Chat langsung dengan tim kami!
                </p>
                {/* Arrow */}
                <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp Button */}
          <a
            href={waHref}
            onClick={() => {
              trackWhatsAppClick(isPromo042026 ? 'promo-042026-floating' : 'floating-button')
              setShowTooltip(false)
            }}
            className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-success-green rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all"
            aria-label="Chat WhatsApp"
          >
            <BsWhatsapp className="text-2xl md:text-3xl text-white" />
            
            {/* Pulse Animation */}
            <span className="absolute inset-0 rounded-full bg-success-green animate-ping opacity-25" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function FloatingWhatsAppButton() {
  return (
    <Suspense fallback={null}>
      <FloatingWhatsAppButtonInner />
    </Suspense>
  )
}
