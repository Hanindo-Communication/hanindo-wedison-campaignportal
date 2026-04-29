# Google Sheet + Apps Script — baris pre-chat modal

Aku tidak bisa membuat file di Google Drive kamu dari Cursor. Yang ada di folder ini **skrip siap tempel**; sheet-nya terbentuk otomatis (tab + baris judul) saat **pertama kali** ada POST yang masuk.

## Langkah singkat

1. **Google Sheets** → buat spreadsheet baru (nama bebas).
2. **Extensions → Apps Script** → hapus `Code.gs` default kalau mau → tempel isi `Code.gs` di folder ini → **Save**.
3. **Deploy → New deployment** → pilih type **Web app**:
   - **Execute as**: Me  
   - **Who has access**: Anyone  
4. **Authorize** saat diminta (akun yang punya sheet).
5. Salin **URL Web App** (`…/exec`) → set sebagai `GOOGLE_SHEETS_WEBAPP_URL` di environment hosting (lihat `app/api/lead/route.ts`).

Setelah deploy, buka landing → isi modal pre-chat → submit: tab **`prechat_leads`** muncul dengan header kolom yang sama persis dengan field JSON dari `buildPrechatSheetPayload` (`lib/whatsappPreFilterConfig.ts`, konstanta `PRECHAT_SHEET_COLUMN_KEYS`).

## Opsional: `INGEST_SECRET`

Di Apps Script: **Project Settings → Script properties** → tambah `INGEST_SECRET` (string acak).

Kalau secret di-set, body JSON **wajib** berisi `"ingest_secret": "<nilai yang sama>"`. Saat ini app belum mengirim field ini; tambahkan di `app/api/lead/route.ts` saat merge body ke forward ke Apps Script jika dipakai.

## Lead form lama

Jika ada POST dengan `name` / `phone` (tanpa `event_type`), skrip menulis satu baris dengan `event_type: lead_form` dan `prechat_payload_kind: legacy_form`. Form yang **langsung** fetch ke URL Apps Script dengan `no-cors` tidak lewat `/api/lead` — untuk konsistensi, arahkan form itu ke `/api/lead` juga.
