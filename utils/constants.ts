// Brand colors — aligned with wedison.co (green + navy)
export const COLORS = {
  electricBlue: '#1B8C5A',
  secondaryTeal: '#36B37E',
  accentOrange: '#F97316',
  successGreen: '#22C55E',
  darkBg: '#0F172A',
  lightBg: '#F8FAFC',
  textPrimary: '#1A365D',
  textSecondary: '#64748B',
  border: '#E2E8F0',
}

/** Lokasi showroom untuk section peta & CTA (Jakarta + Bandung). */
export const SHOWROOM_LOCATIONS = [
  {
    id: 'jakarta' as const,
    title: 'Jakarta',
    area: 'Pondok Indah, Jakarta Selatan',
    address: 'Jl. Arteri Pondok Indah No. 30A-C, Jakarta Selatan',
    embedQuery: 'Jl. Arteri Pondok Indah No. 30A-C, Jakarta Selatan Wedison',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Jl. Arteri Pondok Indah No. 30A-C, Jakarta Selatan'),
  },
  {
    id: 'bandung' as const,
    title: 'Bandung',
    area: 'Experience Center, Kota Bandung',
    address: 'Experience Center Wedison Bandung',
    embedQuery: 'Wedison Experience Center Bandung',
    mapsUrl: 'https://maps.app.goo.gl/28tRGZi43qA8uu76A',
  },
] as const

// Contact Information
export const CONTACT = {
  phone: '0821-2465-7804',
  whatsapp: '+6282124657804',
  email: 'support@wedison.co',
  showroomAddress: SHOWROOM_LOCATIONS[0].address,
  showroomHours: {
    weekday: 'Senin - Jumat: 10:00 - 19:00',
    weekend: 'Sabtu - Minggu: 10:00 - 17:00',
  },
}

// Product Models
export const MODELS = {
  edpower: {
    name: 'EdPower',
    price: 'Rp 45,900,000',
    dp: 'Rp 10,000,000',
    monthly: 'Rp 1,200,000',
    range: '160 km',
    battery: '66Ah',
  },
  athena: {
    name: 'Athena',
    price: 'Rp 28,700,000',
    dp: 'Rp 6,000,000',
    monthly: 'Rp 700,000',
    range: '110 km',
    battery: '33Ah',
  },
  victory: {
    name: 'Victory',
    price: 'Rp 28,400,000',
    dp: 'Rp 5,000,000',
    monthly: 'Rp 550,000',
    range: '110 km',
    battery: '33Ah',
  },
  bees: {
    name: 'Bees',
    price: 'Rp 15,900,000',
    dp: 'Rp 3,000,000',
    monthly: 'Rp 400,000',
    range: '80 km',
    battery: '25Ah',
  },
}

// Key Features
export const KEY_FEATURES = [
  { icon: '⚡', text: '15 menit charge', value: '10-80%' },
  { icon: '🔋', text: 'Range', value: '160 km' },
  { icon: '💨', text: 'Emisi', value: '0%' },
  { icon: '🛡️', text: 'Garansi', value: '3 tahun' },
]

// Statistics
export const STATS = {
  unitsDelivered: '5,000+',
  rating: '4.8/5',
  reviews: '2,000+',
  stations: '20+',
}

/** Tombol & aria WhatsApp — seragam; beberapa nilai khusus konteks section. */
export const WHATSAPP_CTA = {
  button: 'WhatsApp',
  /** Navbar / FAB promo — buka pre-chat (bukan label WhatsApp mentah). */
  navOrderCta: 'Pesan Sekarang',
  floatingTooltip: 'Hubungi Tim Kami',
  ariaOrderCta: 'Buka formulir pesan sekarang',
  ariaSalesCta: 'Hubungi tim sales Wedison',
  aria: 'Buka WhatsApp',
  modalSubmit: 'Lanjut ke WhatsApp',
  tooltipTitle: 'Butuh bantuan?',
  tooltipBody: 'Hubungi tim di WhatsApp.',
  /** Hitung hemat, cerita hemat, kalkulator */
  savings: 'WhatsApp',
  financingConsult: 'Tanya cicilan',
  financingOrder: 'Pesan unit',
  testDrive: 'Jadwal test drive',
} as const
