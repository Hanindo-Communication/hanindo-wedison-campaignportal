'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiExternalLink, FiMapPin, FiWind, FiZap } from 'react-icons/fi'
import { MdEnergySavingsLeaf } from 'react-icons/md'

const REASONS = [
  {
    icon: FiZap,
    title: 'SuperCharge — isi daya cepat',
    body:
      'SuperCharge adalah solusi pengisian cepat dari Wedison: perkiraan isi baterai dari sekitar 10% ke 80% dalam 15 menit pada model yang mendukung — hemat waktu tanpa mengorbankan kualitas pengisian.',
  },
  {
    icon: FiMapPin,
    title: 'Jaringan pengisian nasional',
    body:
      'Lebih dari 100 titik SuperCharge tersebar di Indonesia di lokasi strategis, sehingga lebih mudah merencanakan perjalanan harian tanpa khawatir kehabisan daya.',
  },
  {
    icon: MdEnergySavingsLeaf,
    title: 'Energi lebih efisien per jarak tempuh',
    body:
      'Untuk jarak yang sama, motor listrik Wedison memakai energi secara lebih efisien dibanding motor konvensional — selaras dengan narasi efisiensi di situs resmi Wedison.',
  },
  {
    icon: FiWind,
    title: 'Tanpa emisi knalpot',
    body:
      'Ditenagai listrik, setiap perjalanan berkontribusi pada udara perkotaan yang lebih bersih dibanding emisi knalpot motor bensin.',
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
          <p className="text-sm font-semibold uppercase tracking-wide text-electric-blue mb-2">
            Wedison Motors
          </p>
          <h2
            id="why-wedison-heading"
            className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
          >
            Kenapa Wedison?
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Ringkasan alasan memilih motor listrik Wedison — disesuaikan dari pesan utama di{' '}
            <span className="whitespace-nowrap">wedison.co</span> (SuperCharge, efisiensi, dan dampak
            berkendara).
          </p>
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
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-slate-600 text-[15px] leading-relaxed">{item.body}</p>
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
            Pelajari lebih lanjut di wedison.co
            <FiExternalLink className="h-4 w-4 opacity-90" aria-hidden />
          </Link>
          <Link
            href="https://wedison.co/super-charge/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-electric-blue hover:underline"
          >
            Halaman SuperCharge
            <FiExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
