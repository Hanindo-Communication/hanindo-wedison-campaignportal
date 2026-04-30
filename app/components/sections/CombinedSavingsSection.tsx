'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { FiBattery, FiZap, FiTruck, FiUser, FiCheck, FiClock, FiStar, FiChevronLeft, FiChevronRight, FiMapPin, FiCalendar, FiDollarSign, FiPercent } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { MODEL_SPECS } from '@/utils/modelSpecs'
import {
  ELECTRICITY_IDR_PER_KWH,
  FUEL_KM_PER_LITER,
  MODEL_EFFICIENCY,
} from '@/lib/combinedSavingsFormulas'
import { useWhatsAppPreChat } from '@/app/contexts/WhatsAppPreChatContext'
import { WHATSAPP_CTA } from '@/utils/constants'
import { useSectionRevealMotion } from '@/lib/motionPreferences'

// Usage presets
const USAGE_PRESETS = [
  { id: 'ojol', label: 'Driver Ojol', distance: 1000, icon: FiTruck, description: '1000 km/bulan' },
  { id: 'commuter', label: 'Daily Commuter', distance: 500, icon: FiUser, description: '500 km/bulan' },
  { id: 'custom', label: 'Custom', distance: 0, icon: FiZap, description: 'Atur sendiri' },
]

// Savings Stories Data
interface SavingsStory {
  id: string
  name: string
  role: string
  location: string
  model: string
  image: string
  quote: string
  savings: {
    monthly: string
    yearly: string
    percentage: string
  }
  beforeAfter: {
    before: string
    after: string
  }
  rating: number
  usageSince: string
}

const STORIES: SavingsStory[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    role: 'Driver Ojek Online',
    location: 'Jakarta Selatan',
    model: 'Wedison EdPower',
    image: '/images/testimonials/driver-1.jpg',
    quote: 'Dulu BBM habis Rp 600rb sebulan. Sekarang listrik cuma Rp 150rb. Hemat banyak banget!',
    savings: {
      monthly: 'Rp 450.000',
      yearly: 'Rp 5.400.000',
      percentage: '75%',
    },
    beforeAfter: {
      before: 'Rp 600.000/bulan (BBM)',
      after: 'Rp 150.000/bulan (Listrik)',
    },
    rating: 5,
    usageSince: 'Agustus 2025',
  },
  {
    id: '2',
    name: 'Sari Dewi',
    role: 'Daily Commuter',
    location: 'Tangerang',
    model: 'Wedison Victory',
    image: '/images/testimonials/driver-2.jpg',
    quote: 'Ke kantor PP 40km sehari. Dulu habis Rp 300rb/bulan, sekarang cuma Rp 80rb. Plus charging di rumah praktis!',
    savings: {
      monthly: 'Rp 220.000',
      yearly: 'Rp 2.640.000',
      percentage: '73%',
    },
    beforeAfter: {
      before: 'Rp 300.000/bulan (BBM)',
      after: 'Rp 80.000/bulan (Listrik)',
    },
    rating: 5,
    usageSince: 'September 2025',
  },
  {
    id: '3',
    name: 'Andi Wijaya',
    role: 'Kurir Ekspedisi',
    location: 'Bekasi',
    model: 'Wedison EdPower',
    image: '/images/testimonials/driver-3.jpg',
    quote: 'Saya pakai full-time untuk antar paket. Range 135km cukup banget, charging cepat 15 menit saat istirahat.',
    savings: {
      monthly: 'Rp 520.000',
      yearly: 'Rp 6.240.000',
      percentage: '65%',
    },
    beforeAfter: {
      before: 'Rp 800.000/bulan (BBM)',
      after: 'Rp 280.000/bulan (Listrik)',
    },
    rating: 5,
    usageSince: 'Juli 2025',
  },
]

// Animated Bar Chart Component
function AnimatedBarChart({
  monthlyFuelCost,
  monthlyElectricityCost,
  monthlyFuelLiters,
  monthlyElectricityKWh,
  selectedModelData,
}: {
  monthlyFuelCost: number
  monthlyElectricityCost: number
  monthlyFuelLiters: number
  monthlyElectricityKWh: number
  selectedModelData: typeof MODEL_SPECS[0]
}) {
  const maxCost = 400000
  const fuelPercentage = Math.min((monthlyFuelCost / maxCost) * 100, 100)
  const electricPercentage = Math.min((monthlyElectricityCost / maxCost) * 100, 100)

  const fuelWidth = useMotionValue(fuelPercentage)
  const electricWidth = useMotionValue(electricPercentage)
  const fuelSpring = useSpring(fuelWidth, { stiffness: 200, damping: 25 })
  const electricSpring = useSpring(electricWidth, { stiffness: 200, damping: 25 })
  const fuelWidthPercent = useTransform(fuelSpring, (latest) => `${latest}%`)
  const electricWidthPercent = useTransform(electricSpring, (latest) => `${latest}%`)

  useEffect(() => {
    fuelWidth.set(fuelPercentage)
  }, [fuelPercentage, fuelWidth])

  useEffect(() => {
    electricWidth.set(electricPercentage)
  }, [electricPercentage, electricWidth])

  return (
    <div className="space-y-6">
      {/* Motor BBM Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-3">
          <span className="text-base font-semibold text-slate-700">Motor Bensin</span>
          <div className="flex items-center gap-2">
            <motion.span
              key={`fuel-${monthlyFuelLiters}`}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-xl font-bold text-red-600"
            >
              Rp {Math.round(monthlyFuelCost).toLocaleString('id-ID')}
            </motion.span>
            <span className="text-sm text-slate-500">({monthlyFuelLiters.toFixed(1)} L)</span>
          </div>
        </div>
        <div className="relative h-10 md:h-12 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            style={{ width: fuelWidthPercent }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full shadow-md"
          />
        </div>
      </div>

      {/* Wedison Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-3">
          <span className="text-base font-semibold text-slate-700" translate="no">Wedison {selectedModelData.name}</span>
          <div className="flex items-center gap-2">
            <motion.span
              key={`electric-${monthlyElectricityKWh}`}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-xl font-bold text-success-green"
            >
              Rp {Math.round(monthlyElectricityCost).toLocaleString('id-ID')}
            </motion.span>
            <span className="text-sm text-slate-500">({monthlyElectricityKWh.toFixed(1)} kWh)</span>
          </div>
        </div>
        <div className="relative h-10 md:h-12 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            style={{ width: electricWidthPercent }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-success-green to-emerald-400 rounded-full shadow-md"
          />
        </div>
      </div>
    </div>
  )
}

interface CombinedSavingsSectionProps {
  config?: any
}

export default function CombinedSavingsSection({ config }: CombinedSavingsSectionProps) {
  const { openPreChat, registerBrowseContext } = useWhatsAppPreChat()
  const reveal = useSectionRevealMotion()
  const mainModels = MODEL_SPECS.filter((m) => !m.id.includes('-extended'))
  
  // Calculator states
  const [usagePreset, setUsagePreset] = useState('ojol')
  const [distance, setDistance] = useState(1000)
  const [selectedFuel, setSelectedFuel] = useState('pertalite')
  const [selectedModel, setSelectedModel] = useState('edpower')
  const [selectedVariant, setSelectedVariant] = useState<'regular' | 'extended'>('regular')
  const [showSuperCharge, setShowSuperCharge] = useState(false)
  
  // Savings Stories states
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'kalkulator' | 'cerita'>('kalkulator')

  // Handle preset change
  useEffect(() => {
    const preset = USAGE_PRESETS.find((p) => p.id === usagePreset)
    if (preset && preset.distance > 0) {
      setDistance(preset.distance)
    }
  }, [usagePreset])

  // Show SuperCharge after results are calculated
  useEffect(() => {
    if (distance > 0 && selectedModel) {
      const timer = setTimeout(() => {
        setShowSuperCharge(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [distance, selectedModel])

  const fuelOptions = {
    pertalite: { name: 'Pertalite', price: 10000 },
    pertamax: { name: 'Pertamax', price: 13000 },
  }

  const actualModelId = selectedVariant === 'extended' && MODEL_SPECS.find((m) => m.id === selectedModel)?.hasExtended
    ? MODEL_SPECS.find((m) => m.id === selectedModel)?.extendedId || selectedModel
    : selectedModel

  // Helper function to get range based on model and variant
  const getModelRange = (modelId: string, variant: 'regular' | 'extended'): string => {
    if (variant === 'extended') {
      const mainModel = MODEL_SPECS.find(m => m.id === modelId)
      if (mainModel?.hasExtended) {
        const extendedModel = MODEL_SPECS.find(m => m.id === mainModel.extendedId)
        return extendedModel?.range || MODEL_SPECS.find(m => m.id === modelId)?.range || '0 km'
      }
    }
    return MODEL_SPECS.find(m => m.id === modelId)?.range || '0 km'
  }

  const electricEfficiency = MODEL_EFFICIENCY[actualModelId] || MODEL_EFFICIENCY['edpower']

  const monthlyFuelLiters = distance / FUEL_KM_PER_LITER
  const monthlyFuelCost = monthlyFuelLiters * fuelOptions[selectedFuel as keyof typeof fuelOptions].price

  const monthlyElectricityKWh = distance / electricEfficiency
  const monthlyElectricityCost = monthlyElectricityKWh * ELECTRICITY_IDR_PER_KWH

  const monthlySavings = monthlyFuelCost - monthlyElectricityCost
  const yearlySavings = monthlySavings * 12
  const savingsPercentage = Math.round((monthlySavings / monthlyFuelCost) * 100)

  const selectedModelData = MODEL_SPECS.find((m) => m.id === actualModelId) || MODEL_SPECS[0]
  const currentMainModel = MODEL_SPECS.find((m) => m.id === selectedModel) || MODEL_SPECS[0]

  useEffect(() => {
    registerBrowseContext({
      section: 'hitung-hemat',
      modelId: actualModelId,
      modelName: selectedModelData.name,
    })
  }, [actualModelId, selectedModelData.name, registerBrowseContext])

  // Total Hemat calculation
  const SAVINGS_YEARS = 5
  const totalSavings = Math.round(yearlySavings * SAVINGS_YEARS)

  const activeStory = STORIES[activeStoryIndex]

  const nextStory = () => {
    setActiveStoryIndex((prev) => (prev + 1) % STORIES.length)
  }

  const prevStory = () => {
    setActiveStoryIndex((prev) => (prev - 1 + STORIES.length) % STORIES.length)
  }

  return (
    <motion.section {...reveal} id="combined-savings" className="py-12 md:py-20 bg-slate-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="inline-block px-4 py-2 bg-success-green/10 text-success-green rounded-full text-sm font-semibold mb-4">
            Kalkulator Hemat
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-success-green">Hemat Berapa</span>{' '}
            <span className="text-slate-700">Per Bulan?</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Hitung sendiri berapa penghematan Anda dengan beralih ke motor listrik
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <motion.div 
            className="inline-flex bg-white rounded-2xl p-1.5 shadow-lg border-2 border-slate-100 gap-1"
            initial={false}
          animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              onClick={() => setActiveTab('kalkulator')}
              whileTap={{ scale: 0.95 }}
              animate={activeTab !== 'kalkulator' ? {
                scale: [1, 1.02, 1],
                boxShadow: [
                  '0 0 0 0 rgba(59, 130, 246, 0)',
                  '0 0 0 4px rgba(59, 130, 246, 0.15)',
                  '0 0 0 0 rgba(59, 130, 246, 0)'
                ]
              } : {}}
              transition={activeTab !== 'kalkulator' ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : { type: "spring", stiffness: 400, damping: 17 }}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all text-sm md:text-base cursor-pointer ${
                activeTab === 'kalkulator'
                  ? 'bg-electric-blue text-white shadow-md'
                  : 'text-slate-700 bg-slate-50 border-2 border-slate-200 hover:border-electric-blue hover:bg-slate-100'
              }`}
            >
              <FiPercent className="text-lg" />
              <span>Kalkulator</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('cerita')}
              whileTap={{ scale: 0.95 }}
              animate={activeTab !== 'cerita' ? {
                scale: [1, 1.02, 1],
                boxShadow: [
                  '0 0 0 0 rgba(34, 197, 94, 0)',
                  '0 0 0 4px rgba(34, 197, 94, 0.15)',
                  '0 0 0 0 rgba(34, 197, 94, 0)'
                ]
              } : {}}
              transition={activeTab !== 'cerita' ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : { type: "spring", stiffness: 400, damping: 17 }}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all text-sm md:text-base cursor-pointer ${
                activeTab === 'cerita'
                  ? 'bg-success-green text-white shadow-md'
                  : 'text-slate-700 bg-slate-50 border-2 border-slate-200 hover:border-success-green hover:bg-slate-100'
              }`}
            >
              <FiStar className="text-lg" />
              <span className="hidden sm:inline">Cerita Pengguna</span>
              <span className="sm:hidden">Cerita</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Calculator Card - shown when kalkulator tab active */}
        <div className={activeTab !== 'kalkulator' ? 'hidden' : ''}>
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left: Inputs */}
            <div className="p-4 sm:p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-100">
              {/* Usage Presets */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-slate-800 mb-3">
                  Saya adalah...
                </label>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {USAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setUsagePreset(preset.id)}
                      className={`p-3 md:p-4 rounded-xl border-2 transition-all text-center ${
                        usagePreset === preset.id
                          ? 'border-electric-blue bg-electric-blue/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <preset.icon className={`text-xl md:text-2xl mx-auto mb-1 ${
                        usagePreset === preset.id ? 'text-electric-blue' : 'text-slate-400'
                      }`} />
                      <div className={`text-xs md:text-sm font-semibold ${
                        usagePreset === preset.id ? 'text-electric-blue' : 'text-slate-700'
                      }`}>
                        {preset.label}
                      </div>
                      <div className="text-xs text-slate-500 hidden md:block">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 gap-2">
                  <label htmlFor="distance-slider" className="text-base font-semibold text-slate-700 flex-shrink-0">
                    Jarak per bulan
                  </label>
                  <span className="text-xl sm:text-2xl font-bold text-electric-blue flex-shrink-0">
                    {distance.toLocaleString('id-ID')} km
                  </span>
                </div>
                <input
                  id="distance-slider"
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={distance}
                  onChange={(e) => {
                    setDistance(Number(e.target.value))
                    setUsagePreset('custom')
                  }}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>100 km</span>
                  <span>2000 km</span>
                </div>
              </div>

              {/* Model Selection */}
              <div className="mb-6">
                <label className="block text-base font-semibold text-slate-700 mb-3">
                  Model Wedison
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {mainModels.map((model) => {
                    const imageMap: Record<string, string> = {
                      'edpower': '/images/models/edpower.png',
                      'athena': '/images/models/athena.png',
                      'victory': '/images/models/victory.png',
                      'bees': '/images/models/bees.png',
                    }
                    const imagePath = imageMap[model.id] || '/images/product/edpower.png'
                    
                    return (
                      <motion.button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id)
                          setSelectedVariant('regular')
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                          selectedModel === model.id
                            ? 'border-success-green shadow-lg shadow-success-green/20'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        {/* Background Image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{ 
                            backgroundImage: `url(${imagePath})`,
                            backgroundSize: '120%',
                            backgroundPosition: 'center 30%',
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 ${
                          selectedModel === model.id
                            ? 'bg-gradient-to-t from-success-green/95 via-success-green/60 to-success-green/20'
                            : 'bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent'
                        }`} />
                        
                        {/* Content */}
                        <div className="relative z-10 p-4 pt-16 md:pt-20 text-left">
                          <div className={`text-lg font-bold mb-0.5 ${
                            selectedModel === model.id ? 'text-white' : 'text-white'
                          }`} translate="no">
                            {model.name}
                          </div>
                          <div className={`text-sm font-medium flex items-center gap-1 ${
                            selectedModel === model.id ? 'text-white/90' : 'text-slate-200'
                          }`}>
                            <FiBattery className="text-xs" />
                            {getModelRange(model.id, selectedVariant)}
                          </div>
                          
                          {/* Selected Indicator */}
                          {selectedModel === model.id && (
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
                
                {/* Variant toggle */}
                {currentMainModel.hasExtended && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setSelectedVariant('regular')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedVariant === 'regular'
                          ? 'bg-electric-blue text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Regular
                    </button>
                    <button
                      onClick={() => setSelectedVariant('extended')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedVariant === 'extended'
                          ? 'bg-electric-blue text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Extended
                    </button>
                  </div>
                )}
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-base font-semibold text-slate-700 mb-3">
                  Tipe BBM Anda
                </label>
                <div className="flex gap-2">
                  {Object.entries(fuelOptions).map(([key, option]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFuel(key)}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                        selectedFuel === key
                          ? 'border-red-400 bg-red-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`font-semibold ${
                        selectedFuel === key ? 'text-red-600' : 'text-slate-700'
                      }`}>
                        {option.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        Rp {option.price.toLocaleString('id-ID')}/L
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white">
              {/* Visual Comparison */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Perbandingan Biaya Bulanan
                </h3>
                <AnimatedBarChart
                  monthlyFuelCost={monthlyFuelCost}
                  monthlyElectricityCost={monthlyElectricityCost}
                  monthlyFuelLiters={monthlyFuelLiters}
                  monthlyElectricityKWh={monthlyElectricityKWh}
                  selectedModelData={selectedModelData}
                />
              </div>

              {/* Savings Highlight */}
              <div className="bg-gradient-to-br from-success-green to-emerald-600 rounded-2xl p-6 text-white text-center mb-6">
                <p className="text-white/80 text-sm mb-1">Anda hemat</p>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  Rp {Math.round(monthlySavings).toLocaleString('id-ID')}
                </div>
                <p className="text-white/80">
                  per bulan ({savingsPercentage}% lebih hemat)
                </p>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-100 rounded-xl p-4 text-center">
                  <p className="text-slate-600 text-sm mb-1">Hemat per Tahun</p>
                  <p className="text-xl font-bold text-success-green">
                    Rp {Math.round(yearlySavings).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="bg-slate-100 rounded-xl p-4 text-center">
                  <p className="text-slate-600 text-sm mb-1">Total Hemat 5 Tahun</p>
                  <p className="text-xl font-bold text-electric-blue">
                    Rp {totalSavings.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* CTA to Financing */}
              <div className="space-y-3">
                <a
                  href="#financing"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('financing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-electric-blue text-white font-bold rounded-full hover:bg-electric-blue-dark transition-all hover:scale-105 shadow-lg"
                >
                  <FiDollarSign className="text-xl" />
                  <span>Lihat Harga & Cara Pembayaran</span>
                </a>
                <button
                  type="button"
                  onClick={() => openPreChat({ kind: 'messageKey', messageKey: 'general' })}
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white border-2 border-success-green text-success-green font-bold rounded-full hover:bg-success-green/5 transition-all"
                >
                  <BsWhatsapp className="text-xl" />
                  <span>{WHATSAPP_CTA.savings}</span>
                </button>
              </div>
            </div>
          </div>

          {/* SuperCharge Integration - Compact Version */}
          <AnimatePresence>
            {showSuperCharge && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="border-t border-slate-200 overflow-hidden"
              >
                <div className="p-6 md:p-8 bg-gradient-to-br from-electric-blue/5 to-wedison-mint">
                  <div className="flex items-center justify-between mb-6 gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-electric-blue rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiZap className="text-white text-xl" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xl font-bold text-slate-800">⚡ SuperCharge Technology</h4>
                        <p className="text-sm text-slate-600">12x lebih cepat dari motor listrik lain</p>
                      </div>
                    </div>
                    <div className="hidden md:block bg-gradient-to-r from-electric-blue to-secondary-teal rounded-full px-6 py-2 text-white font-bold">
                      12x Lebih Cepat
                    </div>
                  </div>

                  {/* Compact Comparison */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Bar Chart Comparison */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-success-green to-emerald-400 flex-shrink-0" />
                            <span className="text-sm font-semibold text-slate-700 truncate">Wedison SuperCharge</span>
                          </div>
                          <span className="text-base sm:text-lg font-bold text-success-green flex-shrink-0">15 menit</span>
                        </div>
                        <div className="relative h-10 bg-slate-100 rounded-xl overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-success-green to-emerald-400 rounded-xl flex items-center justify-end pr-3"
                            initial={{ width: 0 }}
                            animate={{ width: '8.3%' }}
                            transition={{ duration: 1, delay: 0.3 }}
                          >
                            <FiZap className="text-white text-sm" />
                          </motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex-shrink-0" />
                            <span className="text-sm font-semibold text-slate-700 truncate">Motor Listrik Lain</span>
                          </div>
                          <span className="text-base sm:text-lg font-bold text-red-500 flex-shrink-0">180 menit</span>
                        </div>
                        <div className="relative h-10 bg-slate-100 rounded-xl overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-400 to-red-500 rounded-xl"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          />
                          <div className="absolute inset-0 flex items-center justify-end pr-3">
                            <span className="text-xs text-white">⏳ 3 jam</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Insight */}
                    <div className="flex flex-col justify-center">
                      <div className="bg-white rounded-2xl p-5 border border-electric-blue/20">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-electric-blue rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">⏱️</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-electric-blue mb-1">Hemat Waktu 165 Menit!</p>
                            <p className="text-xs text-slate-600">
                              Waktu yang bisa dipakai untuk istirahat, makan, atau ngobrol dengan penumpang
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        </div>

        {/* Cerita Pengguna Tab - shown when cerita tab active */}
        <div className={activeTab !== 'cerita' ? 'hidden' : ''}>
          {/* Story Card */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden">
                  <div className="grid lg:grid-cols-2">
                    {/* Left: Profile & Quote - Compact */}
                    <div className="p-4 md:p-6 bg-gradient-to-br from-slate-50 to-white">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeStory.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Profile - Compact */}
                          <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                          {!imageError[activeStory.id] ? (
                            <img
                              src={activeStory.image}
                              alt={activeStory.name}
                              className="w-full h-full object-cover"
                              onError={() => setImageError({ ...imageError, [activeStory.id]: true })}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-electric-blue text-white text-2xl font-bold">
                              {activeStory.name.charAt(0)}
                            </div>
                          )}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-slate-800" translate="no">{activeStory.name}</h4>
                              <p className="text-electric-blue font-medium">{activeStory.role}</p>
                              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <FiMapPin className="text-xs" />
                                <span translate="no">{activeStory.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quote - Compact */}
                          <blockquote className="text-base md:text-lg text-slate-700 mb-4 relative">
                            <span className="absolute -top-3 -left-2 text-5xl text-electric-blue/20 font-serif">"</span>
                            <p className="relative z-10 italic">{activeStory.quote}</p>
                          </blockquote>

                          {/* Rating & Model - Compact */}
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                              {[...Array(activeStory.rating)].map((_, i) => (
                                <FiStar key={i} className="text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full" translate="no">
                              {activeStory.model}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-slate-500">
                              <FiCalendar className="text-xs" />
                              Sejak {activeStory.usageSince}
                            </span>
                          </div>

                          {/* Navigation */}
                          <div className="flex items-center gap-4">
                            <button
                              onClick={prevStory}
                              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                              aria-label="Previous story"
                            >
                              <FiChevronLeft className="text-xl text-slate-600" />
                            </button>
                            <div className="flex gap-2">
                              {STORIES.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setActiveStoryIndex(index)}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    index === activeStoryIndex
                                      ? 'w-6 bg-electric-blue'
                                      : 'bg-slate-300 hover:bg-slate-400'
                                  }`}
                                  aria-label={`Go to story ${index + 1}`}
                                />
                              ))}
                            </div>
                            <button
                              onClick={nextStory}
                              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                              aria-label="Next story"
                            >
                              <FiChevronRight className="text-xl text-slate-600" />
                            </button>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Right: Savings Breakdown - Compact */}
                    <div className="p-4 md:p-6 bg-gradient-to-br from-success-green to-emerald-600 text-white">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeStory.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Savings Highlight - Compact */}
                          <div className="text-center mb-6">
                            <p className="text-white/80 text-sm mb-1">Total Hemat per Bulan</p>
                            <div className="text-4xl md:text-5xl font-bold mb-1">
                              {activeStory.savings.monthly}
                            </div>
                            <p className="text-white/80 text-sm">
                              atau <span className="font-semibold">{activeStory.savings.yearly}/tahun</span>
                            </p>
                          </div>

                          {/* Before/After - Compact */}
                          <div className="space-y-3 mb-6">
                            <div className="bg-white/10 rounded-xl p-4">
                              <div className="text-sm text-white/70 mb-1">Sebelum (Motor BBM)</div>
                              <div className="text-xl font-bold text-red-200">{activeStory.beforeAfter.before}</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                              <div className="text-sm text-white/70 mb-1">Sesudah (Wedison)</div>
                              <div className="text-xl font-bold text-green-200">{activeStory.beforeAfter.after}</div>
                            </div>
                          </div>

                          {/* Percentage Badge - Compact */}
                          <div className="text-center mb-6">
                            <span className="inline-block px-5 py-2 bg-white text-success-green text-xl font-bold rounded-full">
                              Hemat {activeStory.savings.percentage}
                            </span>
                          </div>

                          {/* CTA - Compact */}
                          <button
                            type="button"
                            onClick={() => openPreChat({ kind: 'messageKey', messageKey: 'general' })}
                            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-white text-success-green font-bold rounded-full hover:bg-slate-50 transition-colors text-sm"
                          >
                            <BsWhatsapp className="text-lg" />
                            <span>{WHATSAPP_CTA.savings}</span>
                          </button>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
          </div>
        </div>

      </div>
    </motion.section>
  )
}