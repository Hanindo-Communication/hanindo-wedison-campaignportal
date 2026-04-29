/**
 * Route-trip savings for promo landing. BBM vs listrik = `tripOperationalCostIdr`
 * (sama CombinedSavingsSection / “Hitung Hemat”, lib/combinedSavingsFormulas).
 *
 * Jarak = ilustratif (bukan GPS): pasangan kota umum memakai tabel perkiraan;
 * lainnya memakai heuristik agar tidak lagi ~2–25 km (terlalu murah vs rute nyata).
 */

import {
  DEFAULT_PERTALITE_IDR_PER_LITER,
  ELECTRICITY_IDR_PER_KWH,
  FUEL_KM_PER_LITER,
  MODEL_EFFICIENCY,
  tripOperationalCostIdr,
} from '@/lib/combinedSavingsFormulas'

export interface RouteEstimateBreakdown {
  /** Sumber: `FUEL_KM_PER_LITER` — sama kalkulator utama */
  fuelKmPerLiter: number
  fuelPriceIdrPerLiter: number
  fuelLiters: number
  /** Sumber: `ELECTRICITY_IDR_PER_KWH` — tarif rumah R1 acuan */
  electricityIdrPerKwh: number
  /** km/kWh untuk model asumsi (EdPower default) */
  kmPerKwhElectric: number
  electricityKWh: number
  modelId: string
}

export interface RouteEstimateResult {
  distanceKm: number
  baselineBbmIdr: number
  electricCostIdr: number
  savingsIdr: number
  /** Promo: discounted “energy” line after tier */
  promoElectricIdr: number
  promoTierLabel: string
  promoDiscountPercent: number
  /** Asumsi model listrik (sama dengan default kalkulator utama) */
  assumptionModelId: string
  breakdown: RouteEstimateBreakdown
}

function hashString(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function normRouteLoc(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

const JAKARTA_KEYS = new Set([
  'jakarta barat',
  'jakarta pusat',
  'jakarta selatan',
  'jakarta timur',
  'jakarta utara',
])

/** Jabodetabek + sekitar (label sama suggestion combobox). */
const JABO_KEYS = new Set([
  ...JAKARTA_KEYS,
  'bekasi',
  'bogor',
  'depok',
  'tangerang',
  'tangerang selatan',
  'cikarang',
  'cibubur',
  'ciledug',
  'serpong',
  'karawang',
  'purwakarta',
])

const BANDUNG_SIDE = new Set(['bandung', 'cimahi'])

function isJakarta(x: string): boolean {
  return JAKARTA_KEYS.has(x)
}

function isJabo(x: string): boolean {
  return JABO_KEYS.has(x)
}

function isBandungSide(x: string): boolean {
  return BANDUNG_SIDE.has(x)
}

/**
 * Pasangan kota → jarak ilustratif (km), kunci kanon `a|b` (a < b leksikografis).
 * Angka perkiraan jalan tol/arteri; bukan routing hidup.
 */
const KNOWN_CANONICAL_KM: Record<string, number> = (() => {
  const rows: [string, string, number][] = [
    ['bandung', 'bekasi', 150],
    ['bandung', 'bogor', 128],
    ['bandung', 'cirebon', 118],
    ['bandung', 'depok', 142],
    ['bandung', 'jakarta barat', 155],
    ['bandung', 'jakarta pusat', 152],
    ['bandung', 'jakarta selatan', 158],
    ['bandung', 'jakarta timur', 151],
    ['bandung', 'jakarta utara', 172],
    ['bandung', 'karawang', 128],
    ['bandung', 'purwakarta', 96],
    ['bandung', 'semarang', 352],
    ['bandung', 'surabaya', 580],
    ['bandung', 'yogyakarta', 405],
    ['bandung', 'cimahi', 14],
    ['bekasi', 'bogor', 52],
    ['bekasi', 'cikarang', 26],
    ['bekasi', 'depok', 48],
    ['bekasi', 'jakarta barat', 34],
    ['bekasi', 'jakarta pusat', 24],
    ['bekasi', 'jakarta selatan', 32],
    ['bekasi', 'tangerang', 72],
    ['bogor', 'depok', 44],
    ['bogor', 'jakarta selatan', 58],
    ['bogor', 'jakarta barat', 62],
    ['bogor', 'tangerang selatan', 78],
    ['depok', 'jakarta timur', 32],
    ['depok', 'jakarta pusat', 38],
    ['jakarta barat', 'jakarta selatan', 24],
    ['jakarta barat', 'jakarta timur', 30],
    ['jakarta pusat', 'jakarta utara', 18],
    ['jakarta pusat', 'jakarta selatan', 22],
    ['jakarta selatan', 'jakarta utara', 28],
    ['serpong', 'jakarta barat', 36],
    ['serpong', 'jakarta pusat', 40],
    ['tangerang', 'jakarta barat', 32],
    ['tangerang', 'jakarta pusat', 28],
    ['cirebon', 'semarang', 235],
    ['semarang', 'surabaya', 318],
    ['semarang', 'yogyakarta', 115],
    ['surabaya', 'yogyakarta', 325],
  ]
  const m: Record<string, number> = {}
  for (const [x, y, km] of rows) {
    const a = normRouteLoc(x)
    const b = normRouteLoc(y)
    const key = a < b ? `${a}|${b}` : `${b}|${a}`
    m[key] = km
  }
  return m
})()

/**
 * Jarak ilustratif (km) untuk UI promo — lebih selaras rute harian / antarkota
 * dibanding hash 2–25 km lama.
 */
export function illustrativeDistanceKm(pickup: string, dropoff: string): number {
  const a = normRouteLoc(pickup)
  const b = normRouteLoc(dropoff)
  if (!a || !b) return 48
  if (a === b) return 14

  const canonical = a < b ? `${a}|${b}` : `${b}|${a}`
  const known = KNOWN_CANONICAL_KM[canonical]
  if (known != null) return known

  const h = hashString(canonical)

  if (isJakarta(a) && isJakarta(b)) {
    return 16 + (h % 18)
  }

  if (isJabo(a) && isJabo(b) && !(isJakarta(a) && isJakarta(b))) {
    return 38 + (h % 48)
  }

  if ((isBandungSide(a) && isJabo(b)) || (isBandungSide(b) && isJabo(a))) {
    return 145 + (h % 28)
  }

  if (
    (a.includes('semarang') && b.includes('surabaya')) ||
    (b.includes('semarang') && a.includes('surabaya'))
  ) {
    return 310 + (h % 35)
  }

  /* Antarkota / rute lain: lebih panjang dari rentang lama agar biaya tidak “kekecilan”. */
  return 42 + (h % 108)
}

/** @deprecated Pakai `illustrativeDistanceKm` — perilaku lama 2–25 km tidak dipakai lagi. */
export function pseudoDistanceKm(pickup: string, dropoff: string): number {
  return illustrativeDistanceKm(pickup, dropoff)
}

const DEFAULT_ROUTE_MODEL_ID = 'edpower'

export function estimateRouteSavings(pickup: string, dropoff: string): RouteEstimateResult {
  const distanceKm = illustrativeDistanceKm(pickup, dropoff)

  const trip = tripOperationalCostIdr(distanceKm, {
    modelId: DEFAULT_ROUTE_MODEL_ID,
    fuelPriceIdrPerLiter: DEFAULT_PERTALITE_IDR_PER_LITER,
  })

  const { baselineBbmIdr, electricCostIdr, savingsIdr } = trip

  const h = hashString(`${pickup}|${dropoff}|tier`)
  const promoDiscountPercent = 10 + (h % 8)
  const promoElectricIdr = Math.round(electricCostIdr * (1 - promoDiscountPercent / 100))
  const promoTierLabel =
    savingsIdr > 120_000
      ? 'Tier promo Mei: hemat tambahan untuk rute panjang'
      : 'Tier promo Mei: hemat harian'

  const kmPerKwhElectric =
    MODEL_EFFICIENCY[DEFAULT_ROUTE_MODEL_ID] ?? MODEL_EFFICIENCY.edpower

  const breakdown: RouteEstimateBreakdown = {
    fuelKmPerLiter: FUEL_KM_PER_LITER,
    fuelPriceIdrPerLiter: DEFAULT_PERTALITE_IDR_PER_LITER,
    fuelLiters: trip.fuelLiters,
    electricityIdrPerKwh: ELECTRICITY_IDR_PER_KWH,
    kmPerKwhElectric,
    electricityKWh: trip.electricityKWh,
    modelId: DEFAULT_ROUTE_MODEL_ID,
  }

  return {
    distanceKm,
    baselineBbmIdr,
    electricCostIdr,
    savingsIdr,
    promoElectricIdr,
    promoTierLabel,
    promoDiscountPercent,
    assumptionModelId: DEFAULT_ROUTE_MODEL_ID,
    breakdown,
  }
}
