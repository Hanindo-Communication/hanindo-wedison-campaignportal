'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageViewAPI } from '@/utils/analytics'

export default function TikTokPageView() {
  const pathname = usePathname()

  useEffect(() => {
    trackPageViewAPI()
  }, [pathname])

  return null
}
