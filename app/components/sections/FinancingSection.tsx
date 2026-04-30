'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiPercent, FiCalendar, FiDollarSign, FiCreditCard } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { MODEL_SPECS } from '@/utils/modelSpecs'
import { useWhatsAppPreChat } from '@/app/contexts/WhatsAppPreChatContext'
import { WHATSAPP_CTA } from '@/utils/constants'

const FINANCING_BENEFITS = [
  'Cicilan x Kredivo',
  'Cicilan hingga 36 bulan',
  'Proses approval cepat',
  'Cicilan fleksibel',
]

const CASH_BENEFITS = [
  'Diskon khusus pembelian cash',
  'Tidak ada bunga cicilan',
  'Proses lebih cepat',
  'Langsung jadi pemilik',
]

// Cash purchase data from DIRECT PURCHASE_Jan 2026.pdf
interface CashPricing {
  otr: number
  discount: number
  finalPrice: number
}

const CASH_DATA: Record<string, CashPricing> = {
  'bees': {
    otr: 20900000,
    discount: 5000000,
    finalPrice: 15900000,
  },
  'athena': {
    otr: 32900000,
    discount: 4200000,
    finalPrice: 28700000,
  },
  'athena-extended': {
    otr: 35900000,
    discount: 5200000,
    finalPrice: 30700000,
  },
  'victory': {
    otr: 33900000,
    discount: 5500000,
    finalPrice: 28400000,
  },
  'victory-extended': {
    otr: 36900000,
    discount: 7200000,
    finalPrice: 29700000,
  },
  'edpower': {
    otr: 53900000,
    discount: 8000000,
    finalPrice: 45900000,
  },
}

// Financing data from Kredivo/WOM Finance Jan 2026
interface FinancingOption {
  dp: number
  installments: {
    12: number
    18: number
    24: number
    30: number
    36: number
  }
}

interface ModelFinancing {
  otr: number
  discount: number
  options: FinancingOption[]
}

// WOM Finance x Kredivo data - Jan 2026
const FINANCING_DATA: Record<string, ModelFinancing> = {
  'bees': {
    otr: 20900000,
    discount: 5000000,
    options: [
      { dp: 3200000, installments: { 12: 1836000, 18: 1332000, 24: 1086000, 30: 941000, 36: 845000 } },
      { dp: 3700000, installments: { 12: 1786000, 18: 1297000, 24: 1057000, 30: 916000, 36: 823000 } },
      { dp: 4200000, installments: { 12: 1737000, 18: 1262000, 24: 1029000, 30: 892000, 36: 801000 } },
      { dp: 5300000, installments: { 12: 1629000, 18: 1184000, 24: 966000, 30: 838000, 36: 753000 } },
      { dp: 6300000, installments: { 12: 1530000, 18: 1113000, 24: 909000, 30: 789000, 36: 710000 } },
      { dp: 8400000, installments: { 12: 1324000, 18: 965000, 24: 790000, 30: 687000, 36: 618000 } },
    ]
  },
  'athena': {
    otr: 32900000,
    discount: 4000000,
    options: [
      { dp: 5000000, installments: { 12: 2861000, 18: 2075000, 24: 1689000, 30: 1462000, 36: 1314000 } },
      { dp: 5800000, installments: { 12: 2783000, 18: 2019000, 24: 1644000, 30: 1423000, 36: 1279000 } },
      { dp: 6600000, installments: { 12: 2704000, 18: 1962000, 24: 1598000, 30: 1384000, 36: 1244000 } },
      { dp: 8300000, installments: { 12: 2536000, 18: 1842000, 24: 1501000, 30: 1301000, 36: 1170000 } },
      { dp: 9900000, installments: { 12: 2379000, 18: 1729000, 24: 1410000, 30: 1223000, 36: 1100000 } },
      { dp: 13200000, installments: { 12: 2054000, 18: 1496000, 24: 1222000, 30: 1062000, 36: 957000 } },
    ]
  },
  'athena-extended': {
    otr: 35900000,
    discount: 5000000,
    options: [
      { dp: 5400000, installments: { 12: 3123000, 18: 2264000, 24: 1843000, 30: 1595000, 36: 1433000 } },
      { dp: 6300000, installments: { 12: 3034000, 18: 2201000, 24: 1792000, 30: 1551000, 36: 1394000 } },
      { dp: 7200000, installments: { 12: 2945000, 18: 2137000, 24: 1741000, 30: 1507000, 36: 1355000 } },
      { dp: 9000000, installments: { 12: 2768000, 18: 2010000, 24: 1638000, 30: 1419000, 36: 1276000 } },
      { dp: 10800000, installments: { 12: 2591000, 18: 1883000, 24: 1536000, 30: 1331000, 36: 1198000 } },
      { dp: 14400000, installments: { 12: 2236000, 18: 1628000, 24: 1331000, 30: 1156000, 36: 1041000 } },
    ]
  },
  'victory': {
    otr: 33900000,
    discount: 5000000,
    options: [
      { dp: 5100000, installments: { 12: 2952000, 18: 2141000, 24: 1742000, 30: 1508000, 36: 1355000 } },
      { dp: 6000000, installments: { 12: 2863000, 18: 2077000, 24: 1691000, 30: 1464000, 36: 1316000 } },
      { dp: 6800000, installments: { 12: 2784000, 18: 2020000, 24: 1646000, 30: 1425000, 36: 1281000 } },
      { dp: 8500000, installments: { 12: 2617000, 18: 1900000, 24: 1549000, 30: 1342000, 36: 1207000 } },
      { dp: 10200000, installments: { 12: 2450000, 18: 1780000, 24: 1452000, 30: 1259000, 36: 1133000 } },
      { dp: 13600000, installments: { 12: 2115000, 18: 1540000, 24: 1258000, 30: 1093000, 36: 985000 } },
    ]
  },
  'victory-extended': {
    otr: 36900000,
    discount: 7000000,
    options: [
      { dp: 5600000, installments: { 12: 3203000, 18: 2323000, 24: 1891000, 30: 1636000, 36: 1470000 } },
      { dp: 6500000, installments: { 12: 3115000, 18: 2259000, 24: 1839000, 30: 1592000, 36: 1431000 } },
      { dp: 7400000, installments: { 12: 3026000, 18: 2195000, 24: 1788000, 30: 1548000, 36: 1391000 } },
      { dp: 9300000, installments: { 12: 2839000, 18: 2061000, 24: 1680000, 30: 1456000, 36: 1309000 } },
      { dp: 11100000, installments: { 12: 2662000, 18: 1934000, 24: 1577000, 30: 1368000, 36: 1230000 } },
      { dp: 14800000, installments: { 12: 2297000, 18: 1672000, 24: 1367000, 30: 1187000, 36: 1069000 } },
    ]
  },
  'edpower': {
    otr: 53900000,
    discount: 7000000,
    options: [
      { dp: 8100000, installments: { 12: 4661000, 18: 3378000, 24: 2748000, 30: 2378000, 36: 2136000 } },
      { dp: 9500000, installments: { 12: 4523000, 18: 3279000, 24: 2669000, 30: 2309000, 36: 2075000 } },
      { dp: 10800000, installments: { 12: 4395000, 18: 3187000, 24: 2595000, 30: 2246000, 36: 2018000 } },
      { dp: 13500000, installments: { 12: 4130000, 18: 2997000, 24: 2441000, 30: 2114000, 36: 1901000 } },
      { dp: 16200000, installments: { 12: 3864000, 18: 2806000, 24: 2287000, 30: 1982000, 36: 1783000 } },
      { dp: 21600000, installments: { 12: 3332000, 18: 2424000, 24: 1980000, 30: 1718000, 36: 1548000 } },
    ]
  },
}

export default function FinancingSection() {
  const { openPreChat, registerBrowseContext } = useWhatsAppPreChat()
  // Filter main models only
  const mainModels = MODEL_SPECS.filter((m) => !m.id.includes('-extended'))
  
  const [paymentType, setPaymentType] = useState<'cicilan' | 'cash'>('cicilan')
  const [selectedModel, setSelectedModel] = useState(mainModels[0])
  const [selectedVariant, setSelectedVariant] = useState<'regular' | 'extended'>('regular')
  const [tenure, setTenure] = useState(24)
  const [selectedDpIndex, setSelectedDpIndex] = useState(0)

  // Get actual model ID (with extended variant if selected)
  const actualModelId = selectedVariant === 'extended' && selectedModel.hasExtended
    ? selectedModel.extendedId || selectedModel.id
    : selectedModel.id

  useEffect(() => {
    registerBrowseContext({
      section: 'financing',
      modelId: actualModelId,
      modelName: selectedModel.name,
    })
  }, [actualModelId, selectedModel.name, registerBrowseContext])

  // Get financing data for selected model
  const getModelFinancingKey = (modelId: string): string => {
    // Map model IDs to financing data keys
    if (modelId === 'athena-extended') return 'athena-extended'
    if (modelId === 'victory-extended') return 'victory-extended'
    if (modelId === 'athena') return 'athena'
    if (modelId === 'victory') return 'victory'
    if (modelId === 'edpower') return 'edpower'
    if (modelId === 'bees') return 'bees'
    return 'bees' // default
  }

  const financingKey = getModelFinancingKey(actualModelId)
  const financingData = FINANCING_DATA[financingKey]
  
  // Reset DP index when model or variant changes
  useEffect(() => {
    setSelectedDpIndex(0)
  }, [selectedModel.id, selectedVariant])

  // Get current DP and installment
  const currentDpOption = financingData?.options[selectedDpIndex] || financingData?.options[0]
  const dpAmount = currentDpOption?.dp || 0
  const monthlyPayment = currentDpOption?.installments[tenure as keyof typeof currentDpOption.installments] || 0

  // Monthly savings estimate (average)
  const monthlySavings = 400000 // Rp 400rb average savings
  const netMonthlyCost = monthlyPayment - monthlySavings

  // Get cash data for selected model
  const cashKey = actualModelId
  const cashData = CASH_DATA[cashKey]

  // Helper function to get price based on model and variant
  const getModelPrice = (model: typeof mainModels[0], variant: 'regular' | 'extended'): string => {
    if (variant === 'extended' && model.hasExtended) {
      const extendedModel = MODEL_SPECS.find(m => m.id === model.extendedId)
      return extendedModel?.price || model.price
    }
    return model.price
  }

  return (
    <section id="financing" className="py-12 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-2 bg-success-green/20 text-success-green rounded-full text-sm font-semibold mb-4">
            {paymentType === 'cicilan' ? 'Cicilan Kredivo' : 'Pembelian Cash'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {paymentType === 'cicilan' ? (
              <>Cicilan Ringan{' '}<span className="text-success-green">Cicilan Kredivo</span></>
            ) : (
              <>Beli Cash{' '}<span className="text-success-green">Lebih Hemat</span></>
            )}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            {paymentType === 'cicilan' 
              ? 'Hitung simulasi cicilan Kredivo dan lihat berapa yang bisa Anda hemat setiap bulan'
              : 'Dapatkan diskon spesial untuk pembelian langsung tanpa cicilan'
            }
          </p>

          {/* Payment Type Tabs */}
          <motion.div
            className="inline-flex bg-white/10 rounded-2xl p-1.5 border border-white/20 gap-1"
            initial={false}
          animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              onClick={() => setPaymentType('cicilan')}
              whileTap={{ scale: 0.95 }}
              animate={paymentType !== 'cicilan' ? {
                scale: [1, 1.02, 1],
                boxShadow: [
                  '0 0 0 0 rgba(34, 197, 94, 0)',
                  '0 0 0 4px rgba(34, 197, 94, 0.15)',
                  '0 0 0 0 rgba(34, 197, 94, 0)'
                ]
              } : {}}
              transition={paymentType !== 'cicilan' ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : { type: "spring", stiffness: 400, damping: 17 }}
              className={`flex items-center gap-2 px-5 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all text-sm md:text-base cursor-pointer ${
                paymentType === 'cicilan'
                  ? 'bg-success-green text-white shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FiCreditCard className="text-lg" />
              <span>Cicilan</span>
            </motion.button>
            <motion.button
              onClick={() => setPaymentType('cash')}
              whileTap={{ scale: 0.95 }}
              animate={paymentType !== 'cash' ? {
                scale: [1, 1.02, 1],
                boxShadow: [
                  '0 0 0 0 rgba(59, 130, 246, 0)',
                  '0 0 0 4px rgba(59, 130, 246, 0.15)',
                  '0 0 0 0 rgba(59, 130, 246, 0)'
                ]
              } : {}}
              transition={paymentType !== 'cash' ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : { type: "spring", stiffness: 400, damping: 17 }}
              className={`flex items-center gap-2 px-5 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all text-sm md:text-base cursor-pointer ${
                paymentType === 'cash'
                  ? 'bg-electric-blue text-white shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FiDollarSign className="text-lg" />
              <span>Cash</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* CICILAN CONTENT */}
        <div className={paymentType !== 'cicilan' ? 'hidden' : ''}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Calculator */}
            <motion.div
              initial={false}
          animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-6">Kalkulator Cicilan</h3>

              {/* Model Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Pilih Model
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {mainModels.map((model) => {
                    const imageMap: Record<string, string> = {
                      'edpower': '/images/models/edpower.png',
                      'athena': '/images/models/athena.png',
                      'victory': '/images/models/victory.png',
                      'bees': '/images/models/bees.png',
                    }
                    const imagePath = imageMap[model.id] || '/images/models/edpower.png'
                    
                    return (
                      <motion.button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model)
                          // Reset to regular if model doesn't have extended
                          if (!model.hasExtended) {
                            setSelectedVariant('regular')
                          }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                          selectedModel.id === model.id
                            ? 'border-success-green shadow-lg shadow-success-green/30'
                            : 'border-white/20 hover:border-white/40 hover:shadow-md'
                        }`}
                      >
                        {/* Background Image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{ 
                            backgroundImage: `url(${imagePath})`,
                            backgroundSize: '130%',
                            backgroundPosition: 'center 35%',
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 ${
                          selectedModel.id === model.id
                            ? 'bg-gradient-to-t from-success-green/95 via-success-green/60 to-success-green/30'
                            : 'bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-slate-900/30'
                        }`} />
                        
                        {/* Content */}
                        <div className="relative z-10 p-4 pt-14 md:pt-16 text-left">
                          <div className="text-lg font-bold text-white mb-0.5" translate="no">
                            {model.name}
                          </div>
                          <div className={`text-sm font-medium ${
                            selectedModel.id === model.id ? 'text-white/90' : 'text-slate-300'
                          }`}>
                            {getModelPrice(model, selectedVariant)}
                          </div>
                          
                          {/* Selected Indicator */}
                          {selectedModel.id === model.id && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                            >
                              <FiCheck className="text-success-green text-sm" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
                
                {/* Variant toggle - only show for models with extended */}
                {selectedModel.hasExtended && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setSelectedVariant('regular')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedVariant === 'regular'
                          ? 'bg-success-green text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Regular
                    </button>
                    <button
                      onClick={() => setSelectedVariant('extended')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedVariant === 'extended'
                          ? 'bg-success-green text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Extended
                    </button>
                  </div>
                )}
              </div>

              {/* DP Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Pilih Down Payment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {financingData?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDpIndex(index)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedDpIndex === index
                          ? 'bg-success-green text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Rp {(option.dp / 1000000).toFixed(1)}jt
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  DP: Rp {dpAmount.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Tenure Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Tenor Cicilan
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[12, 18, 24, 30, 36].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTenure(t)}
                      disabled={!currentDpOption?.installments[t as keyof typeof currentDpOption.installments]}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        tenure === t
                          ? 'bg-success-green text-white'
                          : currentDpOption?.installments[t as keyof typeof currentDpOption.installments]
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {t} bulan
                    </button>
                  ))}
                </div>
              </div>

              {/* Kredivo Info */}
              <div className="space-y-3 mb-6">
                <div className="bg-electric-blue/20 rounded-xl p-4 border border-electric-blue/30">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCheck className="text-electric-blue" />
                    <span className="font-semibold text-electric-blue">Cicilan Kredivo</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Cicilan fleksibel dengan proses approval cepat
                  </p>
                </div>
                <div className="bg-amber-500/20 rounded-xl p-4 border border-amber-500/30">
                  <p className="text-sm text-amber-200">
                    <span className="font-semibold">Promo berlaku:</span> 01 Jan - 31 Jan 2026
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: Results */}
            <motion.div
              initial={false}
          animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Monthly Payment Card */}
              <div className="bg-gradient-to-br from-success-green to-emerald-600 rounded-3xl p-4 sm:p-6 md:p-8 text-center ">
                <p className="text-white/80 mb-2">Cicilan per Bulan</p>
                <div className="text-5xl md:text-6xl font-bold mb-2">
                  Rp {monthlyPayment.toLocaleString('id-ID')}
                </div>
                <p className="text-white/80">
                  untuk {tenure} bulan
                </p>
              </div>

              {/* Comparison */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10">
                <h4 className="text-lg font-semibold mb-4">Perbandingan Biaya Bulanan</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300 text-sm sm:text-base truncate">Cicilan Motor</span>
                    <span className="font-bold text-red-400 text-sm sm:text-base flex-shrink-0">Rp {monthlyPayment.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300 text-sm sm:text-base truncate">Hemat BBM (estimasi)</span>
                    <span className="font-bold text-success-green text-sm sm:text-base flex-shrink-0">- Rp {monthlySavings.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm sm:text-base truncate">Biaya Bersih/Bulan</span>
                      <span className={`text-lg sm:text-2xl font-bold flex-shrink-0 ${netMonthlyCost <= 0 ? 'text-success-green' : 'text-white'}`}>
                        {netMonthlyCost <= 0 ? 'GRATIS!' : `Rp ${netMonthlyCost.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  </div>
                </div>

                {netMonthlyCost <= 0 && (
                  <div className="mt-4 bg-success-green/20 rounded-xl p-4 text-center border border-success-green/30">
                    <p className="text-success-green font-semibold">
                      Penghematan BBM menutupi cicilan Anda!
                    </p>
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4">
                {FINANCING_BENEFITS.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-3"
                  >
                    <FiCheck className="text-success-green flex-shrink-0" />
                    <span className="text-sm text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  openPreChat({ kind: 'messageKey', messageKey: 'financing' })
                }}
                className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-success-green text-white font-bold text-lg rounded-full hover:bg-green-600 transition-all hover:scale-105 shadow-xl"
              >
                <BsWhatsapp className="text-2xl" />
                <span>{WHATSAPP_CTA.financingConsult}</span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* CASH CONTENT */}
        <div className={paymentType !== 'cash' ? 'hidden' : ''}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Model Selection */}
            <motion.div
              initial={false}
          animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-6">Pilih Model</h3>

              {/* Model Selection */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3">
                  {mainModels.map((model) => {
                    const imageMap: Record<string, string> = {
                      'edpower': '/images/models/edpower.png',
                      'athena': '/images/models/athena.png',
                      'victory': '/images/models/victory.png',
                      'bees': '/images/models/bees.png',
                    }
                    const imagePath = imageMap[model.id] || '/images/models/edpower.png'
                    
                    return (
                      <motion.button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model)
                          // Reset to regular if model doesn't have extended
                          if (!model.hasExtended) {
                            setSelectedVariant('regular')
                          }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                          selectedModel.id === model.id
                            ? 'border-electric-blue shadow-lg shadow-electric-blue/30'
                            : 'border-white/20 hover:border-white/40 hover:shadow-md'
                        }`}
                      >
                        {/* Background Image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{ 
                            backgroundImage: `url(${imagePath})`,
                            backgroundSize: '130%',
                            backgroundPosition: 'center 35%',
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 ${
                          selectedModel.id === model.id
                            ? 'bg-gradient-to-t from-electric-blue/95 via-electric-blue/60 to-electric-blue/30'
                            : 'bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-slate-900/30'
                        }`} />
                        
                        {/* Content */}
                        <div className="relative z-10 p-4 pt-14 md:pt-16 text-left">
                          <div className="text-lg font-bold text-white mb-0.5" translate="no">
                            {model.name}
                          </div>
                          <div className={`text-sm font-medium ${
                            selectedModel.id === model.id ? 'text-white/90' : 'text-slate-300'
                          }`}>
                            {getModelPrice(model, selectedVariant)}
                          </div>
                          
                          {/* Selected Indicator */}
                          {selectedModel.id === model.id && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                            >
                              <FiCheck className="text-electric-blue text-sm" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
                
                {/* Variant toggle - only show for models with extended */}
                {selectedModel.hasExtended && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setSelectedVariant('regular')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedVariant === 'regular'
                          ? 'bg-electric-blue text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Regular Range
                    </button>
                    <button
                      onClick={() => setSelectedVariant('extended')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedVariant === 'extended'
                          ? 'bg-electric-blue text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Extended Range
                    </button>
                  </div>
                )}
              </div>

              {/* Cash Info */}
              <div className="space-y-3">
                <div className="bg-electric-blue/20 rounded-xl p-4 border border-electric-blue/30">
                  <div className="flex items-center gap-2 mb-2">
                    <FiDollarSign className="text-electric-blue" />
                    <span className="font-semibold text-electric-blue">Diskon Pembelian Cash</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Diskon khusus tidak berlaku untuk pembelian kredit/cicilan
                  </p>
                </div>

                <div className="bg-amber-500/20 rounded-xl p-4 border border-amber-500/30">
                  <p className="text-sm text-amber-200">
                    <span className="font-semibold">Promo berlaku:</span> 01 Jan - 31 Jan 2026
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: Cash Price Results */}
            <motion.div
              initial={false}
          animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Final Price Card */}
              <div className="bg-gradient-to-br from-electric-blue to-electric-blue-dark rounded-3xl p-4 sm:p-6 md:p-8 text-center">
                <p className="text-white/80 mb-2">Harga Cash</p>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                  Rp {cashData?.finalPrice.toLocaleString('id-ID') || '-'}
                </div>
                <p className="text-white/80 text-sm sm:text-base" translate="no">
                  {selectedModel.name} {selectedVariant === 'extended' && selectedModel.hasExtended ? 'Extended Range' : ''}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10">
                <h4 className="text-lg font-semibold mb-4">Rincian Harga</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300 text-sm sm:text-base truncate">Harga OTR</span>
                    <span className="font-bold text-white text-sm sm:text-base flex-shrink-0">Rp {cashData?.otr.toLocaleString('id-ID') || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300 text-sm sm:text-base truncate">Diskon Cash</span>
                    <span className="font-bold text-success-green text-sm sm:text-base flex-shrink-0">- Rp {cashData?.discount.toLocaleString('id-ID') || '-'}</span>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm sm:text-base truncate">Harga Final</span>
                      <span className="text-lg sm:text-2xl font-bold text-electric-blue flex-shrink-0">
                        Rp {cashData?.finalPrice.toLocaleString('id-ID') || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-success-green/20 rounded-xl p-4 text-center border border-success-green/30">
                  <p className="text-success-green font-semibold">
                    Hemat Rp {cashData?.discount.toLocaleString('id-ID') || '-'} dengan beli cash!
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4">
                {CASH_BENEFITS.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-3"
                  >
                    <FiCheck className="text-electric-blue flex-shrink-0" />
                    <span className="text-sm text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  openPreChat({ kind: 'messageKey', messageKey: 'financing' })
                }}
                className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-electric-blue text-white font-bold text-lg rounded-full hover:bg-electric-blue-dark transition-all hover:scale-105 shadow-xl"
              >
                <BsWhatsapp className="text-2xl" />
                <span>{WHATSAPP_CTA.financingOrder}</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
