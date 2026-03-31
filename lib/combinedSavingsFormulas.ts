/**
 * Shared physics for “Hitung Hemat” / CombinedSavingsSection and route-trip estimates.
 * Keep in sync with assumptions documented in CombinedSavingsSection.
 */

/** Motor bensin rata-rata — sama dengan kalkulator landing utama */
export const FUEL_KM_PER_LITER = 40

/** Default: Pertalite (bisa override per trip / UI) */
export const DEFAULT_PERTALITE_IDR_PER_LITER = 10_000

/**
 * Tarif listrik PLN R1 1.300VA+ (paling umum) — Rp/kWh, dibulatkan.
 * Sumber asumsi: CombinedSavingsSection
 */
export const ELECTRICITY_IDR_PER_KWH = 1445

/** km/kWh from range & battery — same formula as CombinedSavingsSection */
export function calculateEfficiency(rangeKm: number, batteryAh: number, voltage: number = 48): number {
  const batteryKWh = (batteryAh * voltage) / 1000
  return rangeKm / batteryKWh
}

/**
 * km/kWh per model — sama dengan kalkulator landing; `bees` mengikuti asumsi `mini`.
 */
export const MODEL_EFFICIENCY: Record<string, number> = {
  edpower: calculateEfficiency(135, 70, 48),
  athena: calculateEfficiency(100, 45, 48),
  'athena-extended': calculateEfficiency(130, 60, 48),
  victory: calculateEfficiency(100, 45, 48),
  'victory-extended': calculateEfficiency(130, 60, 48),
  mini: calculateEfficiency(80, 30, 48),
  bees: calculateEfficiency(80, 30, 48),
}

export interface TripOperationalCostResult {
  baselineBbmIdr: number
  electricCostIdr: number
  savingsIdr: number
  fuelLiters: number
  electricityKWh: number
  kmPerKwh: number
}

/**
 * Biaya operasional ilustratif untuk satu jarak tempuh (km), sama dengan rumus bulanan di landing
 * (BBM = km / 40 × harga/liter; listrik = km / efisiensi × Rp/kWh).
 */
export function tripOperationalCostIdr(
  distanceKm: number,
  options: {
    modelId?: string
    fuelPriceIdrPerLiter?: number
  } = {}
): TripOperationalCostResult {
  const modelId = options.modelId ?? 'edpower'
  const fuelPrice = options.fuelPriceIdrPerLiter ?? DEFAULT_PERTALITE_IDR_PER_LITER
  const kmPerKwh = MODEL_EFFICIENCY[modelId] ?? MODEL_EFFICIENCY.edpower

  const fuelLiters = distanceKm / FUEL_KM_PER_LITER
  const baselineBbmIdr = Math.round(fuelLiters * fuelPrice)

  const electricityKWh = distanceKm / kmPerKwh
  const electricCostIdr = Math.round(electricityKWh * ELECTRICITY_IDR_PER_KWH)

  const savingsIdr = Math.max(0, baselineBbmIdr - electricCostIdr)

  return {
    baselineBbmIdr,
    electricCostIdr,
    savingsIdr,
    fuelLiters,
    electricityKWh,
    kmPerKwh,
  }
}
