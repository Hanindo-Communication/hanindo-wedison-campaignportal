import { type ModelSpec, MODEL_SPECS } from '@/utils/modelSpecs'

export interface PromoModelPlaceholder {
  id: string
  name: string
  imageSrc: string
  detailUrl: string
  /** Short labels for modal chips — sourced from the same specs as the main landing */
  highlights: string[]
}

/** Basis URL fallback bila id tidak ada di map hero lokal. */
const WEDISON_ASSETS = 'https://wedison.co'

/**
 * Hero grid promo ojol — aset lokal (foto produk unduhan, bukan generate).
 * Bees / Victory / EdPower / Athena: salin dari `Downloads/*.webp` ke `public/images/models/`.
 * Athena: `Downloads/athena.webp`.
 */
const PROMO_MODEL_HERO_SRC: Record<string, string> = {
  bees: '/images/models/bees.webp',
  athena: '/images/models/athena.webp',
  victory: '/images/models/victory.webp',
  edpower: '/images/models/edpower.webp',
}

/** Main models only (no extended duplicates for chip row). */
const WEDISON_PRODUCT_BASE = 'https://wedison.co'

/** Curated mini-highlights aligned with modelSpecs / wedison product lines */
function highlightsFromSpec(spec: ModelSpec): string[] {
  const third = spec.superCharge
    ? `SuperCharge ${spec.superCharge}`
    : spec.motor
  return [`Range ${spec.range}`, spec.battery, third, spec.badge]
}

export function getPromoModelPlaceholders(): PromoModelPlaceholder[] {
  const main = MODEL_SPECS.filter((m) => !m.id.includes('extended'))
  return main.map((m) => ({
    id: m.id,
    name: m.name,
    imageSrc: PROMO_MODEL_HERO_SRC[m.id] ?? `${WEDISON_ASSETS}/navbar-product/${m.id}.webp`,
    detailUrl: `${WEDISON_PRODUCT_BASE}/${m.id}/`,
    highlights: highlightsFromSpec(m),
  }))
}
