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
