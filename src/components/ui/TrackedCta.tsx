'use client'

import React from 'react'
import Button, { type ButtonProps } from './Button'
import { useUmamiAnalytics } from '@/hooks/useUmamiAnalytics'

type TrackedCtaAction =
  // Links to an external/app URL, opened in a new tab.
  | { type: 'openUrl'; url: string }
  // Links to an in-page element id, smooth-scrolled when JS is running.
  | { type: 'scrollTo'; targetId: string }

// `action` is the single source of truth for where the CTA goes, so callers
// cannot pass a competing href/target/rel.
export interface TrackedCtaProps extends Omit<ButtonProps, 'onClick' | 'href' | 'target' | 'rel'> {
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
 * (Server Component) home page that need analytics tracking on click.
 * `Button` itself has no `'use client'` directive, so attaching an event
 * handler to it directly from a Server Component isn't possible; this
 * island is the boundary.
 *
 * Both actions render a real `<a href>` (see `Button`'s `href` prop) and
 * let the browser do the navigating, so the CTA still works before
 * hydration, with JS disabled, and via middle-click / cmd-click. The
 * handler only adds the analytics event and, for `scrollTo`, upgrades the
 * native fragment jump to a smooth scroll.
 *
 * Takes already-translated label/analytics text as plain props from the
 * server parent rather than pulling a next-intl provider into the client
 * bundle — there's nothing else in the tree that needs translations on the
 * client here, so a nested `NextIntlClientProvider` would only add bytes.
 */
/**
 * Only http(s) may reach an `href`. Every call site passes a hard-coded
 * literal today, but an `href` executes `javascript:`/`data:` URLs on click,
 * so the scheme is checked here rather than relying on that staying true.
 * A rejected URL renders as a plain `<button>` that goes nowhere, which is
 * visible in QA instead of silently exploitable.
 */
function safeHttpUrl(url: string): string | undefined {
  try {
    const { protocol } = new URL(url, 'https://www.spectra-audit.com')
    return protocol === 'https:' || protocol === 'http:' ? url : undefined
  } catch {
    return undefined
  }
}

export default function TrackedCta({ action, heroCta, children, ...buttonProps }: TrackedCtaProps) {
  const { trackHeroCtaClicked } = useUmamiAnalytics()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (heroCta) {
      trackHeroCtaClicked(heroCta.label, heroCta.variant)
    }

    if (action.type === 'scrollTo') {
      const target = document.getElementById(action.targetId)
      // Only take over from the browser when the target is actually there;
      // otherwise let the native `#id` jump do whatever it can.
      if (target) {
        event.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const linkProps =
    action.type === 'openUrl'
      ? { href: safeHttpUrl(action.url), target: '_blank' as const }
      : { href: `#${encodeURIComponent(action.targetId)}` }

  return (
    <Button onClick={handleClick} {...linkProps} {...buttonProps}>
      {children}
    </Button>
  )
}
