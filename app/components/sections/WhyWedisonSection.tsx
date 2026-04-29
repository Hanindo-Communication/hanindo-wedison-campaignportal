'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiExternalLink, FiMapPin, FiWind, FiZap } from 'react-icons/fi'
import { MdEnergySavingsLeaf } from 'react-icons/md'

const REASONS = [
  {
    icon: FiZap,
    title: 'SuperCharge · ~15 menit (10–80%)',
    body: 'Isi cepat di jaringan Wedison — cocok jeda singkat antar order atau sebelum jalan jauh.',
  },
  {
    icon: FiMapPin,
    title: '100+ titik pengisian',
    body: 'Titik SuperCharge tersebar di kota besar — rencanakan rute harian lebih mudah.',
  },
  {
    icon: MdEnergySavingsLeaf,
    title: 'Hemat energi per km',
    body: 'Untuk jarak yang sama, biaya energi listrik biasanya jauh lebih ringan dibanding BBM motor bensin.',
  },
  {
    icon: FiWind,
    title: 'Tanpa asap knalpot',
    body: 'Ditenagai listrik — berkendara lebih tenang tanpa emisi knalpot di jalan.',
  },
] as const

export default function WhyWedisonSection() {
  return (
    <section
      id="why-wedison"
      className="relative scroll-mt-20 bg-gradient-to-b from-slate-50 to-white py-16 md:py-24 overflow-hidden"
      aria-labelledby="why-wedison-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-electric-blue mb-2">Wedison</p>
          <h2
            id="why-wedison-heading"
            className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
          >
            Kenapa Wedison?
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {REASONS.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-32px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60 hover:border-electric-blue/25 hover:shadow-md transition-colors"
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-electric-blue/15 to-secondary-teal/10 text-electric-blue">
                  <item.icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed md:text-[15px]">{item.body}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left"
        >
          <Link
            href="https://wedison.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
          >
            wedison.co
            <FiExternalLink className="h-4 w-4 opacity-90" aria-hidden />
          </Link>
          <Link
            href="https://wedison.co/super-charge/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-electric-blue hover:underline"
          >
            SuperCharge
            <FiExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
