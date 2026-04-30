'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useSectionRevealMotion } from '@/lib/motionPreferences'
import { FiPlus, FiMinus, FiBattery, FiZap, FiTrendingUp, FiShield, FiTool, FiSmartphone } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { type CampaignConfig } from '@/lib/campaigns'
import { useWhatsAppPreChat } from '@/app/contexts/WhatsAppPreChatContext'
import { WHATSAPP_CTA } from '@/utils/constants'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  name: string
  icon: typeof FiBattery
  items: FAQItem[]
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'baterai',
    name: 'Baterai',
    icon: FiBattery,
    items: [
      {
        question: 'Apa jaminan untuk baterai?',
        answer: 'Baterai Wedison dilindungi garansi 3 tahun. Kami menggunakan baterai LiFePO4 berkualitas tinggi yang aman, tahan lama, dan ramah lingkungan.',
      },
      {
        question: 'Jenis baterai apa yang digunakan?',
        answer: 'Wedison menggunakan baterai Lithium Iron Phosphate (LiFePO4) yang dikenal lebih aman, stabil, dan memiliki masa pakai lebih panjang dibanding baterai lithium biasa.',
      },
      {
        question: 'Berapa lama baterai dapat bertahan?',
        answer: 'Baterai Wedison dirancang untuk bertahan hingga 2000+ siklus pengisian, yang setara dengan penggunaan normal selama 5-7 tahun.',
      },
      {
        question: 'Bisakah baterai diganti?',
        answer: 'Ya, baterai Wedison dapat diganti. Anda bisa mengunjungi Experience Center kami untuk penggantian baterai atau konsultasi lebih lanjut.',
      },
      {
        question: 'Bagaimana menjaga baterai dalam kondisi baik?',
        answer: 'Hindari mengisi hingga 100% atau mengosongkan hingga 0% secara rutin. Idealnya jaga level 20-80%. Simpan di tempat sejuk dan gunakan charger resmi Wedison.',
      },
    ],
  },
  {
    id: 'pengisian-daya',
    name: 'Pengisian Daya',
    icon: FiZap,
    items: [
      {
        question: 'Berapa lama waktu mengisi baterai hingga penuh?',
        answer: 'Dengan charger standar di rumah, pengisian penuh membutuhkan 2-4 jam tergantung model. Dengan SuperCharge, hanya 15 menit untuk 10-80%.',
      },
      {
        question: 'Di mana saya bisa mengisi daya?',
        answer: 'Anda bisa mengisi daya di rumah dengan charger standar, atau di stasiun SuperCharge Wedison yang tersebar di berbagai lokasi strategis.',
      },
      {
        question: 'Bisakah menggunakan charger pihak ketiga?',
        answer: 'Kami sangat menyarankan menggunakan charger resmi Wedison untuk menjaga performa dan keamanan baterai. Penggunaan charger tidak resmi dapat mempengaruhi garansi.',
      },
      {
        question: 'Seberapa sering harus mengisi daya?',
        answer: 'Tergantung pola penggunaan Anda. Untuk penggunaan harian rata-rata 30-50km, Anda mungkin perlu mengisi 2-3 hari sekali. Untuk ojol, bisa memanfaatkan SuperCharge saat istirahat.',
      },
    ],
  },
  {
    id: 'performa',
    name: 'Performa',
    icon: FiTrendingUp,
    items: [
      {
        question: 'Berapa kecepatan maksimal motor Wedison?',
        answer: 'Kecepatan maksimal bervariasi per model: Bees 60 km/h, Athena & Victory 75 km/h, dan EdPower 85 km/h.',
      },
      {
        question: 'Apakah kuat untuk naik tanjakan?',
        answer: 'Ya! Motor Wedison dilengkapi motor BLDC bertenaga yang mampu menanjak hingga 15 derajat dengan boncengan. Torsi instan memberikan akselerasi responsif.',
      },
      {
        question: 'Berapa jarak tempuh per sekali charge?',
        answer: 'Range bervariasi: Bees 80km, Athena 100km (Extended 130km), Victory 100km (Extended 130km), dan EdPower 135km per charge.',
      },
      {
        question: 'Apakah bisa digunakan untuk ojol full-time?',
        answer: 'Sangat bisa! Terutama model EdPower dengan range 135km. Dengan SuperCharge 15 menit, Anda bisa charge sambil istirahat dan lanjut bekerja.',
      },
    ],
  },
  {
    id: 'keamanan',
    name: 'Keamanan',
    icon: FiShield,
    items: [
      {
        question: 'Apa rating IP baterai Wedison?',
        answer: 'Baterai Wedison memiliki rating IP67 yang tahan debu dan tahan air (bisa terendam hingga kedalaman 1 meter selama 30 menit).',
      },
      {
        question: 'Apakah aman digunakan saat hujan?',
        answer: 'Ya, motor Wedison dirancang tahan terhadap kondisi hujan normal. Namun hindari merendam motor dalam genangan air yang dalam.',
      },
      {
        question: 'Bagaimana sistem keamanan motor?',
        answer: 'Motor Wedison dilengkapi dengan keyless ignition, alarm, dan fitur tracking melalui aplikasi untuk keamanan maksimal.',
      },
    ],
  },
  {
    id: 'layanan',
    name: 'Garansi & Layanan',
    icon: FiTool,
    items: [
      {
        question: 'Berapa lama garansi motor Wedison?',
        answer: 'Garansi baterai 3 tahun dan motor 2 tahun. Garansi mencakup kerusakan akibat cacat produksi, bukan kerusakan akibat kecelakaan atau penyalahgunaan.',
      },
      {
        question: 'Di mana saya bisa servis motor?',
        answer: 'Anda bisa mengunjungi Experience Center Wedison untuk servis berkala, perbaikan, atau konsultasi. Lokasi tersedia di beberapa kota besar.',
      },
      {
        question: 'Berapa biaya maintenance?',
        answer: 'Biaya maintenance motor listrik jauh lebih rendah dibanding motor bensin karena tidak perlu ganti oli, busi, atau filter. Hanya perlu cek rem dan ban secara berkala.',
      },
      {
        question: 'Apakah ada layanan home service?',
        answer: 'Ya, untuk beberapa layanan ringan kami menyediakan home service. Hubungi customer service kami untuk informasi lebih lanjut.',
      },
    ],
  },
  {
    id: 'fitur',
    name: 'Fitur & Aplikasi',
    icon: FiSmartphone,
    items: [
      {
        question: 'Fitur apa saja yang tersedia di aplikasi?',
        answer: 'Aplikasi Wedison menyediakan fitur tracking lokasi motor, monitoring kesehatan baterai, riwayat perjalanan, lokasi stasiun SuperCharge, dan remote lock/unlock.',
      },
      {
        question: 'Apakah motor bisa terhubung dengan smartphone?',
        answer: 'Ya, semua model Wedison dapat terhubung dengan smartphone melalui Bluetooth. Model EdPower bahkan mendukung Apple CarPlay dan Android Auto.',
      },
      {
        question: 'Apakah ada fitur anti-maling?',
        answer: 'Ya, motor Wedison dilengkapi dengan alarm, GPS tracking, dan notifikasi real-time ke smartphone jika ada aktivitas mencurigakan.',
      },
    ],
  },
]

const PROMO_OJOL_FAQ: FAQItem[] = [
  {
    question: 'Apakah angka hemat di halaman ini sama dengan biaya nyata?',
    answer:
      'Itu perkiraan ilustratif: jarak pakai heuristik (bukan GPS), asumsi BBM motor, dan biaya listrik rumah seperti kalkulator “Hitung Hemat” di landing utama. Biaya di jalan bisa beda karena ritmu narik, harga BBM, dan pola nge-charge. Untuk angka resmi, promo terbaru, dan cicilan, tanya tim lewat WhatsApp.',
  },
  {
    question: 'Motor Wedison cocok untuk driver ojol full-time?',
    answer:
      'Banyak driver pakai model dengan range lebih panjang dan SuperCharge ±15 menit saat istirahat. Pilihan model bisa disesuaikan jarak harian, pola order, dan apakah sering charge di rumah atau di jaringan SuperCharge. Tim bisa bantu rekomendasi singkat lewat WhatsApp.',
  },
  {
    question: 'Bagaimana cara test ride atau lihat unit?',
    answer:
      'Hubungi tim via WhatsApp untuk jadwal ke Experience Center (Jakarta / Bandung) atau penjelasan lokasi. Sebutkan kota dan waktu yang kamu prefer, nanti tim bantu slot dan model yang ingin dicoba.',
  },
  {
    question: 'Apa itu SuperCharge?',
    answer:
      'SuperCharge adalah pengisian cepat Wedison: perkiraan sekitar 10–80% baterai dalam ±15 menit pada model yang mendukung. Cocok untuk jeda singkat antar order tanpa nunggu lama di colokan rumah.',
  },
  {
    question: 'Promo Mei berlaku untuk semua model?',
    answer:
      'Syarat, diskon, dan ketersediaan unit mengikuti kebijakan resmi Wedison per periode. Halaman ini menampilkan ilustrasi promo; detail pasti untuk model dan lokasimu selalu dikonfirmasi lewat WhatsApp.',
  },
]

interface FAQSectionProps {
  config?: CampaignConfig
}

export default function FAQSection({ config }: FAQSectionProps) {
  const { openPreChat } = useWhatsAppPreChat()
  const reveal = useSectionRevealMotion()
  const reduceMotion = useReducedMotion()
  const rm = reduceMotion === true
  const [activeCategory, setActiveCategory] = useState(FAQ_CATEGORIES[0].id)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const openFaqWa = () => {
    if (config?.faqMode === 'promo-ojol') {
      openPreChat({ kind: 'promo052026', promoParts: {} })
    } else {
      openPreChat({ kind: 'messageKey', messageKey: 'general' })
    }
  }

  if (config?.faqMode === 'promo-ojol') {
    const togglePromo = (index: number) => {
      setOpenIndex(openIndex === index ? null : index)
    }
    return (
      <motion.section {...reveal} id="faq" className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Sebelum <span className="text-electric-blue">{WHATSAPP_CTA.button}</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-slate-600 md:text-lg leading-relaxed">
              Hal yang paling sering ditanyakan driver & komuter soal estimasi, promo, test ride, dan SuperCharge. Kalau
              butuh detail ke kasus kamu, lanjut ke tim.
            </p>
          </motion.div>

          <div className="space-y-3">
            {PROMO_OJOL_FAQ.map((item, index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-electric-blue/30 transition-colors bg-white"
              >
                <button
                  type="button"
                  onClick={() => togglePromo(index)}
                  className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left hover:bg-slate-50/80 transition-colors"
                >
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 pr-4">
                    {item.question}
                  </h3>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      openIndex === index ? 'bg-electric-blue text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {openIndex === index ? <FiMinus className="text-lg" /> : <FiPlus className="text-lg" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={rm ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={rm ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={rm ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: rm ? 0 : 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-5 pb-4 md:pb-5">
                        <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="mt-10 text-center">
            <button
              type="button"
              onClick={openFaqWa}
              className="inline-flex items-center gap-2 px-8 py-4 bg-success-green text-white font-semibold rounded-full hover:bg-green-600 transition-all hover:scale-105 shadow-lg"
            >
              <BsWhatsapp className="text-xl" />
              <span>{WHATSAPP_CTA.button}</span>
            </button>
          </motion.div>
        </div>
      </motion.section>
    )
  }

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const currentCategory = FAQ_CATEGORIES.find(cat => cat.id === activeCategory) || FAQ_CATEGORIES[0]

  return (
    <motion.section {...reveal} id="faq" className="py-12 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-2 bg-electric-blue/10 text-electric-blue rounded-full text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Pertanyaan yang{' '}
            <span className="text-electric-blue">Sering Ditanya</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Jawaban seputar baterai, pengisian daya, performa, garansi, dan fitur. Belum ketemu? Tim siap bantu lewat{' '}
            {WHATSAPP_CTA.button}.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {FAQ_CATEGORIES.map((category) => {
              const IconComponent = category.icon
              const isActive = activeCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setOpenIndex(0)
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-electric-blue text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <IconComponent className="text-base" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={rm ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={rm ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: rm ? 0 : 0.2 }}
            className="space-y-3"
          >
            {currentCategory.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-electric-blue/30 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                >
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 pr-4">
                    {item.question}
                  </h3>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      openIndex === index
                        ? 'bg-electric-blue text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {openIndex === index ? (
                      <FiMinus className="text-lg" />
                    ) : (
                      <FiPlus className="text-lg" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={rm ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={rm ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={rm ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: rm ? 0 : 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-5 pb-4 md:pb-5">
                        <p className="text-slate-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 text-center"
        >
          <button
            type="button"
            onClick={() => openPreChat({ kind: 'messageKey', messageKey: 'general' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-success-green text-white font-semibold rounded-full hover:bg-green-600 transition-all hover:scale-105 shadow-lg"
          >
            <BsWhatsapp className="text-xl" />
            <span>{WHATSAPP_CTA.button}</span>
          </button>
        </motion.div>
      </div>
    </motion.section>
  )
}
