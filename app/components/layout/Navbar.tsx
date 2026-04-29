'use client'

import { Suspense, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { useWhatsAppPreChat } from '@/app/contexts/WhatsAppPreChatContext'
import Logo from '../ui/Logo'

const NAV_LINKS = [
  { label: 'Model', href: '#models' },
  { label: 'Hitung Hemat', href: '#combined-savings' },
  { label: 'Cicilan', href: '#financing' },
  { label: 'Showroom', href: '#showroom' },
  { label: 'FAQ', href: '#faq' },
]

interface NavbarProps {
  variant?: 'default' | 'minimal'
}

function NavbarInner({ variant = 'default' }: NavbarProps) {
  const pathname = usePathname()
  const { openPreChat } = useWhatsAppPreChat()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isPromo052026 = pathname?.includes('/052026/promo')

  const openNavWa = () => {
    if (isPromo052026) {
      openPreChat({ kind: 'promo052026', promoParts: {} })
    } else {
      openPreChat({ kind: 'messageKey', messageKey: 'general' })
    }
  }

  const links = variant === 'minimal' ? [] : NAV_LINKS

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 w-full items-center justify-between gap-3">
            {/* Logo */}
            <Logo 
              href="https://wedison.co"
              className={`transition-all ${
                isScrolled ? '' : 'brightness-0 invert'
              }`}
              size="medium"
            />

            {/* Desktop Navigation */}
            {links.length > 0 ? (
              <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`font-medium transition-colors ${
                      isScrolled
                        ? 'text-slate-700 hover:text-electric-blue'
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}

            {/* WA + mobile menu — satu grup supaya di mobile tidak “nyangkut” di tengah */}
            <div className="flex shrink-0 items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={openNavWa}
                className="inline-flex items-center gap-2 px-4 py-2.5 md:px-5 bg-success-green text-white text-sm md:text-base font-semibold rounded-full hover:bg-green-600 transition-all hover:scale-105 shadow-lg"
              >
                <BsWhatsapp className="text-lg" />
                <span>Chat WhatsApp</span>
              </button>
              {variant !== 'minimal' ? (
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`lg:hidden p-2 rounded-lg transition-colors ${
                    isScrolled
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <FiX className="text-2xl" />
                  ) : (
                    <FiMenu className="text-2xl" />
                  )}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {variant !== 'minimal' && isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-slate-200 shadow-xl"
            >
              <div className="px-4 py-4 space-y-2">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      openNavWa()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-success-green text-white font-semibold rounded-full hover:bg-green-600 transition-colors"
                  >
                    <BsWhatsapp className="text-xl" />
                    <span>Chat WhatsApp</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  )
}

function NavbarFallback() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-9 w-28 rounded bg-white/20" />
          <div className="h-10 w-36 rounded-full bg-success-green/40" />
        </div>
      </nav>
      <div className="h-16 md:h-20" />
    </>
  )
}

export default function Navbar(props: NavbarProps) {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarInner {...props} />
    </Suspense>
  )
}
