'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useAdAttribution } from '@/app/contexts/AdAttributionContext'
import WhatsAppPreChatModal, { emptyFields } from '@/app/components/ui/WhatsAppPreChatModal'
import {
  computePreChatSmartDefaults,
  type OpenPreChatOptions,
  type PreChatBrowseSnapshot,
} from '@/lib/preChatSmartDefaults'
import type { OpenPreChatPayload } from '@/lib/whatsappPreFilterConfig'
import type { WhatsAppPrefilterIntentId } from '@/lib/whatsappPreFilterConfig'
import type { PrefilterFieldId } from '@/lib/whatsappPreFilterConfig'

export type { OpenPreChatOptions, PreChatBrowseSnapshot }

type WhatsAppPreChatContextValue = {
  openPreChat: (payload: OpenPreChatPayload, options?: OpenPreChatOptions) => void
  registerBrowseContext: (partial: Partial<PreChatBrowseSnapshot>) => void
}

const WhatsAppPreChatContext = createContext<WhatsAppPreChatContextValue | null>(null)

export function WhatsAppPreChatProvider({ children }: { children: ReactNode }) {
  const attribution = useAdAttribution()
  const browseRef = useRef<PreChatBrowseSnapshot>({})
  const [open, setOpen] = useState(false)
  const [payload, setPayload] = useState<OpenPreChatPayload | null>(null)
  const [intentId, setIntentId] = useState<WhatsAppPrefilterIntentId | null>(null)
  const [fieldValues, setFieldValues] = useState(() => emptyFields())
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<PrefilterFieldId, string>>>({})

  const registerBrowseContext = useCallback((partial: Partial<PreChatBrowseSnapshot>) => {
    browseRef.current = {
      ...browseRef.current,
      ...partial,
      updatedAt: Date.now(),
    }
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setPayload(null)
    setIntentId(null)
    setFieldValues(emptyFields())
    setFieldErrors({})
  }, [])

  const openPreChat = useCallback((p: OpenPreChatPayload, options?: OpenPreChatOptions) => {
    const defaults = computePreChatSmartDefaults(p, browseRef.current, options)
    setPayload(p)
    setIntentId(defaults.intentId)
    setFieldValues({ ...emptyFields(), kebutuhan: defaults.kebutuhan })
    setFieldErrors({})
    setOpen(true)
  }, [])

  const value = useMemo(
    () => ({ openPreChat, registerBrowseContext }),
    [openPreChat, registerBrowseContext]
  )

  return (
    <WhatsAppPreChatContext.Provider value={value}>
      {children}
      <WhatsAppPreChatModal
        open={open}
        onClose={close}
        payload={payload}
        attribution={attribution}
        intentId={intentId}
        setIntentId={setIntentId}
        fieldValues={fieldValues}
        setFieldValues={setFieldValues}
        fieldErrors={fieldErrors}
        setFieldErrors={setFieldErrors}
      />
    </WhatsAppPreChatContext.Provider>
  )
}

export function useWhatsAppPreChat(): WhatsAppPreChatContextValue {
  const ctx = useContext(WhatsAppPreChatContext)
  if (!ctx) {
    throw new Error('useWhatsAppPreChat must be used within WhatsAppPreChatProvider')
  }
  return ctx
}
