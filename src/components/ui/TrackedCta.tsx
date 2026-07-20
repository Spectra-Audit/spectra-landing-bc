'use client'

import React from 'react'
import Button, { type ButtonProps } from './Button'
import { useUmamiAnalytics } from '@/hooks/useUmamiAnalytics'

type TrackedCtaAction =
  // Opens an external/app URL in a new tab.
  | { type: 'openUrl'; url: string }
  // Smooth-scrolls to an in-page element id.
  | { type: 'scrollTo'; targetId: string }

export interface TrackedCtaProps extends Omit<ButtonProps, 'onClick'> {
  action: TrackedCtaAction
  /**
   * When set, fires `trackHeroCtaClicked(label, variant)` before running
   * `action`. Omit for CTAs that don't need hero-CTA analytics (e.g. the
   * "how scores work" and final-section explore buttons, which only ever
   * open the app URL).
   */
  heroCta?: { label: string; variant: 'primary' | 'secondary' }
  children: React.ReactNode
}

/**
 * Thin client wrapper around `Button` for the handful of CTAs on the
 * (Server Component) home page that need a real `onClick` — analytics
 * tracking and/or `window.open` / `scrollIntoView`. `Button` itself has no
 * `'use client'` directive, so attaching an event handler to it directly
 * from a Server Component isn't possible; this island is the boundary.
 *
 * Takes already-translated label/analytics text as plain props from the
 * server parent rather than pulling a next-intl provider into the client
 * bundle — there's nothing else in the tree that needs translations on the
 * client here, so a nested `NextIntlClientProvider` would only add bytes.
 */
export default function TrackedCta({ action, heroCta, children, ...buttonProps }: TrackedCtaProps) {
  const { trackHeroCtaClicked } = useUmamiAnalytics()

  const handleClick = () => {
    if (heroCta) {
      trackHeroCtaClicked(heroCta.label, heroCta.variant)
    }

    if (action.type === 'openUrl') {
      window.open(action.url, '_blank')
    } else {
      document.getElementById(action.targetId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Button onClick={handleClick} {...buttonProps}>
      {children}
    </Button>
  )
}
