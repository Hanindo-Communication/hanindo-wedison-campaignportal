// Campaign Configuration for Landing Pages
// Each campaign can have multiple variants (e.g., general, ojol-focused)

export interface HeroConfig {
  headline: string
  subheadline: string
  highlightBadge?: string
  ctaText: string
  ctaLink: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  backgroundImage?: string
}

export interface CampaignConfig {
  name: string
  description: string
  date: string
  targetAudience: string
  badge?: {
    text: string
    color: string
  }
  hero: HeroConfig
  sections: string[]
  whatsappLink: string
  metadata: {
    title: string
    description: string
    keywords: string
  }
  /** `default` = anchor menu landing utama · `minimal` = logo + WA; dipakai juga landing promo (pills in-page lewat `showPromoInPageNav`). */
  navigation?: 'default' | 'minimal'
  /** FAQ copy density: promo ojol uses shorter driver-focused items */
  faqMode?: 'default' | 'promo-ojol'
  /** Popup gambar full layar (~1s setelah load), tutup pakai X. Ganti imageSrc dari placeholder ke asset final sebelum live. */
  heroPopupBanner?: {
    imageSrc: string
    alt?: string
  }
}

export interface CampaignVariants {
  [variant: string]: CampaignConfig
}

export interface Campaigns {
  [campaign: string]: CampaignVariants
}

// Default sections order
export const DEFAULT_SECTIONS = [
  'hero',
  'pain-points',
  'combined-savings',
  'models',
  'financing',
  'showroom',
  'testimonials',
  'faq',
  'lead-form',
]

// Campaign configurations
export const CAMPAIGNS: Campaigns = {
  '012026': {
    general: {
      name: 'Campaign Jan 2026 - General',
      description: 'Landing page utama untuk semua target audience, fokus pada penghematan BBM dan keunggulan SuperCharge.',
      date: 'Jan 2026',
      targetAudience: 'General',
      badge: {
        text: 'Main Campaign',
        color: 'bg-electric-blue/10 text-electric-blue',
      },
      hero: {
        headline: 'Hemat Hingga 60% Biaya BBM dengan Motor Listrik',
        subheadline: 'Charge 15 menit · hemat BBM · DP 0% (syarat berlaku).',
        highlightBadge: 'Promo Januari 2026',
        ctaText: 'Hitung Penghematan Saya',
        ctaLink: '#combined-savings',
        secondaryCtaText: 'WhatsApp',
        secondaryCtaLink: 'whatsapp',
      },
      sections: [
        'hero',
        'pain-points',
        'combined-savings',
        'models',
        'financing',
        'showroom',
        'faq',
        'lead-form',
      ],
      whatsappLink: 'general',
      metadata: {
        title: 'Wedison - Motor Listrik Hemat BBM | SuperCharge 15 Menit',
        description: 'Hemat 60% biaya BBM dengan motor listrik Wedison. SuperCharge 15 menit, cicilan mulai Rp 400rb/bulan. DP 0% tersedia.',
        keywords: 'motor listrik, hemat bbm, wedison, supercharge, motor listrik murah, cicilan motor listrik',
      },
    },
    ojol: {
      name: 'Campaign Jan 2026 - Ojol Driver',
      description: 'Landing page khusus untuk pengemudi ojek online, fokus pada penghematan operasional dan ROI cepat.',
      date: 'Jan 2026',
      targetAudience: 'Ojol Driver',
      badge: {
        text: 'Ojol Special',
        color: 'bg-success-green/10 text-success-green',
      },
      hero: {
        headline: 'Driver Ojol, Hemat Rp 500rb+/Bulan dengan Motor Listrik',
        subheadline: 'Operasional ringan · charge cepat · range panjang.',
        highlightBadge: 'Khusus Ojol Driver',
        ctaText: 'Hitung Penghematan Saya',
        ctaLink: '#combined-savings',
        secondaryCtaText: 'WhatsApp',
        secondaryCtaLink: 'whatsapp',
      },
      sections: [
        'hero',
        'pain-points',
        'combined-savings',
        'models',
        'financing',
        'showroom',
        'faq',
        'lead-form',
      ],
      whatsappLink: 'general',
      metadata: {
        title: 'Wedison untuk Ojol Driver - Hemat Biaya Operasional',
        description: 'Motor listrik Wedison untuk driver ojek online. Hemat Rp 500rb+/bulan, charge 15 menit, range 135km. Cocok untuk full-time driver.',
        keywords: 'motor listrik ojol, motor listrik grab, motor listrik gojek, hemat biaya operasional, motor listrik driver',
      },
    },
  },
  '052026': {
    promo: {
      name: 'Campaign Mei 2026 — Promo Ojol / Rute',
      description:
        'Landing promo Mei: kalkulator rute & perkiraan hemat vs BBM, nilai promo, konversi ke WhatsApp untuk traffic Meta, Google & TikTok.',
      date: 'Mei 2026',
      targetAudience: 'Driver ojol & pengguna rutin',
      badge: {
        text: 'Promo Mei 2026',
        color: 'bg-secondary-teal/15 text-electric-blue',
      },
      hero: {
        headline: 'Hemat Perjalanan Kamu dengan Motor Listrik Wedison',
        subheadline: '',
        highlightBadge: 'Motor listrik · Rute harian',
        ctaText: 'Cek hemat & promo',
        ctaLink: '#route-promo-estimate',
        secondaryCtaText: 'Hubungi Sales Wedison',
        secondaryCtaLink: 'whatsapp',
        backgroundImage: '/images/campaigns/052026/hero-reference.png',
      },
      sections: ['ojol-route-promo', 'why-wedison', 'showroom', 'faq'],
      heroPopupBanner: {
        imageSrc: '/images/campaigns/052026/hero-popup-placeholder.svg',
        alt: 'Placeholder pop-up — ganti sebelum live',
      },
      whatsappLink: 'promo052026',
      navigation: 'minimal',
      faqMode: 'promo-ojol',
      metadata: {
        title: 'Wedison Promo Mei 2026 — Cek Hemat Rute & Promo Motor Listrik',
        description: 'Estimasi hemat rute vs BBM, promo Mei, SuperCharge. Detail — WhatsApp.',
        keywords:
          'wedison, motor listrik, promo mei 2026, ojol, hemat bbm, supercharge, kredit motor listrik',
      },
    },
  },
}

// Helper function to get campaign config
export function getCampaignConfig(campaignId: string, variantId: string): CampaignConfig | null {
  const campaign = CAMPAIGNS[campaignId]
  if (!campaign) return null
  
  const variant = campaign[variantId]
  if (!variant) return null
  
  return variant
}

// Helper function to check if campaign exists
export function campaignExists(campaignId: string, variantId: string): boolean {
  return getCampaignConfig(campaignId, variantId) !== null
}

// Helper function to get all campaign paths (for static generation)
export function getAllCampaignPaths(): { campaign: string; variant: string }[] {
  const paths: { campaign: string; variant: string }[] = []
  
  Object.entries(CAMPAIGNS).forEach(([campaignId, variants]) => {
    Object.keys(variants).forEach((variantId) => {
      paths.push({ campaign: campaignId, variant: variantId })
    })
  })
  
  return paths
}
