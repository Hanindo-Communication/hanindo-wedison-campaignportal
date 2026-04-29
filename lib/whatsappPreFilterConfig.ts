import type { AdAttribution } from '@/lib/adSourceFromUrl'
import { WHATSAPP_CTA } from '@/utils/constants'
import { WHATSAPP_MESSAGES, type Promo052026MessageParts } from '@/utils/whatsappLinks'
import { buildLandingPrefilterWaUrl, buildPromoPrefilterWaUrl } from '@/utils/buildWhatsAppPrefilterUrl'

/** Hanya dipakai untuk override eksplisit; UI & pesan WA default Bahasa Indonesia. */
export type WhatsAppPreChatLocale = 'id' | 'en'

export type IntentTier = 'cold' | 'potential'

export type WhatsAppPrefilterIntentId = 'explore' | 'test_drive' | 'showroom' | 'financing_rent'

export type WhatsAppPrefilterIntent = {
  id: WhatsAppPrefilterIntentId
  tier: IntentTier
  /** Label lengkap — dipakai di pesan WA & aksesibilitas */
  label: string
  /** Teks tombol modal: cukup ringkas tapi jelas niat (bukan satu kata samar) */
  shortLabel: string
  /** Satu baris natural (ID) untuk prefill WA / routing Cekat */
  waLine: string
}

export const WHATSAPP_PREFILTER_INTENTS: WhatsAppPrefilterIntent[] = [
  {
    id: 'explore',
    tier: 'cold',
    label: 'Mau tanya-tanya dulu',
    shortLabel: 'Mau tanya produk & info dulu',
    waLine: 'Saya mau tanya-tanya dulu tentang Wedison sebelum memutuskan langkah berikutnya.',
  },
  {
    id: 'test_drive',
    tier: 'potential',
    label: 'Test drive',
    shortLabel: 'Mau jadwalkan test drive',
    waLine: 'Saya tertarik menjadwalkan test drive.',
  },
  {
    id: 'showroom',
    tier: 'potential',
    label: 'Kunjungi showroom',
    shortLabel: 'Kunjungi showroom / lihat unit',
    waLine: 'Saya ingin berkunjung ke showroom / Experience Center.',
  },
  {
    id: 'financing_rent',
    tier: 'potential',
    label: 'Nanya cicilan / sewa',
    shortLabel: 'Tanya cicilan atau sewa',
    waLine: 'Saya ingin diskusi tentang opsi cicilan atau sewa.',
  },
]

export type PrefilterFieldId = 'nama' | 'telepon' | 'kebutuhan' | 'lokasiKota' | 'tanggalPreferensi'

export type PrefilterChoiceOption = { value: string; label: string }

export type PrefilterFieldDef = {
  id: PrefilterFieldId
  type: 'text' | 'tel' | 'textarea' | 'date' | 'choice'
  label: string
  placeholder: string
  /** Teks bantu di bawah input */
  helper?: string
  /** Untuk type `choice` — nilai disimpan = `value` */
  choices?: PrefilterChoiceOption[]
  /** Wajib untuk semua intent */
  required?: boolean
  /** Wajib hanya jika intent termasuk daftar ini (mis. tanggal untuk test drive & showroom) */
  requiredForIntents?: WhatsAppPrefilterIntentId[]
}

export const WHATSAPP_PREFILTER_FIELDS: PrefilterFieldDef[] = [
  {
    id: 'nama',
    type: 'text',
    label: 'Nama',
    placeholder: 'Nama lengkap',
    required: true,
  },
  {
    id: 'telepon',
    type: 'tel',
    label: 'Nomor WhatsApp',
    placeholder: '08xxxxxxxxxx',
    required: true,
  },
  {
    id: 'kebutuhan',
    type: 'textarea',
    label: 'Kebutuhan singkat',
    placeholder:
      'Ceritakan singkat: pemakaian (ojol/komuter), apa yang mau ditanyakan (promo, cicilan, unit), atau langkah yang diharapkan.',
    helper: 'Min. 10 karakter — tulis dengan kata-kata kamu sendiri.',
    required: true,
  },
  {
    id: 'lokasiKota',
    type: 'choice',
    label: 'Lokasi',
    placeholder: '',
    helper: 'Showroom & test drive: Jakarta atau Bandung.',
    choices: [
      { value: 'jakarta', label: 'Jakarta' },
      { value: 'bandung', label: 'Bandung' },
    ],
    requiredForIntents: ['test_drive', 'showroom'],
  },
  {
    id: 'tanggalPreferensi',
    type: 'date',
    label: 'Tanggal preferensi',
    placeholder: '',
    helper: 'Tap ikon kalender — wajib untuk test drive & kunjung showroom.',
    requiredForIntents: ['test_drive', 'showroom'],
  },
]

function isVisitSchedulingIntent(intentId: WhatsAppPrefilterIntentId | null): boolean {
  return intentId === 'test_drive' || intentId === 'showroom'
}

/** Field tanggal hanya untuk test drive & kunjung showroom. */
export function isTanggalPrefilterVisible(intentId: WhatsAppPrefilterIntentId | null): boolean {
  return isVisitSchedulingIntent(intentId)
}

/** Pilih kota Jakarta/Bandung — sama kondisi dengan tanggal. */
export function isLokasiPrefilterVisible(intentId: WhatsAppPrefilterIntentId | null): boolean {
  return isVisitSchedulingIntent(intentId)
}

export function formatLokasiValueForWa(value: string): string {
  const v = value.trim().toLowerCase()
  if (v === 'jakarta') return 'Jakarta'
  if (v === 'bandung') return 'Bandung'
  return value.trim()
}

/** Format YYYY-MM-DD ke teks Indonesia untuk pesan WA. */
export function formatTanggalIsoForWa(iso: string): string {
  const t = iso.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return t
  const [y, m, d] = t.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  if (
    Number.isNaN(dt.getTime()) ||
    dt.getFullYear() !== y ||
    dt.getMonth() !== m - 1 ||
    dt.getDate() !== d
  ) {
    return t
  }
  return dt.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function isFieldRequired(
  def: PrefilterFieldDef,
  intentId: WhatsAppPrefilterIntentId | null
): boolean {
  if (def.required) return true
  if (def.requiredForIntents && intentId) {
    return def.requiredForIntents.includes(intentId)
  }
  return false
}

/** Selalu Indonesia untuk isi WA & label di pesan. */
export function resolvePreChatLocale(override?: WhatsAppPreChatLocale): WhatsAppPreChatLocale {
  if (override === 'en') return 'en'
  return 'id'
}

function normalizePhoneDigits(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('62')) d = '0' + d.slice(2)
  return d
}

export function validatePrefilterField(
  fieldId: PrefilterFieldId,
  value: string,
  intentId: WhatsAppPrefilterIntentId | null
): string | null {
  if (fieldId === 'tanggalPreferensi' && !isTanggalPrefilterVisible(intentId)) {
    return null
  }
  if (fieldId === 'lokasiKota' && !isLokasiPrefilterVisible(intentId)) {
    return null
  }
  const def = WHATSAPP_PREFILTER_FIELDS.find((f) => f.id === fieldId)
  if (!def) return null
  const required = isFieldRequired(def, intentId)
  const v = value.trim()

  if (required && !v) {
    if (fieldId === 'tanggalPreferensi') return 'need_date'
    if (fieldId === 'lokasiKota') return 'pick_lokasi'
    return 'required'
  }
  if (!required && !v) return null

  if (fieldId === 'nama') {
    if (v.length < 2) return 'short_name'
    return null
  }
  if (fieldId === 'telepon') {
    const d = normalizePhoneDigits(v)
    if (d.length < 10 || d.length > 13) return 'invalid_phone'
    return null
  }
  if (fieldId === 'kebutuhan') {
    if (v.length < 10) return 'short_kebutuhan'
    return null
  }
  if (fieldId === 'tanggalPreferensi') {
    if (!required) return null
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'need_date'
    return null
  }
  if (fieldId === 'lokasiKota') {
    if (!required) return null
    const norm = v.toLowerCase()
    if (norm !== 'jakarta' && norm !== 'bandung') return 'pick_lokasi'
    return null
  }
  return null
}

/** Blok detail isian user (setelah teks Halo/rute/dll.). Intent/tier hanya di POST sheet, bukan di teks WA. */
export function formatStructuredLeadForWhatsApp(
  intent: WhatsAppPrefilterIntent,
  values: Record<PrefilterFieldId, string>
): string {
  const lines: string[] = []
  lines.push(`Kebutuhan: ${intent.label}`)
  for (const f of WHATSAPP_PREFILTER_FIELDS) {
    const raw = values[f.id]?.trim()
    if (!raw) continue
    const val =
      f.id === 'tanggalPreferensi'
        ? formatTanggalIsoForWa(raw)
        : f.id === 'lokasiKota'
          ? formatLokasiValueForWa(raw)
          : raw
    const key =
      f.id === 'nama'
        ? 'Nama'
        : f.id === 'telepon'
          ? 'WA'
          : f.id === 'kebutuhan'
            ? 'Ket'
            : f.id === 'lokasiKota'
              ? 'Lokasi'
              : 'Tgl'
    lines.push(`${key}: ${val}`)
  }
  return lines.join('\n')
}

export function getIntentById(id: WhatsAppPrefilterIntentId): WhatsAppPrefilterIntent | undefined {
  return WHATSAPP_PREFILTER_INTENTS.find((i) => i.id === id)
}

export function composePrefilterLandingBody(args: {
  locale: WhatsAppPreChatLocale
  baseLandingMessage: string
  intent: WhatsAppPrefilterIntent
  fieldValues: Record<PrefilterFieldId, string>
}): string {
  const { baseLandingMessage, intent, fieldValues } = args
  const structured = formatStructuredLeadForWhatsApp(intent, fieldValues)
  return [baseLandingMessage.trim(), structured].join('\n\n')
}

export function composePrefilterPromoSuffix(args: {
  locale: WhatsAppPreChatLocale
  intent: WhatsAppPrefilterIntent
  fieldValues: Record<PrefilterFieldId, string>
}): string {
  const { intent, fieldValues } = args
  return formatStructuredLeadForWhatsApp(intent, fieldValues)
}

export type MessageKey = keyof typeof WHATSAPP_MESSAGES

export type OpenPreChatPayload =
  | { kind: 'messageKey'; messageKey: MessageKey; locale?: WhatsAppPreChatLocale }
  | { kind: 'customBaseMessage'; baseMessage: string; locale?: WhatsAppPreChatLocale }
  | {
      kind: 'promo052026'
      promoParts: Omit<Promo052026MessageParts, 'attribution'>
      locale?: WhatsAppPreChatLocale
    }

/**
 * Urutan kolom di Google Sheet untuk baris pre-chat (sama dengan urutan kunci JSON ke `/api/lead`).
 * Sinkronkan dengan `cursor-docs/google-apps-script/prechat-leads/Code.gs` (HEADER).
 */
export const PRECHAT_SHEET_COLUMN_KEYS = [
  'submitted_at',
  'event_type',
  'intent_id',
  'lead_tier',
  'nama',
  'telepon',
  'kebutuhan',
  'lokasi_kota',
  'tanggal_preferensi',
  'platform_key',
  'ref_code',
  'utm_campaign',
  'utm_medium',
  'utm_content',
  'prechat_payload_kind',
] as const

export type PrechatSheetColumnKey = (typeof PRECHAT_SHEET_COLUMN_KEYS)[number]

/** Payload untuk POST `/api/lead` → Google Apps Script (baris pre-chat). */
export function buildPrechatSheetPayload(args: {
  intent: WhatsAppPrefilterIntent
  fieldValues: Record<PrefilterFieldId, string>
  attribution: AdAttribution
  payloadKind: OpenPreChatPayload['kind']
}): Record<string, string | undefined> {
  const { intent, fieldValues, attribution, payloadKind } = args
  const core: Record<PrechatSheetColumnKey, string | undefined> = {
    submitted_at: new Date().toISOString(),
    event_type: 'prechat_submitted',
    intent_id: intent.id,
    lead_tier: intent.tier,
    nama: fieldValues.nama?.trim(),
    telepon: fieldValues.telepon?.trim(),
    kebutuhan: fieldValues.kebutuhan?.trim(),
    lokasi_kota: fieldValues.lokasiKota?.trim() || undefined,
    tanggal_preferensi: fieldValues.tanggalPreferensi?.trim() || undefined,
    platform_key: attribution.platformKey,
    ref_code: attribution.refCode,
    utm_campaign: attribution.utmCampaign,
    utm_medium: attribution.utmMedium,
    utm_content: attribution.utmContent,
    prechat_payload_kind: payloadKind,
  }
  const ordered: Record<string, string | undefined> = {}
  for (const key of PRECHAT_SHEET_COLUMN_KEYS) {
    ordered[key] = core[key]
  }
  return ordered
}

export function buildPrefilterUrlFromPayload(
  payload: OpenPreChatPayload,
  attribution: AdAttribution,
  intent: WhatsAppPrefilterIntent,
  fieldValues: Record<PrefilterFieldId, string>
): string {
  const locale = resolvePreChatLocale(payload.locale)

  if (payload.kind === 'promo052026') {
    const suffix = composePrefilterPromoSuffix({ locale, intent, fieldValues })
    return buildPromoPrefilterWaUrl({ ...payload.promoParts, attribution }, suffix)
  }

  const base =
    payload.kind === 'messageKey'
      ? WHATSAPP_MESSAGES[payload.messageKey]
      : payload.baseMessage.trim()

  const body = composePrefilterLandingBody({
    locale,
    baseLandingMessage: base,
    intent,
    fieldValues,
  })
  return buildLandingPrefilterWaUrl(body, attribution)
}

/** Teks UI modal — seluruhnya Bahasa Indonesia. */
export const PRECHAT_UI = {
  modalTitle: 'Sebelum WhatsApp',
  modalSubtitle: 'Topik · data singkat · test drive: lokasi & tanggal.',
  sectionIntent: 'Topik',
  /** Hanya untuk test drive / showroom — di bawah pilihan intent */
  sectionVisit: 'Lokasi & tanggal',
  sectionData: 'Data kamu',
  submit: WHATSAPP_CTA.modalSubmit,
  close: 'Tutup',
  /** Ditampilkan di bawah kolom kebutuhan bila terisi otomatis dari konteks halaman */
  smartFillNote: 'Teks ini disarankan dari halaman yang kamu buka — silakan diedit agar sesuai pertanyaanmu.',
  errors: {
    short_name: 'Nama minimal 2 karakter.',
    invalid_phone: 'Nomor WhatsApp tidak valid (contoh: 08xxxxxxxxxx).',
    pick_intent: 'Pilih salah satu fokus pertanyaanmu dulu.',
    short_kebutuhan: 'Ceritakan kebutuhanmu sedikit lebih detail (minimal 10 karakter).',
    need_date: 'Pilih tanggal lewat kalender (ikon di kanan field).',
    pick_lokasi: 'Pilih lokasi: Jakarta atau Bandung.',
    required: 'Field ini wajib diisi.',
  },
} as const
