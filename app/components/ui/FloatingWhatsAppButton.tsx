'use client'

import { Suspense, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FiMessageCircle, FiX } from 'react-icons/fi'
import { useWhatsAppPreChat } from '@/app/contexts/WhatsAppPreChatContext'
import { WHATSAPP_CTA } from '@/utils/constants'

function FloatingWhatsAppButtonInner() {
  const pathname = usePathname()
  const { openPreChat } = useWhatsAppPreChat()
  const reduceMotion = useReducedMotion()
  const isPromo052026 = pathname?.includes('/052026/promo')

  const openFloatingWa = () => {
    if (isPromo052026) {
      openPreChat({ kind: 'promo052026', promoParts: {} })
    } else {
      openPreChat({ kind: 'messageKey', messageKey: 'general' })
    }
    setShowTooltip(false)
  }
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
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.3 }}
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
                <p className="text-sm text-slate-700 pr-6">{WHATSAPP_CTA.floatingTooltip}</p>
                {/* Arrow */}
                <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Order / chat FAB — selaras navbar promo */}
          <button
            type="button"
            onClick={openFloatingWa}
            className={`relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl bg-gradient-to-br from-electric-blue to-secondary-teal text-white transition-all hover:opacity-95 hover:shadow-electric-blue/40 focus:outline-none focus:ring-2 focus:ring-electric-blue/60 ${
              reduceMotion ? '' : 'hover:scale-110'
            }`}
            aria-label={WHATSAPP_CTA.ariaOrderCta}
          >
            <FiMessageCircle className="text-2xl md:text-3xl" aria-hidden />

            {!reduceMotion ? (
              <span className="pointer-events-none absolute inset-0 rounded-full bg-electric-blue opacity-20 animate-ping" />
            ) : null}
          </button>
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
