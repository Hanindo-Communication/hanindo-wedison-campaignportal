/**
 * Route-trip savings for promo landing. Core BBM vs listrik mengikuti rumus yang sama dengan
 * CombinedSavingsSection (lib/combinedSavingsFormulas). Jarak tetap ilustratif (bukan peta).
 */

import { DEFAULT_PERTALITE_IDR_PER_LITER, tripOperationalCostIdr } from '@/lib/combinedSavingsFormulas'

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
}

function hashString(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/**
 * Deterministic pseudo-distance (km) from pickup + dropoff strings.
 * Range ~2–25 km for demo.
 */
export function pseudoDistanceKm(pickup: string, dropoff: string): number {
  const combined = `${pickup.trim().toLowerCase()}|${dropoff.trim().toLowerCase()}`
  const h = hashString(combined)
  const scaled = 200 + (h % 2300)
  return scaled / 100
}

/** Default: sama dengan state awal kalkulator “Hitung Hemat” (EdPower + Pertalite). */
const DEFAULT_ROUTE_MODEL_ID = 'edpower'

export function estimateRouteSavings(pickup: string, dropoff: string): RouteEstimateResult {
  const distanceKm = pseudoDistanceKm(pickup, dropoff)

  const { baselineBbmIdr, electricCostIdr, savingsIdr } = tripOperationalCostIdr(distanceKm, {
    modelId: DEFAULT_ROUTE_MODEL_ID,
    fuelPriceIdrPerLiter: DEFAULT_PERTALITE_IDR_PER_LITER,
  })

  const h = hashString(`${pickup}|${dropoff}|tier`)
  const promoDiscountPercent = 10 + (h % 8) // 10–17%
  const promoElectricIdr = Math.round(electricCostIdr * (1 - promoDiscountPercent / 100))
  const promoTierLabel =
    savingsIdr > 45_000
      ? 'Tier promo April: hemat tambahan untuk rute panjang'
      : 'Tier promo April: hemat harian'

  return {
    distanceKm,
    baselineBbmIdr,
    electricCostIdr,
    savingsIdr,
    promoElectricIdr,
    promoTierLabel,
    promoDiscountPercent,
    assumptionModelId: DEFAULT_ROUTE_MODEL_ID,
  }
}
