'use client'

import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'

export const SECTION_REVEAL_VIEWPORT = { once: true, margin: '-80px' } as const

export type SectionRevealMotionProps = {
  initial: false | { opacity: number; y: number }
  whileInView: { opacity: number; y: number }
  viewport: typeof SECTION_REVEAL_VIEWPORT
  transition: { duration: number; ease?: number[]; delay?: number }
}

export function getSectionRevealMotion(reduceMotion: boolean): SectionRevealMotionProps {
  if (reduceMotion) {
    return {
      initial: false,
      whileInView: { opacity: 1, y: 0 },
      viewport: SECTION_REVEAL_VIEWPORT,
      transition: { duration: 0 },
    }
  }
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: SECTION_REVEAL_VIEWPORT,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }
}

export function useSectionRevealMotion(): SectionRevealMotionProps {
  const reduceMotion = useReducedMotion()
  return useMemo(() => getSectionRevealMotion(reduceMotion === true), [reduceMotion])
}

/** Scroll-reveal dengan delay bertingkat per indeks kartu */
export function getStaggeredItemReveal(
  reduceMotion: boolean,
  index: number,
  staggerSec = 0.07,
): SectionRevealMotionProps {
  const base = getSectionRevealMotion(reduceMotion)
  return {
    ...base,
    transition: {
      duration: base.transition.duration,
      ...(base.transition.ease !== undefined ? { ease: base.transition.ease } : {}),
      delay: reduceMotion ? 0 : index * staggerSec,
    },
  }
}
