# WhatsApp leads: sheet (pre-chat) & inbound (layer B)

## Layer A — Pre-chat submitted (dari landing)

Saat user menyelesaikan modal pre-chat dan menekan **Hubungi via WhatsApp**, browser mengirim **POST** ke `/api/lead` dengan JSON berikut (urutan kunci = urutan kolom sheet; lihat `PRECHAT_SHEET_COLUMN_KEYS` di `lib/whatsappPreFilterConfig.ts` dan skrip `cursor-docs/google-apps-script/prechat-leads/Code.gs`):

| Kunci | Contoh | Keterangan |
|-------|--------|------------|
| `submitted_at` | ISO-8601 | Waktu submit di browser (kolom pertama di sheet). |
| `event_type` | `prechat_submitted` | Bedakan dari form lead lama. |
| `intent_id` | `test_drive` | Salah satu: `explore`, `test_drive`, `showroom`, `financing_rent`. |
| `lead_tier` | `potential` | `cold` atau `potential`. |
| `nama` | string | |
| `telepon` | string | |
| `kebutuhan` | string | |
| `lokasi_kota` | `jakarta` / `bandung` / kosong | Hanya relevan untuk test drive / showroom. |
| `tanggal_preferensi` | `YYYY-MM-DD` / kosong | |
| `platform_key` | `meta` | `google`, `meta`, `tiktok`, `organic`, `other`. |
| `ref_code` | `WD-META` | Kode REF di header WA. |
| `utm_campaign` | optional | Terisi jika ada di URL (truncated di client). |
| `utm_medium` | optional | |
| `utm_content` | optional | |
| `prechat_payload_kind` | `promo052026` | `messageKey`, `customBaseMessage`, atau `promo052026`. |

**Lead form lama** (section form) tetap mengirim objek dengan field `name`, `phone`, `location`, `program`, `model` — tanpa `event_type`. Apps Script disarankan:

- Jika `event_type === 'prechat_submitted'` → append ke baris dengan kolom pre-chat.
- Jika tidak ada `event_type` → perlakukan sebagai lead form seperti sekarang.

## Layer B — Pesan WhatsApp sungguhan

Browser **tidak** bisa memastikan user menekan Kirim di aplikasi WhatsApp. Untuk mencatat lead konversi dari **pesan masuk**:

1. Gunakan **WhatsApp Business Platform** (Cloud API) webhook, BSP, atau tool inbox yang menulis ke sheet/CRM saat pesan masuk pertama kali dari nomor tersebut.
2. Di sheet, gunakan kolom `event_type: wa_inbound` (atau tab terpisah) dan isi nomor WA + timestamp dari webhook.
3. **Join** ke layer A: cocokkan `telepon` (normalisasi ke format yang sama) dalam jendela waktu (mis. 48 jam), atau gunakan token referensi di baris pertama prefill jika workflow internal mendukungnya.

## Teks WA (tim Wedison)

Prefill disusun **atas = sumber kunjungan** (ringkas), **bawah = konteks user**:

1. `[REF:…]` + baris `src=…` (platform) dan `utm=…` bila ada di URL.
2. Teks promo / Halo / rute / estimasi (kalau promo), atau template landing lain.
3. Blok detail: `Kebutuhan: …`, nama, WA, dll.

**Intent / tier** tidak ditampilkan di teks WA (agar natural); tetap terkirim ke spreadsheet lewat POST `/api/lead` (`intent_id`, `lead_tier`).

Baris REF/src jangan dihapus agar tracking tetap konsisten.
