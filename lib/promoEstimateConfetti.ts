import type { Options } from 'canvas-confetti'

/** Brand-aligned palette for promo “surprise” bursts */
const COLORS = ['#0891B2', '#06B6D4', '#22C55E', '#FBBF24', '#F97316', '#FEF3C7', '#FFFFFF']

const base: Partial<Options> = {
  colors: COLORS,
  zIndex: 60,
  ticks: 260,
  gravity: 1.05,
  scalar: 1,
}

/**
 * Short party-popper style celebration (side cannons + light center sparkle).
 * Canvas is stacked above fixed chrome (e.g. nav at z-50).
 */
export async function firePromoEstimateConfetti(): Promise<void> {
  if (typeof window === 'undefined') return
  const confetti = (await import('canvas-confetti')).default

  confetti({
    ...base,
    particleCount: 130,
    spread: 68,
    startVelocity: 50,
    angle: 72,
    origin: { x: 0.06, y: 0.9 },
  })
  confetti({
    ...base,
    particleCount: 130,
    spread: 68,
    startVelocity: 50,
    angle: 108,
    origin: { x: 0.94, y: 0.9 },
  })

  window.setTimeout(() => {
    confetti({
      ...base,
      particleCount: 70,
      spread: 360,
      startVelocity: 28,
      origin: { x: 0.5, y: 0.42 },
      gravity: 0.95,
      scalar: 0.82,
      ticks: 200,
    })
  }, 120)
}
