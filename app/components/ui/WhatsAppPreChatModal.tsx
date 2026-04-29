'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCreditCard, FiMapPin, FiMessageCircle, FiNavigation, FiX } from 'react-icons/fi'
import {
  WHATSAPP_PREFILTER_FIELDS,
  WHATSAPP_PREFILTER_INTENTS,
  PRECHAT_UI,
  validatePrefilterField,
  buildPrefilterUrlFromPayload,
  buildPrechatSheetPayload,
  isFieldRequired,
  isTanggalPrefilterVisible,
  type OpenPreChatPayload,
  type WhatsAppPrefilterIntentId,
  type PrefilterFieldId,
  type PrefilterFieldDef,
} from '@/lib/whatsappPreFilterConfig'
import { trackWhatsAppPreChatSubmit } from '@/utils/analytics'
import type { AdAttribution } from '@/lib/adSourceFromUrl'
import type { IconType } from 'react-icons'
import PrechatDatePicker from '@/app/components/ui/PrechatDatePicker'
import { useScrollLock } from '@/lib/useScrollLock'

const INTENT_ICON: Record<WhatsAppPrefilterIntentId, IconType> = {
  explore: FiMessageCircle,
  test_drive: FiNavigation,
  showroom: FiMapPin,
  financing_rent: FiCreditCard,
}

const emptyFields = (): Record<PrefilterFieldId, string> => ({
  nama: '',
  telepon: '',
  kebutuhan: '',
  lokasiKota: '',
  tanggalPreferensi: '',
})

export type WhatsAppPreChatModalProps = {
  open: boolean
  onClose: () => void
  payload: OpenPreChatPayload | null
  attribution: AdAttribution
  intentId: WhatsAppPrefilterIntentId | null
  setIntentId: (id: WhatsAppPrefilterIntentId | null) => void
  fieldValues: Record<PrefilterFieldId, string>
  setFieldValues: React.Dispatch<React.SetStateAction<Record<PrefilterFieldId, string>>>
  fieldErrors: Partial<Record<PrefilterFieldId, string>>
  setFieldErrors: React.Dispatch<React.SetStateAction<Partial<Record<PrefilterFieldId, string>>>>
}

/** Input & tombol utama: ukuran nyaman untuk lansia (min ~48px sentuh). */
const inputBase =
  'w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-3 text-base text-slate-800 outline-none transition focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/15'

export default function WhatsAppPreChatModal({
  open,
  onClose,
  payload,
  attribution,
  intentId,
  setIntentId,
  fieldValues,
  setFieldValues,
  fieldErrors,
  setFieldErrors,
}: WhatsAppPreChatModalProps) {
  const ui = PRECHAT_UI
  const [showSubmitHints, setShowSubmitHints] = useState(false)
  const minDate = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  const namaField = WHATSAPP_PREFILTER_FIELDS.find((f) => f.id === 'nama')!
  const teleponField = WHATSAPP_PREFILTER_FIELDS.find((f) => f.id === 'telepon')!
  const kebutuhanField = WHATSAPP_PREFILTER_FIELDS.find((f) => f.id === 'kebutuhan')!
  const tanggalField = WHATSAPP_PREFILTER_FIELDS.find((f) => f.id === 'tanggalPreferensi')!
  const lokasiField = WHATSAPP_PREFILTER_FIELDS.find((f) => f.id === 'lokasiKota')!

  const kebutuhanAtOpenRef = useRef('')
  const prevOpenRef = useRef(false)

  useEffect(() => {
    if (open && !prevOpenRef.current) {
      kebutuhanAtOpenRef.current = fieldValues.kebutuhan
    }
    prevOpenRef.current = open
  }, [open, fieldValues.kebutuhan])

  const showSmartFillNote =
    open &&
    kebutuhanAtOpenRef.current.length >= 10 &&
    fieldValues.kebutuhan === kebutuhanAtOpenRef.current

  useEffect(() => {
    if (!open) return
    setShowSubmitHints(false)
  }, [open])

  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const intent = intentId
    ? WHATSAPP_PREFILTER_INTENTS.find((i) => i.id === intentId)
    : undefined

  const showVisitFields = isTanggalPrefilterVisible(intentId)

  const clearFieldError = (id: PrefilterFieldId) => {
    setFieldErrors((prev) => {
      const n = { ...prev }
      delete n[id]
      return n
    })
  }

  const patchField = (id: PrefilterFieldId, value: string) => {
    setFieldValues((prev) => ({ ...prev, [id]: value }))
    clearFieldError(id)
  }

  const renderField = (f: PrefilterFieldDef, opts?: { dateMin?: string }) => {
    const req = isFieldRequired(f, intentId)
    const errKey = fieldErrors[f.id]
    const errMsg = errKey
      ? ui.errors[errKey as keyof typeof ui.errors] ?? ui.errors.required
      : null

    return (
      <div key={f.id} className="min-w-0">
        <label
          id={`prechat-${f.id}-label`}
          className="mb-1 block text-sm font-medium text-slate-800"
          htmlFor={f.type === 'choice' ? undefined : `prechat-${f.id}`}
        >
          {f.label}
          {req ? <span className="text-red-500"> *</span> : null}
        </label>
        {f.type === 'textarea' ? (
          <textarea
            id={`prechat-${f.id}`}
            rows={3}
            value={fieldValues[f.id]}
            onChange={(e) => patchField(f.id, e.target.value)}
            placeholder={f.placeholder}
            className={`${inputBase} min-h-[5.5rem] resize-y leading-snug`}
          />
        ) : f.type === 'choice' && f.choices?.length ? (
          <div role="radiogroup" aria-labelledby={`prechat-${f.id}-label`} className="grid grid-cols-2 gap-2">
            {f.choices.map((c) => {
              const picked = fieldValues[f.id] === c.value
              return (
                <button
                  key={c.value}
                  type="button"
                  role="radio"
                  aria-checked={picked}
                  onClick={() => patchField(f.id, c.value)}
                  className={`min-h-[48px] rounded-xl border-2 px-3 py-3 text-center text-base font-semibold transition ${
                    picked
                      ? 'border-electric-blue bg-electric-blue/5 text-electric-blue'
                      : 'border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        ) : f.type === 'date' ? (
          <PrechatDatePicker
            id={`prechat-${f.id}`}
            value={fieldValues[f.id]}
            min={opts?.dateMin ?? minDate}
            onChange={(iso) => patchField(f.id, iso)}
            hasError={!!errMsg}
          />
        ) : (
          <input
            id={`prechat-${f.id}`}
            type={f.type === 'tel' ? 'tel' : 'text'}
            autoComplete={f.id === 'telepon' ? 'tel' : f.id === 'nama' ? 'name' : 'off'}
            value={fieldValues[f.id]}
            onChange={(e) => patchField(f.id, e.target.value)}
            placeholder={f.placeholder}
            className={`${inputBase} min-h-[44px]`}
          />
        )}
        {f.helper ? <p className="mt-1 text-xs leading-snug text-slate-600">{f.helper}</p> : null}
        {errMsg ? <p className="mt-1 text-xs text-red-600">{errMsg}</p> : null}
        {f.id === 'kebutuhan' && showSmartFillNote ? (
          <p className="mt-1.5 text-xs leading-snug text-slate-500">{ui.smartFillNote}</p>
        ) : null}
      </div>
    )
  }

  const runFieldValidation = (): boolean => {
    if (!intentId) return false
    const next: Partial<Record<PrefilterFieldId, string>> = {}
    for (const f of WHATSAPP_PREFILTER_FIELDS) {
      if (f.id === 'tanggalPreferensi' && !isTanggalPrefilterVisible(intentId)) continue
      if (f.id === 'lokasiKota' && !isTanggalPrefilterVisible(intentId)) continue
      const code = validatePrefilterField(f.id, fieldValues[f.id] ?? '', intentId)
      if (code) next[f.id] = code
    }
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = () => {
    setShowSubmitHints(true)
    if (!payload) return
    if (!intentId) {
      setFieldErrors({})
      return
    }
    if (!intent) return
    if (!runFieldValidation()) return
    const url = buildPrefilterUrlFromPayload(payload, attribution, intent, fieldValues)
    trackWhatsAppPreChatSubmit(intent.id, intent.tier, attribution.platformKey)
    const sheetBody = buildPrechatSheetPayload({
      intent,
      fieldValues,
      attribution,
      payloadKind: payload.kind,
    })
    void fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheetBody),
      keepalive: true,
    }).catch(() => {})
    window.location.assign(url)
  }

  const panelVariants = {
    initial: { opacity: 0, scale: 0.96, y: 10 },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 480, damping: 28 },
    },
    closed: {
      opacity: 0,
      scale: 0.98,
      y: 8,
      transition: { duration: 0.16 },
    },
  }

  return (
    <AnimatePresence>
      {open && payload ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="prechat-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/55 p-3 py-8 backdrop-blur-[2px] sm:items-center sm:p-5 sm:py-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            className="relative my-auto w-full max-w-[min(100%,480px)] max-h-[min(88dvh,720px)] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl ring-1 ring-slate-900/[0.04] sm:max-h-[min(90vh,820px)] sm:max-w-[600px] sm:p-6 lg:max-w-[680px]"
            variants={panelVariants}
            initial="initial"
            animate="open"
            exit="closed"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label={ui.close}
            >
              <FiX className="h-5 w-5" />
            </button>

            <header className="min-w-0 pr-12">
              <h2 id="prechat-title" className="text-xl font-bold leading-tight text-slate-900">
                {ui.modalTitle}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{ui.modalSubtitle}</p>
            </header>

            <section className="mt-4 border-t border-slate-100 pt-4" aria-labelledby="prechat-intent-heading">
              <h3 id="prechat-intent-heading" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {ui.sectionIntent}
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {WHATSAPP_PREFILTER_INTENTS.map((opt) => {
                  const selected = intentId === opt.id
                  const Icon = INTENT_ICON[opt.id]
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setIntentId(opt.id)
                        if (!isTanggalPrefilterVisible(opt.id)) {
                          setFieldValues((prev) => ({
                            ...prev,
                            tanggalPreferensi: '',
                            lokasiKota: '',
                          }))
                        }
                        setFieldErrors((prev) => {
                          const n = { ...prev }
                          delete n.tanggalPreferensi
                          delete n.lokasiKota
                          return n
                        })
                      }}
                      className={`flex min-h-[52px] min-w-0 w-full items-center gap-2.5 rounded-lg border-2 px-2.5 py-2.5 text-left text-sm font-semibold leading-snug transition ${
                        selected
                          ? 'border-electric-blue bg-electric-blue/5 text-electric-blue'
                          : 'border-slate-200 text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${
                          selected
                            ? 'bg-white/80 text-electric-blue ring-electric-blue/25'
                            : 'bg-slate-50 text-slate-500 ring-slate-200/80'
                        }`}
                        aria-hidden
                      >
                        <Icon className="h-[18px] w-[18px] stroke-[2]" />
                      </span>
                      <span className="min-w-0 flex-1 break-words text-pretty">{opt.shortLabel}</span>
                    </button>
                  )
                })}
              </div>
              {showSubmitHints && !intentId ? (
                <p className="mt-2 text-xs text-red-600">{ui.errors.pick_intent}</p>
              ) : null}
            </section>

            {showVisitFields ? (
              <section className="mt-4 border-t border-slate-100 pt-4" aria-labelledby="prechat-visit-heading">
                <h3 id="prechat-visit-heading" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {ui.sectionVisit}
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {renderField(lokasiField)}
                  {renderField(tanggalField, { dateMin: minDate })}
                </div>
              </section>
            ) : null}

            <section className="mt-4 border-t border-slate-100 pt-4" aria-labelledby="prechat-data-heading">
              <h3 id="prechat-data-heading" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {ui.sectionData}
              </h3>
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {renderField(namaField)}
                  {renderField(teleponField)}
                </div>
                {renderField(kebutuhanField)}
              </div>
            </section>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={submit}
                className="min-h-[52px] w-full rounded-full bg-success-green py-3 text-base font-semibold text-white shadow-md transition hover:bg-green-600"
              >
                {ui.submit}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export { emptyFields }
