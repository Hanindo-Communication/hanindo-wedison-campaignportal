import { type ModelSpec, MODEL_SPECS } from '@/utils/modelSpecs'

export interface PromoModelPlaceholder {
  id: string
  name: string
  imageSrc: string
  detailUrl: string
  /** Short labels for modal chips — sourced from the same specs as the main landing */
  highlights: string[]
}

/** Main models only (no extended duplicates for chip row). Swap files under public/ when brand assets arrive. */
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
    imageSrc: `/images/campaigns/052026/models/${m.id}-placeholder.svg`,
    detailUrl: `${WEDISON_PRODUCT_BASE}`,
    highlights: highlightsFromSpec(m),
  }))
}
