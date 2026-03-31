'use client'

import { BsWhatsapp } from 'react-icons/bs'
import { FiMapPin, FiMail, FiClock } from 'react-icons/fi'
import { CONTACT } from '@/utils/constants'
import { useLandingWhatsApp } from '@/app/contexts/AdAttributionContext'
import { trackWhatsAppClick } from '@/utils/analytics'
import Logo from '../ui/Logo'

export default function Footer() {
  const { linkFor } = useLandingWhatsApp()

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div className="text-center md:text-left">
            <div className="mb-4 flex justify-center md:justify-start">
              <Logo href="https://wedison.co" className="brightness-0 invert" size="large" />
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md mx-auto md:mx-0">
              Motor listrik dengan teknologi SuperCharge. Hemat hingga 60% biaya BBM.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={linkFor('general')}
                  onClick={() => trackWhatsAppClick('footer-phone')}
                  className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors"
                >
                  <BsWhatsapp className="text-lg mt-1 flex-shrink-0" aria-hidden />
                  <span>{CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors"
                >
                  <FiMail className="text-lg mt-1 flex-shrink-0" aria-hidden />
                  <span>{CONTACT.email}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Lokasi</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <FiMapPin className="text-lg mt-1 flex-shrink-0" aria-hidden />
                <span translate="no">{CONTACT.showroomAddress}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <FiClock className="text-lg mt-1 flex-shrink-0" aria-hidden />
                <div>
                  <div>{CONTACT.showroomHours.weekday}</div>
                  <div>{CONTACT.showroomHours.weekend}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
