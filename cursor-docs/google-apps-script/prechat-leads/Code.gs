/**
 * Pre-chat modal → Google Sheet (via POST Web App).
 *
 * SAMAKAN HEADER dengan PRECHAT_SHEET_COLUMN_KEYS di lib/whatsappPreFilterConfig.ts
 *
 * Setup:
 * 1. Buat spreadsheet baru di Drive (kosong boleh).
 * 2. Extensions → Apps Script → tempel file ini → Save.
 * 3. Deploy → New deployment → Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone (agar POST dari server Next / edge bisa masuk)
 * 4. Salin URL …/exec → env GOOGLE_SHEETS_WEBAPP_URL (atau isi di app/api/lead).
 *
 * Opsional — mitigasi spam: Project Settings → Script properties → INGEST_SECRET
 * isi string acak; di route Next tambahkan field ingest_secret yang sama ke body.
 */

var SHEET_TAB = 'prechat_leads'

/** Must match PRECHAT_SHEET_COLUMN_KEYS in repo (whatsappPreFilterConfig.ts). */
var HEADER = [
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
]

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  if (!ss) {
    throw new Error('Jalankan skrip dari spreadsheet (bound), atau set SPREADSHEET_ID di Script properties.')
  }
  var sh = ss.getSheetByName(SHEET_TAB)
  if (!sh) {
    sh = ss.insertSheet(SHEET_TAB)
  }
  return sh
}

function ensureHeaderRow_(sh) {
  var first = sh.getRange(1, 1, 1, HEADER.length).getValues()[0]
  var empty = first.every(function (c) {
    return c === '' || c === null
  })
  if (empty) {
    sh.getRange(1, 1, 1, HEADER.length).setValues([HEADER])
    sh.setFrozenRows(1)
  } else {
    var existing = first.map(String)
    for (var i = 0; i < HEADER.length; i++) {
      if (String(existing[i]) !== HEADER[i]) {
        throw new Error('Baris 1 sheet tidak cocok dengan HEADER skrip. Kosongkan baris 1 atau pakai tab baru.')
      }
    }
  }
}

function rowFromPayload_(data) {
  return HEADER.map(function (key) {
    var v = data[key]
    if (v === undefined || v === null) return ''
    return String(v)
  })
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
  try {
    var data
    try {
      data = JSON.parse(e.postData.contents)
    } catch (ignore) {
      return jsonOut({ success: false, error: 'Invalid JSON' })
    }

    var secret = PropertiesService.getScriptProperties().getProperty('INGEST_SECRET')
    if (secret && data.ingest_secret !== secret) {
      return jsonOut({ success: false, error: 'Unauthorized' })
    }
    if (data.event_type === 'prechat_submitted') {
      var sh = getOrCreateSheet_()
      ensureHeaderRow_(sh)
      sh.appendRow(rowFromPayload_(data))
      return jsonOut({ success: true })
    }

    // Lead form lama (tanpa event_type): name, phone, location, program, model
    if (data.name || data.phone) {
      var sh2 = getOrCreateSheet_()
      ensureHeaderRow_(sh2)
      var legacy = {
        submitted_at: new Date().toISOString(),
        event_type: 'lead_form',
        intent_id: '',
        lead_tier: '',
        nama: data.name || '',
        telepon: data.phone || '',
        kebutuhan: [data.program, data.model].filter(Boolean).join(' | '),
        lokasi_kota: data.location || '',
        tanggal_preferensi: '',
        platform_key: '',
        ref_code: '',
        utm_campaign: '',
        utm_medium: '',
        utm_content: '',
        prechat_payload_kind: 'legacy_form',
      }
      sh2.appendRow(rowFromPayload_(legacy))
      return jsonOut({ success: true })
    }

    return jsonOut({ success: false, error: 'Unknown payload' })
  } catch (err) {
    return jsonOut({ success: false, error: String(err.message || err) })
  }
}

function doGet() {
  return jsonOut({ ok: true, hint: 'Use POST with JSON body from landing /api/lead' })
}
