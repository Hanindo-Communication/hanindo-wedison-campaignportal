'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useSectionRevealMotion, getStaggeredItemReveal } from '@/lib/motionPreferences'
import { FiArrowRight, FiDollarSign, FiClock, FiPercent, FiTool } from 'react-icons/fi'
import { BsLightningChargeFill } from 'react-icons/bs'

export default function PainPointsSection() {
  const reveal = useSectionRevealMotion()
  const reduceMotion = useReducedMotion()
  const rm = reduceMotion === true

  return (
    <motion.section {...reveal} className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold mb-4">
            Masalah Umum
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800">
            Capek dengan masalah ini?
          </h2>
        </motion.div>

        {/* Bento Grid Layout - Problem Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
          
          {/* Card 1 - BBM (Large) */}
          <motion.div
            {...getStaggeredItemReveal(rm, 0)}
            className="col-span-2 row-span-2 relative group"
          >
            <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 overflow-hidden border border-slate-700 transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-900/20">
              {/* Background Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <FiDollarSign className="text-[100px] md:text-[150px] text-white" />
              </div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent-orange/20 flex items-center justify-center mb-4">
                    <FiDollarSign className="text-2xl md:text-3xl text-accent-orange" />
                  </div>
                  <motion.div 
                    className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-2"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    Rp 400rb+
                  </motion.div>
                  <div className="text-slate-400 text-sm md:text-base font-medium">
                    pengeluaran BBM per bulan
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="inline-flex items-center gap-2 bg-accent-orange/20 rounded-full px-4 py-2">
                    <span className="text-accent-orange text-sm font-semibold">↑ Terus naik setiap tahun</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Charging Time */}
          <motion.div
            {...getStaggeredItemReveal(rm, 1)}
            className="col-span-1 aspect-square relative group"
          >
            <div className="h-full bg-slate-50 border-2 border-slate-200 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col justify-center items-center text-center transition-all duration-300 hover:border-electric-blue/30 hover:-translate-y-0.5 hover:shadow-md">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-200 flex items-center justify-center mb-3">
                <FiClock className="text-xl md:text-2xl text-slate-600" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-slate-800">3-4 Jam</div>
              <div className="text-slate-500 text-xs md:text-sm mt-1">Charging biasa</div>
            </div>
          </motion.div>

          {/* Card 3 - Komisi */}
          <motion.div
            {...getStaggeredItemReveal(rm, 2)}
            className="col-span-1 aspect-square relative group"
          >
            <div className="h-full bg-slate-50 border-2 border-slate-200 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col justify-center items-center text-center transition-all duration-300 hover:border-electric-blue/30 hover:-translate-y-0.5 hover:shadow-md">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-200 flex items-center justify-center mb-3">
                <FiPercent className="text-xl md:text-2xl text-slate-600" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-slate-800">20-30%</div>
              <div className="text-slate-500 text-xs md:text-sm mt-1">Potongan komisi</div>
            </div>
          </motion.div>

          {/* Card 4 - Maintenance */}
          <motion.div
            {...getStaggeredItemReveal(rm, 3)}
            className="col-span-1 aspect-square relative group"
          >
            <div className="h-full bg-slate-50 border-2 border-slate-200 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col justify-center items-center text-center transition-all duration-300 hover:border-electric-blue/30 hover:-translate-y-0.5 hover:shadow-md">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-200 flex items-center justify-center mb-3">
                <FiTool className="text-xl md:text-2xl text-slate-600" />
              </div>
              <div className="text-xl md:text-2xl font-black text-slate-800">Ganti Oli</div>
              <div className="text-slate-500 text-xs md:text-sm mt-1">Service rutin mahal</div>
            </div>
          </motion.div>

          {/* Card 5 - Stress Visual */}
          <motion.div
            {...getStaggeredItemReveal(rm, 4)}
            className="col-span-1 aspect-square relative group"
          >
            <div className="h-full bg-slate-50 border-2 border-slate-200 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col justify-center items-center text-center transition-all duration-300 hover:border-electric-blue/30 hover:-translate-y-0.5 hover:shadow-md">
              {rm ? (
                <div className="text-4xl md:text-5xl mb-2">😫</div>
              ) : (
                <motion.div
                  className="text-4xl md:text-5xl mb-2"
                  animate={{
                    rotate: [0, -5, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  😫
                </motion.div>
              )}
              <div className="text-slate-500 text-xs md:text-sm">Pusing terus!</div>
            </div>
          </motion.div>
        </div>

        {/* Arrow Transition */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center my-8 md:my-12"
        >
          {rm ? (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-electric-blue to-secondary-teal flex items-center justify-center shadow-lg shadow-electric-blue/20">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          ) : (
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-electric-blue to-secondary-teal flex items-center justify-center shadow-lg shadow-electric-blue/20"
            >
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          )}
        </motion.div>

        {/* Solution Section */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={false}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 bg-electric-blue/10 text-electric-blue px-5 py-2.5 rounded-full text-base md:text-lg font-bold"
            >
              <BsLightningChargeFill className="text-lg" />
              <span>Wedison Solusinya!</span>
            </motion.div>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            
            {/* Solution 1 - Hemat */}
            <motion.div
              {...getStaggeredItemReveal(rm, 5)}
              whileHover={rm ? undefined : { scale: 1.02, y: -4 }}
              className="col-span-1 bg-gradient-to-br from-success-green to-emerald-500 rounded-2xl md:rounded-3xl p-5 md:p-6 text-center cursor-pointer shadow-lg shadow-success-green/20"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <FiDollarSign className="text-2xl md:text-3xl text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-white">60%</div>
              <div className="text-white/90 text-sm font-medium">Lebih Hemat</div>
            </motion.div>

            {/* Solution 2 - Fast Charge */}
            <motion.div
              {...getStaggeredItemReveal(rm, 6)}
              whileHover={rm ? undefined : { scale: 1.02, y: -4 }}
              className="col-span-1 bg-gradient-to-br from-electric-blue to-secondary-teal rounded-2xl md:rounded-3xl p-5 md:p-6 text-center cursor-pointer shadow-lg shadow-electric-blue/20"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <BsLightningChargeFill className="text-2xl md:text-3xl text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-white">15 Menit</div>
              <div className="text-white/90 text-sm font-medium">SuperCharge</div>
            </motion.div>

            {/* Solution 3 - No Service */}
            <motion.div
              {...getStaggeredItemReveal(rm, 7)}
              whileHover={rm ? undefined : { scale: 1.02, y: -4 }}
              className="col-span-1 bg-gradient-to-br from-electric-blue to-electric-blue-dark rounded-2xl md:rounded-3xl p-5 md:p-6 text-center cursor-pointer shadow-lg shadow-electric-blue/20"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <FiTool className="text-2xl md:text-3xl text-white" />
              </div>
              <div className="text-xl md:text-2xl font-black text-white">Tanpa Oli</div>
              <div className="text-white/90 text-sm font-medium">Minimal Service</div>
            </motion.div>

            {/* Solution 4 - ROI */}
            <motion.div
              {...getStaggeredItemReveal(rm, 8)}
              whileHover={rm ? undefined : { scale: 1.02, y: -4 }}
              className="col-span-1 bg-gradient-to-br from-accent-orange to-orange-500 rounded-2xl md:rounded-3xl p-5 md:p-6 text-center cursor-pointer shadow-lg shadow-accent-orange/20"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-xl md:text-2xl font-black text-white">12-18 Bln</div>
              <div className="text-white/90 text-sm font-medium">Balik Modal</div>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div {...getStaggeredItemReveal(rm, 9)} className="mt-10 md:mt-12 text-center">
            <a
              href="#combined-savings"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold text-lg rounded-full hover:bg-slate-800 transition-all hover:scale-105 shadow-xl"
            >
              <span>Hitung Penghematan Saya</span>
              <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
