import type { OpenPreChatPayload, WhatsAppPrefilterIntentId } from '@/lib/whatsappPreFilterConfig'
import { MODEL_SPECS } from '@/utils/modelSpecs'

/** Opsional — override teks / intent saat `openPreChat`. */
export type OpenPreChatOptions = {
  kebutuhanHint?: string
  suggestedIntent?: WhatsAppPrefilterIntentId
}

/** CTA “Jadwal test drive” dari section Showroom saat payload masih `promo052026` (landing minimal). */
export const OPEN_PRECHAT_SHOWROOM_TEST_DRIVE: OpenPreChatOptions = {
  suggestedIntent: 'test_drive',
  kebutuhanHint:
    'Mau booking test drive di Experience Center Wedison (Jakarta atau Bandung). Mohon info ketersediaan slot, lokasi, dan hal yang perlu disiapkan.',
}

/** Konteks browsing (session) — diisi lewat `registerBrowseContext`. */
export type PreChatBrowseSnapshot = {
  modelId?: string
  modelName?: string
  /** Mis. `models`, `route-promo` */
  section?: string
  updatedAt?: number
}

const BROWSE_STALE_MS = 45 * 60 * 1000

export function isBrowseSnapshotFresh(snap: PreChatBrowseSnapshot): boolean {
  return typeof snap.updatedAt === 'number' && Date.now() - snap.updatedAt < BROWSE_STALE_MS
}

const MODEL_MESSAGE_KEYS = new Set<string>([
  'edpower',
  'athena',
  'victory',
  'bees',
  'hero',
])

function displayNameForMessageKey(key: string): string {
  if (key === 'hero') return MODEL_SPECS.find((m) => m.id === 'edpower')?.name ?? 'EdPower'
  const spec = MODEL_SPECS.find((m) => m.id === key)
  return spec?.name ?? key
}

/**
 * Isi awal intent + kebutuhan singkat agar modal terasa kontekstual bila ada konteks (model, hint eksplisit, dll.).
 * Teks yang diisi otomatis dirancang ≥ 10 karakter bila memang diisi (validasi modal).
 */
export function computePreChatSmartDefaults(
  payload: OpenPreChatPayload,
  browse: PreChatBrowseSnapshot,
  explicit?: OpenPreChatOptions
): {
  intentId: WhatsAppPrefilterIntentId | null
  kebutuhan: string
} {
  if (explicit?.kebutuhanHint?.trim()) {
    return {
      intentId: explicit.suggestedIntent ?? null,
      kebutuhan: explicit.kebutuhanHint.trim(),
    }
  }

  const fresh = isBrowseSnapshotFresh(browse)
  const modelLabel = fresh && browse.modelName?.trim() ? browse.modelName.trim() : null

  if (payload.kind === 'messageKey') {
    const mk = payload.messageKey

    if (mk === 'financing') {
      return {
        intentId: 'financing_rent',
        kebutuhan: modelLabel
          ? `Konsultasi cicilan dan financing untuk Wedison ${modelLabel} setelah lihat di halaman.`
          : 'Mau konsultasi opsi cicilan 0% dan financing motor listrik Wedison.',
      }
    }

    if (mk === 'testDrive') {
      return {
        intentId: 'test_drive',
        kebutuhan: modelLabel
          ? `Mau jadwalkan test drive Wedison ${modelLabel} setelah lihat di halaman — minta slot & lokasi Experience Center (Jakarta/Bandung).`
          : 'Mau jadwalkan test drive dan tanya ketersediaan unit serta lokasi showroom yang bisa dikunjungi.',
      }
    }

    if (mk === 'tradeIn') {
      return {
        intentId: 'explore',
        kebutuhan: 'Mau tanya proses trade-in motor lama ke Wedison dan perkiraan nilai tukar tambah.',
      }
    }

    if (mk === 'charging') {
      return {
        intentId: 'explore',
        kebutuhan: 'Tanya jaringan SuperCharge, instalasi home charger, dan biaya pengisian untuk pemakaian harian.',
      }
    }

    if (MODEL_MESSAGE_KEYS.has(mk)) {
      const templateName = displayNameForMessageKey(mk)
      return {
        intentId: 'explore',
        kebutuhan: modelLabel
          ? `Barusan pelajari Wedison ${modelLabel} di halaman model — mau detail spesifikasi, harga resmi, dan promo yang berlaku.`
          : `Tertarik dengan Wedison ${templateName}, mau info lengkap spesifikasi, harga, dan promo terkini.`,
      }
    }

    if (mk === 'general') {
      if (modelLabel) {
        return {
          intentId: 'explore',
          kebutuhan: `Barusan lihat Wedison ${modelLabel} di halaman — mau tanya cocoknya untuk pemakaian saya, harga, dan promo.`,
        }
      }
      return { intentId: null, kebutuhan: '' }
    }
  }

  if (payload.kind === 'promo052026') {
    if (modelLabel) {
      return {
        intentId: 'explore',
        kebutuhan: `Tanya lanjutan promo Mei & simulasi rute; sebelumnya tertarik Wedison ${modelLabel} di halaman.`,
      }
    }
    /* Tanpa konteks model / tanpa kebutuhanHint dari pemanggil: biarkan kosong + placeholder di UI */
    return { intentId: 'explore', kebutuhan: '' }
  }

  if (payload.kind === 'customBaseMessage') {
    return { intentId: null, kebutuhan: '' }
  }

  return { intentId: null, kebutuhan: '' }
}
