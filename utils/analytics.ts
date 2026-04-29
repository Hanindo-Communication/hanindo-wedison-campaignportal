// Google Tag Manager / Analytics Setup
// 
// SETUP INSTRUCTIONS:
// 1. Buat GTM Container di https://tagmanager.google.com
// 2. Copy GTM Container ID (format: GTM-XXXXXXX)
// 3. Update GTM_ID di bawah ini
// 4. Untuk production, gunakan environment variable: NEXT_PUBLIC_GTM_ID
//
// READ MORE: docs/GTM_SETUP_GUIDE.md

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NRFXB3GJ'

// Optional: Google Analytics 4 Measurement ID
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || '' // Format: G-XXXXXXXXXX

// Optional: Facebook Pixel ID
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '' // Format: 123456789012345

// TikTok Pixel ID
export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'D5M7DLBC77U27TJUP94G'

// TikTok Test Event Code (for testing Events API)
export const TIKTOK_TEST_EVENT_CODE = 'TEST37883'

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'pageview',
      page: url,
    })
  }
}

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'customEvent',
      eventAction: action,
      eventCategory: category,
      eventLabel: label,
      eventValue: value,
    })
  }
}

// TikTok Pixel tracking functions (client-side)
export const trackTikTokEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).ttq) {
    try {
      (window as any).ttq.track(eventName, parameters || {})
    } catch (error) {
      console.error('TikTok Pixel tracking error:', error)
    }
  }
}

// TikTok Events API tracking functions (server-side via API route)
export const trackTikTokEventAPI = async (
  event: string,
  properties?: {
    content_id?: string
    content_type?: string
    content_name?: string
    value?: number
    currency?: string
    url?: string
  },
  user?: {
    email?: string
    phone?: string
    external_id?: string
  },
  testEventCode?: string // Optional test event code for testing
) => {
  if (typeof window === 'undefined') return

  try {
    const eventData = {
      event,
      event_time: Math.floor(Date.now() / 1000),
      event_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...(testEventCode && { test_event_code: testEventCode }),
      user: user || {},
      properties: {
        ...properties,
        url: properties?.url || window.location.href,
      },
    }

    const response = await fetch('/api/tiktok-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      console.error('TikTok Events API error:', await response.text())
    }
  } catch (error) {
    console.error('TikTok Events API tracking error:', error)
  }
}

// Predefined event trackers
export const trackWhatsAppClick = (source: string, testMode: boolean = false) => {
  trackEvent('click', 'WhatsApp', source)
  
  // Track to TikTok as Lead event (client-side pixel)
  trackTikTokEvent('Lead', {
    content_type: 'whatsapp_click',
    content_name: source,
  })

  // Also track via Events API as ClickButton event (server-side)
  trackTikTokEventAPI('ClickButton', {
    content_type: 'whatsapp_click',
    content_name: source,
  }, undefined, testMode ? TIKTOK_TEST_EVENT_CODE : undefined)
}

export const trackTestDriveClick = () => {
  trackEvent('click', 'CTA', 'Test Drive Booking')
}

export const trackVideoPlay = (videoName: string) => {
  trackEvent('play', 'Video', videoName)
}

export const trackSectionView = (sectionName: string) => {
  trackEvent('view', 'Section', sectionName)
}

/** Pre-chat modal: intent + tier + platform sebelum redirect ke wa.me */
export const trackWhatsAppPreChatSubmit = (
  intentId: string,
  leadTier: string,
  platformKey: string
) => {
  trackEvent('submit', 'WhatsAppPreChat', `${intentId}|${leadTier}|${platformKey}`)
}

export const trackLeadFormSubmit = (program: string, model?: string, testMode: boolean = false) => {
  trackEvent('submit', 'LeadForm', program, model ? 1 : 0)
  
  // Also push detailed lead data for GTM
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'leadFormSubmit',
      leadProgram: program,
      leadModel: model || '',
    })
  }
  
  // Track to TikTok as SubmitApplication event (client-side pixel)
  trackTikTokEvent('SubmitApplication', {
    content_type: 'form_submission',
    content_name: program,
    ...(model && { model: model }),
  })

  // Also track via Events API as Lead event (server-side)
  trackTikTokEventAPI('Lead', {
    content_type: 'form_submission',
    content_name: program,
    ...(model && { content_id: model }),
  }, undefined, testMode ? TIKTOK_TEST_EVENT_CODE : undefined)
}

// Track page view via Events API (ViewContent event)
export const trackPageViewAPI = (url?: string, testMode: boolean = false) => {
  if (typeof window === 'undefined') return

  trackTikTokEventAPI('ViewContent', {
    content_type: 'page',
    content_name: document.title,
    url: url || window.location.href,
  }, undefined, testMode ? TIKTOK_TEST_EVENT_CODE : undefined)
}
