import { useEffect } from 'react'

let lockDepth = 0
let lockedScrollY = 0

type HtmlBodyStyleSnapshot = {
  htmlOverflow: string
  htmlOverscroll: string
  bodyOverflow: string
  bodyPosition: string
  bodyTop: string
  bodyLeft: string
  bodyRight: string
  bodyWidth: string
}

let snapshot: HtmlBodyStyleSnapshot | null = null

function applyDocumentScrollLock() {
  const html = document.documentElement
  const body = document.body
  lockedScrollY = window.scrollY

  snapshot = {
    htmlOverflow: html.style.overflow,
    htmlOverscroll: html.style.overscrollBehavior,
    bodyOverflow: body.style.overflow,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyWidth: body.style.width,
  }

  html.style.overflow = 'hidden'
  html.style.overscrollBehavior = 'none'
  body.style.overflow = 'hidden'
  body.style.position = 'fixed'
  body.style.top = `-${lockedScrollY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
}

function releaseDocumentScrollLock() {
  const html = document.documentElement
  const body = document.body
  const y = lockedScrollY

  if (snapshot) {
    html.style.overflow = snapshot.htmlOverflow
    html.style.overscrollBehavior = snapshot.htmlOverscroll
    body.style.overflow = snapshot.bodyOverflow
    body.style.position = snapshot.bodyPosition
    body.style.top = snapshot.bodyTop
    body.style.left = snapshot.bodyLeft
    body.style.right = snapshot.bodyRight
    body.style.width = snapshot.bodyWidth
    snapshot = null
  }

  window.scrollTo(0, y)
}

/**
 * Kunci scroll halaman (html + body), aman untuk iOS: `position: fixed` + restore scroll.
 * Mendukung beberapa modal bersamaan via depth counter.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    if (lockDepth === 0) {
      applyDocumentScrollLock()
    }
    lockDepth += 1

    return () => {
      lockDepth -= 1
      if (lockDepth === 0) {
        releaseDocumentScrollLock()
      }
    }
  }, [locked])
}
