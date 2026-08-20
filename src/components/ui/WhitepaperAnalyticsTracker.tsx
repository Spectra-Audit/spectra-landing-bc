'use client'

import { useEffect } from 'react'
import { useUmamiAnalytics } from '@/hooks/useUmamiAnalytics'

/**
 * Render-nothing client island for the whitepaper page's page-view /
 * whitepaper-viewed analytics side effect. Extracted so the whitepaper page
 * itself could become a Server Component.
 *
 * NOTE: the `'en'` language argument to `trackWhitepaperViewed` is carried
 * over unchanged from the original inline effect (its own comment already
 * flagged it as "will be dynamic based on locale" — a pre-existing TODO,
 * not something introduced by this extraction).
 */
export default function WhitepaperAnalyticsTracker() {
  const { trackPageView, trackWhitepaperViewed } = useUmamiAnalytics()

  useEffect(() => {
    trackPageView('whitepaper', document.referrer)
    trackWhitepaperViewed('en') // Will be dynamic based on locale
  }, [])

  return null
}
