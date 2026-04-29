'use client'

import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  Suspense,
  type ReactNode,
} from 'react'
import { useSearchParams } from 'next/navigation'
import {
  type AdAttribution,
  ORGANIC_ATTRIBUTION,
  parseAdAttributionFromUrl,
  resolveLandingAttribution,
} from '@/lib/adSourceFromUrl'
import {
  WHATSAPP_MESSAGES,
  buildPromo052026WhatsAppLink,
  buildWhatsAppLinkWithAttribution,
  type Promo052026MessageParts,
} from '@/utils/whatsappLinks'

const STORAGE_KEY = 'wedison_ad_attr_v1'

const AdAttributionContext = createContext<AdAttribution>(ORGANIC_ATTRIBUTION)

function readStoredAttribution(): AdAttribution | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AdAttribution
    if (parsed && typeof parsed.refCode === 'string' && typeof parsed.sourceLine === 'string') {
      return {
        ...parsed,
        platformKey: parsed.platformKey ?? 'organic',
      }
    }
  } catch {
    /* ignore */
  }
  return null
}

function AdAttributionProviderInner({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()

  const attribution = useMemo(() => {
    return resolveLandingAttribution(
      parseAdAttributionFromUrl(searchParams),
      readStoredAttribution(),
      searchParams
    )
  }, [searchParams])

  useEffect(() => {
    const merged = resolveLandingAttribution(
      parseAdAttributionFromUrl(searchParams),
      readStoredAttribution(),
      searchParams
    )
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    } catch {
      /* ignore */
    }
  }, [searchParams])

  return (
    <AdAttributionContext.Provider value={attribution}>{children}</AdAttributionContext.Provider>
  )
}

export function AdAttributionProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AdAttributionProviderInner>{children}</AdAttributionProviderInner>
    </Suspense>
  )
}

export function useAdAttribution(): AdAttribution {
  return useContext(AdAttributionContext)
}

export function useLandingWhatsApp() {
  const attribution = useAdAttribution()

  return useMemo(
    () => ({
      attribution,
      /** Prefill from a static template key in WHATSAPP_MESSAGES */
      linkFor: (messageKey: keyof typeof WHATSAPP_MESSAGES) =>
        buildWhatsAppLinkWithAttribution(WHATSAPP_MESSAGES[messageKey], attribution),
      linkForCustomMessage: (message: string) =>
        buildWhatsAppLinkWithAttribution(message, attribution),
      /** Promo Mei / ojol block — merges calculator fields + attribution */
      promo052026Link: (parts: Omit<Promo052026MessageParts, 'adSourceLine' | 'attribution'> = {}) =>
        buildPromo052026WhatsAppLink({
          ...parts,
          attribution,
        }),
    }),
    [attribution]
  )
}
