'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiBattery, FiZap, FiTruck, FiUser, FiCheck, FiClock } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { MODEL_SPECS } from '@/utils/modelSpecs'
import { WHATSAPP_LINKS } from '@/utils/whatsappLinks'
import { WHATSAPP_CTA } from '@/utils/constants'
import { trackWhatsAppClick } from '@/utils/analytics'

// Charging Time Comparison Data - Line Chart Data Points
const CHARGING_DATA = {
  supercharge: [
    { time: 0, battery: 0 },
    { time: 15, battery: 80 },
    { time: 30, battery: 100 },
  ],
  regular: [
    { time: 0, battery: 0 },
    { time: 180, battery: 80 },
    { time: 240, battery: 100 },
  ],
}

const MAX_TIME = 240 // minutes
const MAX_BATTERY = 100 // percentage

// Model efficiency in km/kWh
const calculateEfficiency = (rangeKm: number, batteryAh: number, voltage: number = 48): number => {
  const batteryKWh = (batteryAh * voltage) / 1000
  return rangeKm / batteryKWh
}

const MODEL_EFFICIENCY: Record<string, number> = {
  edpower: calculateEfficiency(135, 70, 48),
  athena: calculateEfficiency(100, 45, 48),
  'athena-extended': calculateEfficiency(130, 60, 48),
  victory: calculateEfficiency(100, 45, 48),
  'victory-extended': calculateEfficiency(130, 60, 48),
  bees: calculateEfficiency(80, 30, 48),
}

// Usage presets
const USAGE_PRESETS = [
  { id: 'ojol', label: 'Driver Ojol', distance: 1000, icon: FiTruck, description: '1000 km/bulan' },
  { id: 'commuter', label: 'Daily Commuter', distance: 500, icon: FiUser, description: '500 km/bulan' },
  { id: 'custom', label: 'Custom', distance: 0, icon: FiZap, description: 'Atur sendiri' },
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
          <span className="text-base font-semibold text-slate-700">Wedison {selectedModelData.name}</span>
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

export default function ComparisonSection() {
  const mainModels = MODEL_SPECS.filter((m) => !m.id.includes('-extended'))
  
  const [usagePreset, setUsagePreset] = useState('ojol')
  const [distance, setDistance] = useState(1000)
  const [selectedFuel, setSelectedFuel] = useState('pertalite')
  const [selectedModel, setSelectedModel] = useState('edpower')
  const [selectedVariant, setSelectedVariant] = useState<'regular' | 'extended'>('regular')

  // Handle preset change
  useEffect(() => {
    const preset = USAGE_PRESETS.find((p) => p.id === usagePreset)
    if (preset && preset.distance > 0) {
      setDistance(preset.distance)
    }
  }, [usagePreset])

  const fuelOptions = {
    pertalite: { name: 'Pertalite', price: 10000 },
    pertamax: { name: 'Pertamax', price: 13000 },
  }

  // Tarif listrik PLN R1 1.300VA+ (paling umum di Indonesia)
  // Sumber: Tarif listrik PLN 2024-2025 untuk rumah tangga
  // R1 1.300VA: Rp 1.444,70/kWh | R1 2.200VA: Rp 1.444,70/kWh
  // Rata-rata tarif rumah tangga: Rp 1.445/kWh (dibulatkan)
  const electricityPrice = 1445 // Rp per kWh (tarif R1 1.300VA+ yang paling umum)

  const actualModelId = selectedVariant === 'extended' && MODEL_SPECS.find((m) => m.id === selectedModel)?.hasExtended
    ? MODEL_SPECS.find((m) => m.id === selectedModel)?.extendedId || selectedModel
    : selectedModel

  const fuelEfficiency = 40
  const electricEfficiency = MODEL_EFFICIENCY[actualModelId] || MODEL_EFFICIENCY['edpower']

  const monthlyFuelLiters = distance / fuelEfficiency
  const monthlyFuelCost = monthlyFuelLiters * fuelOptions[selectedFuel as keyof typeof fuelOptions].price

  const monthlyElectricityKWh = distance / electricEfficiency
  const monthlyElectricityCost = monthlyElectricityKWh * electricityPrice

  const monthlySavings = monthlyFuelCost - monthlyElectricityCost
  const yearlySavings = monthlySavings * 12
  const savingsPercentage = Math.round((monthlySavings / monthlyFuelCost) * 100)

  const selectedModelData = MODEL_SPECS.find((m) => m.id === actualModelId) || MODEL_SPECS[0]
  const currentMainModel = MODEL_SPECS.find((m) => m.id === selectedModel) || MODEL_SPECS[0]

  // Total Hemat calculation
  const SAVINGS_YEARS = 5
  const totalSavings = Math.round(yearlySavings * SAVINGS_YEARS)

  return (
    <section id="comparison" className="py-12 md:py-20 bg-slate-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left: Inputs */}
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-100">
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
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="distance-slider" className="text-base font-semibold text-slate-700">
                    Jarak per bulan
                  </label>
                  <span className="text-2xl font-bold text-electric-blue">
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
                          }`}>
                            {model.name}
                          </div>
                          <div className={`text-sm font-medium flex items-center gap-1 ${
                            selectedModel === model.id ? 'text-white/90' : 'text-slate-200'
                          }`}>
                            <FiBattery className="text-xs" />
                            {model.range}
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

              {/* CTA */}
              <a
                href={WHATSAPP_LINKS.general}
                onClick={() => trackWhatsAppClick('comparison-calculator')}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-success-green text-white font-bold rounded-full hover:bg-green-600 transition-all hover:scale-105 shadow-lg"
              >
                <BsWhatsapp className="text-xl" />
                <span>{WHATSAPP_CTA.savings}</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* SuperCharge Comparison (Below Calculator) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          {/* Section Header */}
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-electric-blue/10 text-electric-blue rounded-full text-sm font-semibold mb-4">
              ⚡ SuperCharge Technology
            </span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-3">
              <span className="text-electric-blue">12x Lebih Cepat</span> Charging
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Charge 15 menit sambil istirahat makan, motor listrik lain butuh 3 jam menunggu
            </p>
          </div>

          {/* Main Comparison Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Left: Modern Chart */}
              <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-100">
                <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FiClock className="text-electric-blue" />
                  Perbandingan Waktu ke 80%
                </h4>
                
                {/* Modern Bar Chart */}
                <div className="space-y-6">
                  {/* Wedison SuperCharge */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-success-green to-emerald-400" />
                        <span className="text-sm font-semibold text-slate-700">Wedison SuperCharge</span>
                      </div>
                      <span className="text-lg font-bold text-success-green">15 menit</span>
                    </div>
                    <div className="relative h-12 bg-slate-100 rounded-xl overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-success-green to-emerald-400 rounded-xl flex items-center justify-end pr-4"
                        initial={{ width: 0 }}
                        whileInView={{ width: '8.3%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      >
                        <FiZap className="text-white text-lg" />
                      </motion.div>
                      {/* Time markers */}
                      <div className="absolute inset-0 flex items-center justify-end pr-3">
                        <span className="text-xs text-slate-400 bg-slate-100/80 px-1 rounded">⚡ Fast</span>
                      </div>
                    </div>
                  </div>

                  {/* Motor Listrik Lain */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-500" />
                        <span className="text-sm font-semibold text-slate-700">Motor Listrik Lain</span>
                      </div>
                      <span className="text-lg font-bold text-red-500">180 menit</span>
                    </div>
                    <div className="relative h-12 bg-slate-100 rounded-xl overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-400 to-red-500 rounded-xl flex items-center"
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                      />
                      {/* Time markers along the bar */}
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full flex justify-between px-3">
                          <span className="text-xs text-white/80">0</span>
                          <span className="text-xs text-white/80">45m</span>
                          <span className="text-xs text-white/80">90m</span>
                          <span className="text-xs text-white/80">135m</span>
                          <span className="text-xs text-white">180m 🐢</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend & Scale */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>0 menit</span>
                    <div className="flex-1 mx-4 h-1 bg-gradient-to-r from-success-green via-yellow-400 to-red-400 rounded-full" />
                    <span>180 menit</span>
                  </div>
                </div>

                {/* Key Insight */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 }}
                  className="mt-6 bg-gradient-to-br from-electric-blue/10 to-cyan-50 rounded-2xl p-5 border border-electric-blue/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-electric-blue rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">⏱️</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-electric-blue mb-1">Hemat Waktu 165 Menit!</p>
                      <p className="text-sm text-slate-600">
                        Waktu yang bisa dipakai untuk istirahat, makan, atau ngobrol dengan penumpang
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right: Time Visual Comparison */}
              <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white">
                <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FiBattery className="text-electric-blue" />
                  Visualisasi Perbedaan Waktu
                </h4>

                {/* Time Blocks Comparison */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Wedison Time Block */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-success-green to-emerald-500 rounded-2xl p-5 text-white text-center">
                      <div className="text-4xl font-bold mb-1">15</div>
                      <div className="text-sm opacity-90">menit</div>
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <span className="text-xs bg-white/20 px-3 py-1 rounded-full">80% Baterai</span>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <span className="text-sm font-semibold text-success-green">Wedison</span>
                    </div>
                  </motion.div>

                  {/* Other EV Time Block */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl p-5 text-white text-center">
                      <div className="text-4xl font-bold mb-1">180</div>
                      <div className="text-sm opacity-90">menit</div>
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <span className="text-xs bg-white/20 px-3 py-1 rounded-full">80% Baterai</span>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <span className="text-sm font-semibold text-slate-500">Motor Lain</span>
                    </div>
                  </motion.div>
                </div>

                {/* Visual Timeline Comparison */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 mb-6">
                  <p className="text-sm font-semibold text-slate-700 mb-4">Apa yang bisa dilakukan dalam 180 menit?</p>
                  
                  {/* Timeline */}
                  <div className="relative">
                    {/* Wedison Timeline */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-16 text-xs text-right text-slate-500">Wedison</div>
                      <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-success-green rounded-lg flex items-center justify-center"
                          initial={{ width: 0 }}
                          whileInView={{ width: '8.3%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        >
                          <span className="text-xs text-white font-semibold">⚡</span>
                        </motion.div>
                        {/* Activities after charging */}
                        <div className="absolute inset-y-0 flex items-center" style={{ left: '10%' }}>
                          <div className="flex gap-1 text-xs">
                            <span className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">🍜 Makan</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">☕ Ngopi</span>
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">📱 Istirahat</span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🛵 Narik lagi</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Other EV Timeline */}
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-right text-slate-500">Motor Lain</div>
                      <div className="flex-1 h-8 bg-red-100 rounded-lg overflow-hidden relative">
                        <motion.div
                          className="absolute inset-y-0 left-0 right-0 bg-red-400 rounded-lg flex items-center justify-center"
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.7 }}
                        >
                          <span className="text-xs text-white font-medium">⏳ Masih charging... menunggu 3 jam...</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multiplier Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, type: 'spring' }}
                  className="bg-gradient-to-r from-electric-blue to-cyan-500 rounded-2xl p-6 text-white text-center"
                >
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-left">
                      <p className="text-white/80 text-sm">Waktu charging</p>
                      <p className="text-3xl font-bold">12x <span className="text-lg font-normal">lebih cepat</span></p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <FiZap className="text-3xl" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 text-sm text-white/80">
                    Lebih banyak waktu produktif = Lebih banyak penghasilan
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
