// WhatsApp Pre-filled Message Templates

import type { AdAttribution } from '@/lib/adSourceFromUrl'

/** Satu baris ringkas: platform + UTM (dipotong agar aman untuk wa.me). */
function compactTrackingLine(attr: AdAttribution): string {
  let s = `src=${attr.platformKey}`
  const utmJoined = [attr.utmCampaign, attr.utmMedium, attr.utmContent].filter(Boolean).join('|')
  if (utmJoined) s += ` utm=${utmJoined}`
  return s.length > 140 ? `${s.slice(0, 137)}…` : s
}

const WHATSAPP_NUMBER = '6282124657804' // Wedison WhatsApp Support

export const getWhatsAppLink = (message: string): string => {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
}

// Message Templates
export const WHATSAPP_MESSAGES = {
  hero: 'Halo! Saya tertarik dengan Wedison EdPower. Saya mau tau lebih detail tentang SuperCharge dan financing options. Bisa?',
  
  testDrive: 'Saya ingin test drive di showroom Pondok Indah. Slot preferensi saya: [Hari/Jam]',
  
  edpower: 'Halo! Saya tertarik dengan model EdPower (Rp 45.9jt). Bisa info detail spesifikasi dan promo yang sedang berlaku?',
  
  athena: 'Halo! Saya tertarik dengan model Athena (Rp 28.7jt). Bisa info detail spesifikasi dan opsi cicilan?',
  
  victory: 'Halo! Saya tertarik dengan model Victory (Rp 28.4jt). Bisa info detail dan promo yang tersedia?',
  
  bees: 'Halo! Saya tertarik dengan model Bees (Rp 15.9jt). Ada student discount? Tolong info lengkapnya.',
  
  financing: 'Halo! Saya mau konsultasi tentang opsi financing dan cicilan 0%. Bisa bantu?',
  
  tradeIn: 'Halo! Saya punya motor lama yang mau di-trade-in. Bisa info prosesnya?',
  
  charging: 'Halo! Saya mau tanya tentang SuperCharge network dan instalasi home charger. Bisa dibantu?',
  
  general: 'Halo! Saya tertarik dengan motor listrik Wedison. Bisa info lengkapnya?',

  promo052026:
    'Halo! Saya tertarik promo Mei Wedison (ojol/rute), mau tanya detail & next step.',
}

export function getAttributionHeaderLines(attr: AdAttribution): string[] {
  return [
    `[REF:${attr.refCode}] Mohon jangan dihapus — tracking internal.`,
    compactTrackingLine(attr),
  ]
}

/** Isi promo Mei (Halo, rute, estimasi, …) tanpa blok attribution. */
export function buildPromo052026UserBodyLines(parts: {
  pickup?: string
  dropoff?: string
  distanceKm?: number
  savingsIdr?: number
  promoTierLabel?: string
  modelName?: string
}): string[] {
  const lines: string[] = []
  lines.push('Halo! Saya tertarik promo Mei Wedison (ojol/rute), mau tanya detail & next step.')
  if (parts.pickup && parts.dropoff) {
    lines.push(`Rute: ${parts.pickup} → ${parts.dropoff}`)
  }
  if (parts.distanceKm != null && parts.savingsIdr != null) {
    lines.push(
      `Estimasi: ~${parts.distanceKm.toFixed(1)} km · hemat vs BBM ~Rp ${parts.savingsIdr.toLocaleString('id-ID')} (ilustrasi)`,
    )
  }
  if (parts.promoTierLabel) lines.push(parts.promoTierLabel)
  if (parts.modelName) lines.push(`Model: ${parts.modelName}`)
  return lines
}

export function prependAttributionToMessage(
  baseMessage: string,
  attr: AdAttribution,
  extraMetaLines: string[] = []
): string {
  const top = [...getAttributionHeaderLines(attr), ...extraMetaLines].filter(Boolean)
  return [...top, '', baseMessage.trim()].join('\n')
}

export function buildWhatsAppLinkWithAttribution(
  baseMessage: string,
  attr: AdAttribution,
  extraMetaLines: string[] = []
): string {
  return getWhatsAppLink(prependAttributionToMessage(baseMessage, attr, extraMetaLines))
}

export type Promo052026MessageParts = {
  /** Prefer `attribution` from landing context */
  adSourceLine?: string
  attribution?: AdAttribution
  pickup?: string
  dropoff?: string
  distanceKm?: number
  savingsIdr?: number
  promoTierLabel?: string
  modelName?: string
}

/** Build WA prefill for /052026/promo — pickup/dropoff/estimate optional after user runs calculator. */
export function buildPromo052026Message(parts: Promo052026MessageParts): string {
  const body = buildPromo052026UserBodyLines(parts).join('\n')
  if (parts.attribution) {
    return [...getAttributionHeaderLines(parts.attribution), '', body].join('\n')
  }
  if (parts.adSourceLine) {
    return [parts.adSourceLine, '', body].join('\n')
  }
  return body
}

export function buildPromo052026WhatsAppLink(parts: Promo052026MessageParts = {}): string {
  return getWhatsAppLink(buildPromo052026Message(parts))
}

// Pre-configured WhatsApp Links
export const WHATSAPP_LINKS = {
  hero: getWhatsAppLink(WHATSAPP_MESSAGES.hero),
  testDrive: getWhatsAppLink(WHATSAPP_MESSAGES.testDrive),
  edpower: getWhatsAppLink(WHATSAPP_MESSAGES.edpower),
  athena: getWhatsAppLink(WHATSAPP_MESSAGES.athena),
  victory: getWhatsAppLink(WHATSAPP_MESSAGES.victory),
  bees: getWhatsAppLink(WHATSAPP_MESSAGES.bees),
  financing: getWhatsAppLink(WHATSAPP_MESSAGES.financing),
  tradeIn: getWhatsAppLink(WHATSAPP_MESSAGES.tradeIn),
  charging: getWhatsAppLink(WHATSAPP_MESSAGES.charging),
  general: getWhatsAppLink(WHATSAPP_MESSAGES.general),

  promo052026: getWhatsAppLink(WHATSAPP_MESSAGES.promo052026),
}
