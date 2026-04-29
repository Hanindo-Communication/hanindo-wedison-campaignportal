/**
 * Rekomendasi model promo (4 model utama) dari jarak rute ilustratif.
 * Memakai perkiraan jarak tempuh sekali charge di `MODEL_SPECS.range` — beda model, beda kapasitas.
 */

import { MODEL_SPECS } from '@/utils/modelSpecs'

export type PromoMainModelId = 'bees' | 'victory' | 'athena' | 'edpower'

function parseRangeKm(rangeLabel: string): number {
  const m = rangeLabel.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

/** Jarak tempuh sekali charge (km) dari spesifikasi marketing */
export function getModelRangeKmById(modelId: string): number {
  const spec = MODEL_SPECS.find((m) => m.id === modelId)
  return spec ? parseRangeKm(spec.range) : 0
}

/**
 * Pilih satu dari 4 model utama agar konsisten dengan UI (empat pop-up berbeda).
 * Rentang disesuaikan dengan kapasitas: Bees paling ringan → EdPower jarak terjauh.
 */
export function recommendPromoModelIdForDistanceKm(distanceKm: number): PromoMainModelId {
  const d = Math.max(0, distanceKm)
  if (d <= 80) return 'bees'
  if (d <= 98) return 'victory'
  if (d <= 110) return 'athena'
  return 'edpower'
}

/** Apakah jarak rute melebihi perkiraan sekali charge untuk model yang direkomendasikan */
export function distanceExceedsRatedRange(distanceKm: number, modelId: string): boolean {
  const rated = getModelRangeKmById(modelId)
  if (rated <= 0) return false
  return distanceKm > rated
}
