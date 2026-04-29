/**
 * Detect ad platform from URL (UTM, custom src, or platform click IDs).
 * Used for WhatsApp prefill and analytics context.
 */

export type AdPlatformKey = 'google' | 'meta' | 'tiktok' | 'other' | 'organic'

export type AdAttribution = {
  refCode: string
  sourceLine: string
  platformKey: AdPlatformKey
  /** Short context line — varies by platform */
  platformNote?: string
  /** Dari URL utm_* — dipakai di header WA & log sheet (truncated) */
  utmCampaign?: string
  utmMedium?: string
  utmContent?: string
}

export const ORGANIC_ATTRIBUTION: AdAttribution = {
  refCode: 'WD-WEB',
  sourceLine: '[Sumber: Kunjungan langsung / web]',
  platformKey: 'organic',
}

function sanitizeRefSegment(raw: string): string {
  const s = raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 12)
  return s || 'REF'
}

function platformNoteFor(key: AdPlatformKey): string | undefined {
  switch (key) {
    case 'google':
      return '(Konteks: dari Google — tolong jangan hapus kode di atas.)'
    case 'meta':
      return '(Konteks: dari Meta/FB/IG — tolong jangan hapus kode di atas.)'
    case 'tiktok':
      return '(Konteks: dari TikTok — tolong jangan hapus kode di atas.)'
    case 'other':
      return '(Konteks: dari kampanye/iklan — tolong jangan hapus kode di atas.)'
    default:
      return undefined
  }
}

function fromUtmOrSrc(raw: string): AdAttribution {
  const key = raw.trim().toLowerCase()
  const map: Record<string, { refCode: string; sourceLine: string; platformKey: AdPlatformKey }> = {
    facebook: { refCode: 'WD-META', sourceLine: '[Sumber: Iklan Meta]', platformKey: 'meta' },
    fb: { refCode: 'WD-META', sourceLine: '[Sumber: Iklan Meta]', platformKey: 'meta' },
    meta: { refCode: 'WD-META', sourceLine: '[Sumber: Iklan Meta]', platformKey: 'meta' },
    instagram: { refCode: 'WD-META', sourceLine: '[Sumber: Iklan Meta]', platformKey: 'meta' },
    ig: { refCode: 'WD-META', sourceLine: '[Sumber: Iklan Meta]', platformKey: 'meta' },
    google: { refCode: 'WD-GGL', sourceLine: '[Sumber: Google Ads]', platformKey: 'google' },
    gads: { refCode: 'WD-GGL', sourceLine: '[Sumber: Google Ads]', platformKey: 'google' },
    tiktok: { refCode: 'WD-TT', sourceLine: '[Sumber: TikTok Ads]', platformKey: 'tiktok' },
    tt: { refCode: 'WD-TT', sourceLine: '[Sumber: TikTok Ads]', platformKey: 'tiktok' },
  }

  const hit = map[key]
  if (hit) {
    return {
      ...hit,
      platformNote: platformNoteFor(hit.platformKey),
    }
  }

  const seg = sanitizeRefSegment(key)
  return {
    refCode: `WD-${seg}`,
    sourceLine: `[Sumber: ${raw.trim()}]`,
    platformKey: 'other',
    platformNote: platformNoteFor('other'),
  }
}

/**
 * Returns attribution only when the current URL carries a measurable signal
 * (click id or marketing params). Otherwise `null` — caller may fall back to
 * stored session or organic default.
 */
export function parseAdAttributionFromUrl(searchParams: URLSearchParams): AdAttribution | null {
  if (searchParams.get('gclid')) {
    return {
      refCode: 'WD-GGL',
      sourceLine: '[Sumber: Google Ads]',
      platformKey: 'google',
      platformNote: platformNoteFor('google'),
    }
  }
  if (searchParams.get('gbraid') || searchParams.get('wbraid')) {
    return {
      refCode: 'WD-GGL',
      sourceLine: '[Sumber: Google Ads]',
      platformKey: 'google',
      platformNote: platformNoteFor('google'),
    }
  }
  if (searchParams.get('fbclid')) {
    return {
      refCode: 'WD-META',
      sourceLine: '[Sumber: Iklan Meta]',
      platformKey: 'meta',
      platformNote: platformNoteFor('meta'),
    }
  }
  if (searchParams.get('ttclid')) {
    return {
      refCode: 'WD-TT',
      sourceLine: '[Sumber: TikTok Ads]',
      platformKey: 'tiktok',
      platformNote: platformNoteFor('tiktok'),
    }
  }

  const utm =
    searchParams.get('utm_source') ||
    searchParams.get('src') ||
    searchParams.get('source') ||
    ''

  if (utm.trim()) {
    return fromUtmOrSrc(utm)
  }

  return null
}

/** @deprecated Prefer parseAdAttributionFromUrl + AdAttribution — kept for narrow call sites */
export function getAdSourceLine(searchParams: URLSearchParams | null): string {
  if (!searchParams) return ''
  const a = parseAdAttributionFromUrl(searchParams)
  return a?.sourceLine ?? ''
}

const UTM_MAX = { campaign: 48, medium: 24, content: 48 } as const

function trimUtmParam(raw: string | null, max: number): string | undefined {
  if (raw == null) return undefined
  const t = raw.trim().replace(/\s+/g, ' ')
  if (!t) return undefined
  return t.slice(0, max)
}

/** Ambil utm_* dari query; nilai dipotong agar aman untuk wa.me & sheet. */
export function utmFieldsFromSearchParams(p: URLSearchParams): Pick<
  AdAttribution,
  'utmCampaign' | 'utmMedium' | 'utmContent'
> {
  const utmCampaign = trimUtmParam(p.get('utm_campaign'), UTM_MAX.campaign)
  const utmMedium = trimUtmParam(p.get('utm_medium'), UTM_MAX.medium)
  const utmContent = trimUtmParam(p.get('utm_content'), UTM_MAX.content)
  const out: Pick<AdAttribution, 'utmCampaign' | 'utmMedium' | 'utmContent'> = {}
  if (utmCampaign) out.utmCampaign = utmCampaign
  if (utmMedium) out.utmMedium = utmMedium
  if (utmContent) out.utmContent = utmContent
  return out
}

/** Gabungkan utm dari URL ke objek attribution (hanya field yang ada di URL). */
export function mergeUtmFromUrlParams(attr: AdAttribution, p: URLSearchParams): AdAttribution {
  const u = utmFieldsFromSearchParams(p)
  return { ...attr, ...u }
}

/**
 * Attribution final untuk landing: klik id / utm_source, lalu utm campaign layer,
 * dengan fallback session (stored) lalu organik.
 */
export function resolveLandingAttribution(
  fromClickOrSource: AdAttribution | null,
  stored: AdAttribution | null,
  p: URLSearchParams
): AdAttribution {
  const base = fromClickOrSource ?? stored ?? ORGANIC_ATTRIBUTION
  const withPlatform: AdAttribution = {
    ...base,
    platformKey: base.platformKey ?? 'organic',
  }
  return mergeUtmFromUrlParams(withPlatform, p)
}
