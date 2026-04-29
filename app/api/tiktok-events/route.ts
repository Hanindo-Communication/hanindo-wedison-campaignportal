import { NextResponse } from 'next/server'

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge'

const TIKTOK_PIXEL_ID = 'D5M7DLBC77U27TJUP94G'
const TIKTOK_EVENTS_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/'
const TIKTOK_TEST_EVENT_CODE = 'TEST37883' // Test event code for testing

interface TikTokEventData {
  event: string
  event_time?: number
  event_id?: string
  test_event_code?: string // Optional test event code
  user?: {
    ip?: string
    user_agent?: string
    email?: string
    phone?: string
    external_id?: string
  }
  properties?: {
    content_id?: string
    content_type?: string
    content_name?: string
    value?: number
    currency?: string
    url?: string
  }
}

interface TikTokEventsPayload {
  event_source: string
  event_source_id: string
  test_event_code?: string // Test event code for testing
  data: Array<{
    event: string
    event_time: number
    event_id?: string
    user: {
      ip?: string
      user_agent?: string
      email?: string
      phone?: string
      external_id?: string
    }
    properties?: {
      content_id?: string
      content_type?: string
      content_name?: string
      value?: number
      currency?: string
      url?: string
    }
  }>
}

export async function POST(request: Request) {
  try {
    // Get access token from environment variable
    const accessToken = process.env.TIKTOK_EVENTS_API_TOKEN
    
    // Tanpa token, pixel client tetap jalan; Events API opsional. Jangan 500 (spam error & monitoring).
    if (!accessToken) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[tiktok-events] TIKTOK_EVENTS_API_TOKEN tidak diset — event diskip.')
      }
      return NextResponse.json({
        success: true,
        skipped: true,
        message: 'TikTok Events API not configured',
      })
    }

    // Get event data from request body
    const eventData: TikTokEventData = await request.json()
    
    // Get client IP and user agent from request headers
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const url = request.headers.get('referer') || 'unknown'

    // Check if test mode is enabled via environment variable or request
    const isTestMode = process.env.TIKTOK_TEST_MODE === 'true' || eventData.test_event_code !== undefined
    const testEventCode = eventData.test_event_code || (isTestMode ? TIKTOK_TEST_EVENT_CODE : undefined)

    // Build TikTok Events API payload
    const payload: TikTokEventsPayload = {
      event_source: 'web',
      event_source_id: TIKTOK_PIXEL_ID,
      ...(testEventCode && { test_event_code: testEventCode }),
      data: [
        {
          event: eventData.event,
          event_time: eventData.event_time || Math.floor(Date.now() / 1000),
          event_id: eventData.event_id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          user: {
            ip: eventData.user?.ip || clientIP.split(',')[0].trim(),
            user_agent: eventData.user?.user_agent || userAgent,
            ...(eventData.user?.email && { email: eventData.user.email }),
            ...(eventData.user?.phone && { phone: eventData.user.phone }),
            ...(eventData.user?.external_id && { external_id: eventData.user.external_id }),
          },
          ...(eventData.properties && {
            properties: {
              ...(eventData.properties.content_id && { content_id: eventData.properties.content_id }),
              ...(eventData.properties.content_type && { content_type: eventData.properties.content_type }),
              ...(eventData.properties.content_name && { content_name: eventData.properties.content_name }),
              ...(eventData.properties.value !== undefined && { value: eventData.properties.value }),
              ...(eventData.properties.currency && { currency: eventData.properties.currency }),
              ...(eventData.properties.url && { url: eventData.properties.url }),
              url: eventData.properties.url || url,
            },
          }),
        },
      ],
    }

    // Send POST request to TikTok Events API
    const response = await fetch(TIKTOK_EVENTS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const responseText = await response.text()
    let responseData: unknown = null
    try {
      responseData = responseText ? JSON.parse(responseText) : null
    } catch {
      responseData = { parseError: true, bodyPreview: responseText.slice(0, 400) }
    }

    if (!response.ok) {
      console.error('TikTok Events API error:', responseData)
      return NextResponse.json(
        { error: 'TikTok Events API error', details: responseData },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event sent to TikTok Events API',
      test_mode: isTestMode,
      test_event_code: testEventCode,
      data: responseData 
    })

  } catch (err) {
    console.error('TikTok Events API route error:', err)
    return NextResponse.json(
      { error: 'Server error', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
