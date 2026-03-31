// WhatsApp Pre-filled Message Templates

import type { AdAttribution } from '@/lib/adSourceFromUrl'

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

  promo042026:
    'Halo! Saya dari landing Promo April Wedison (ojol/rute). Mau tanya promo & langkah berikutnya.',
}

export function getAttributionHeaderLines(attr: AdAttribution): string[] {
  const lines: string[] = []
  lines.push(
    `[REF:${attr.refCode}] Mohon jangan hapus baris ini — tim pakai kode ini untuk bantu lebih cepat.`
  )
  if (attr.sourceLine) lines.push(attr.sourceLine)
  if (attr.platformNote) lines.push(attr.platformNote)
  return lines
}

export function prependAttributionToMessage(baseMessage: string, attr: AdAttribution): string {
  const header = getAttributionHeaderLines(attr)
  return [...header, '', baseMessage.trim()].join('\n')
}

export function buildWhatsAppLinkWithAttribution(
  baseMessage: string,
  attr: AdAttribution
): string {
  return getWhatsAppLink(prependAttributionToMessage(baseMessage, attr))
}

export type Promo042026MessageParts = {
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

/** Build WA prefill for /042026/promo — pickup/dropoff/estimate optional after user runs calculator. */
export function buildPromo042026Message(parts: Promo042026MessageParts): string {
  const lines: string[] = []
  if (parts.attribution) {
    lines.push(...getAttributionHeaderLines(parts.attribution))
    lines.push('')
  } else if (parts.adSourceLine) {
    lines.push(parts.adSourceLine)
  }
  lines.push('Halo! Saya dari landing Promo April Wedison (ojol/rute).')
  if (parts.pickup && parts.dropoff) {
    lines.push(`Rute: ${parts.pickup} → ${parts.dropoff}`)
  }
  if (parts.distanceKm != null && parts.savingsIdr != null) {
    lines.push(`Perkiraan jarak: ~${parts.distanceKm.toFixed(1)} km (ilustrasi)`)
    lines.push(`Perkiraan hemat vs BBM: ~Rp ${parts.savingsIdr.toLocaleString('id-ID')} (ilustrasi)`)
  }
  if (parts.promoTierLabel) lines.push(parts.promoTierLabel)
  if (parts.modelName) lines.push(`Tertarik membahas model: ${parts.modelName}`)
  lines.push('Mau tanya promo & next step. Terima kasih!')
  return lines.join('\n')
}

export function buildPromo042026WhatsAppLink(parts: Promo042026MessageParts = {}): string {
  return getWhatsAppLink(buildPromo042026Message(parts))
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

  promo042026: getWhatsAppLink(WHATSAPP_MESSAGES.promo042026),
}
