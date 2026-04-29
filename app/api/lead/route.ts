import { NextResponse } from 'next/server'

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge'

/** Override di hosting: `GOOGLE_SHEETS_WEBAPP_URL` */
const DEFAULT_GOOGLE_SHEETS_WEBAPP =
  'https://script.google.com/macros/s/AKfycbyfUr5-_bFreuIp58q6YphAPd0ro_QzoXNgMrZ38rkcCyNNy_llkEpkfS-IHb-i-ff3Rw/exec'

function googleSheetsWebAppUrl(): string {
  const fromEnv =
    typeof process !== 'undefined' && process.env.GOOGLE_SHEETS_WEBAPP_URL?.trim()
      ? process.env.GOOGLE_SHEETS_WEBAPP_URL.trim()
      : ''
  return fromEnv || DEFAULT_GOOGLE_SHEETS_WEBAPP
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const res = await fetch(googleSheetsWebAppUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const text = await res.text()
    
    try {
      const json = JSON.parse(text)
      if (json.success) {
        return NextResponse.json({ success: true, message: 'Data berhasil disimpan' })
      }
      return NextResponse.json({ error: json.error || 'Failed' }, { status: 500 })
    } catch {
      // Non-JSON response
      return NextResponse.json({ success: true, message: 'Data berhasil disimpan' })
    }
  } catch (err) {
    return NextResponse.json(
      { error: 'Server error', details: String(err) },
      { status: 500 }
    )
  }
}
