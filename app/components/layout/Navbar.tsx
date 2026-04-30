'use client'

import { Suspense, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiMessageCircle } from 'react-icons/fi'
import { useWhatsAppPreChat } from '@/app/contexts/WhatsAppPreChatContext'
import Logo from '../ui/Logo'
import { WHATSAPP_CTA } from '@/utils/constants'

const NAV_LINKS = [
  { label: 'Model', href: '#models' },
  { label: 'Hitung Hemat', href: '#combined-savings' },
  { label: 'Cicilan', href: '#financing' },
  { label: 'Showroom', href: '#showroom' },
  { label: 'FAQ', href: '#faq' },
]

/** In-page strip for kampanye promo (052026) — anchor ke section di halaman yang sama */
const PROMO_INPAGE_LINKS = [
  { label: 'Model', href: '#route-promo-models' },
  { label: 'Promo', href: '#promo-ticker' },
  { label: 'Kenapa Wedison', href: '#why-wedison' },
  { label: 'Lokasi', href: '#showroom' },
  { label: 'FAQ', href: '#faq' },
] as const

interface NavbarProps {
  variant?: 'default' | 'minimal'
}

function NavbarInner({ variant = 'default' }: NavbarProps) {
  const pathname = usePathname()
  const { openPreChat } = useWhatsAppPreChat()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isPromo052026 = pathname?.includes('/052026/promo')
  const navSolid = isScrolled || isPromo052026

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
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-out ${
          navSolid ? 'bg-white/95 shadow-lg backdrop-blur-md' : 'bg-transparent shadow-none backdrop-blur-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 w-full items-center justify-between gap-2 md:gap-3">
            {/* Logo */}
            <Logo
              href="https://wedison.co"
              className={`shrink-0 transition-all ${
                navSolid ? '' : 'brightness-0 invert'
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
                      navSolid
                        ? 'text-slate-700 hover:text-electric-blue'
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}

            {/* Promo halaman: menu in-page horizontal (scroll di layar sempit) */}
            {isPromo052026 ? (
              <nav
                aria-label="Navigasi bagian halaman"
                className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <ul className="flex flex-nowrap items-center justify-end gap-1.5 py-1 md:justify-center md:gap-2">
                  {PROMO_INPAGE_LINKS.map((link) => (
                    <li key={link.href} className="shrink-0">
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="inline-flex items-center rounded-full border border-slate-200/90 bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition-colors hover:border-electric-blue/35 hover:text-electric-blue md:px-3 md:text-xs"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {/* WA + mobile menu — satu grup supaya di mobile tidak “nyangkut” di tengah */}
            <div className="flex shrink-0 items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={openNavWa}
                aria-label={WHATSAPP_CTA.ariaOrderCta}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 md:px-4 bg-gradient-to-r from-electric-blue to-secondary-teal text-white text-sm md:text-base font-semibold rounded-full shadow-lg transition-all hover:opacity-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
              >
                <FiMessageCircle className="text-lg shrink-0" aria-hidden />
                <span>{WHATSAPP_CTA.navOrderCta}</span>
              </button>
              {variant !== 'minimal' ? (
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`lg:hidden p-2 rounded-lg transition-colors ${
                    navSolid
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
                    aria-label={WHATSAPP_CTA.ariaOrderCta}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-electric-blue to-secondary-teal text-white font-semibold rounded-full shadow-lg transition-colors hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                  >
                    <FiMessageCircle className="text-xl shrink-0" aria-hidden />
                    <span>{WHATSAPP_CTA.navOrderCta}</span>
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
