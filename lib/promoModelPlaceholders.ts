import { type ModelSpec, MODEL_SPECS } from '@/utils/modelSpecs'

export interface PromoModelPlaceholder {
  id: string
  name: string
  imageSrc: string
  detailUrl: string
  /** Short labels for modal chips — sourced from the same specs as the main landing */
  highlights: string[]
}

/** Basis URL aset pemasaran resmi (webp hero per halaman produk wedison.co). */
const WEDISON_ASSETS = 'https://wedison.co'

/**
 * Gambar hero studio resmi — selaras foto produk di situs (Bees silver, Athena olive, Victory hitam matte, EdPower navy).
 * Untuk kampanye promo 052026 pakai ini; gantikan dengan file lokal di public/ bila ada brand kit baru.
 */
const PROMO_MODEL_HERO_SRC: Record<string, string> = {
  bees: `${WEDISON_ASSETS}/bees-product-hero.webp`,
  athena: `${WEDISON_ASSETS}/athena-product-hero.webp`,
  victory: `${WEDISON_ASSETS}/victory-product-hero.webp`,
  edpower: `${WEDISON_ASSETS}/edpower-product-hero.webp`,
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
