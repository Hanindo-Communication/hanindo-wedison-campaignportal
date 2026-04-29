import type { AdAttribution } from '@/lib/adSourceFromUrl'
import {
  buildPromo052026UserBodyLines,
  buildWhatsAppLinkWithAttribution,
  getAttributionHeaderLines,
  getWhatsAppLink,
  type Promo052026MessageParts,
} from '@/utils/whatsappLinks'

/** Landing: blok REF/src di atas, lalu isi percakapan (tanpa token intent di WA). */
export function buildLandingPrefilterWaUrl(
  conversationBodyWithoutAttribution: string,
  attribution: AdAttribution
): string {
  return buildWhatsAppLinkWithAttribution(conversationBodyWithoutAttribution.trim(), attribution)
}

/**
 * Promo + wizard: REF/src di atas, lalu Halo/rute/estimasi, lalu detail form.
 */
export function buildPromoPrefilterWaUrl(
  parts: Omit<Promo052026MessageParts, 'attribution'> & { attribution: AdAttribution },
  extraSuffix: string
): string {
  const top = getAttributionHeaderLines(parts.attribution).join('\n')
  const mid = buildPromo052026UserBodyLines(parts).join('\n')
  const chunks = [top, mid]
  if (extraSuffix.trim()) chunks.push(extraSuffix.trim())
  return getWhatsAppLink(chunks.join('\n\n'))
}
