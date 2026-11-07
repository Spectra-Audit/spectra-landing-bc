/**
 * SSR/hydration regression test for the consent banner (SPE-18).
 *
 * The landing pages are prerendered, and the server cannot read localStorage.
 * If the banner's visibility is decided during render, the banner is baked into
 * the static HTML for *every* visitor. A returning visitor's first client
 * render then disagrees with that markup and the stale banner survives as dead
 * DOM — which is exactly the reported bug: it "re-appears despite Accept All"
 * and its buttons do nothing.
 *
 * The invariant that prevents it: the server render emits no banner at all.
 */
import React from 'react'
import { renderToString } from 'react-dom/server'
import Analytics from '@/components/ui/Analytics'

describe('Analytics server render (SPE-18)', () => {
  it('emits no banner markup on the server', () => {
    const html = renderToString(<Analytics />)

    // Button labels come through the next-intl mock as raw keys.
    expect(html).not.toContain('rejectAll')
    expect(html).not.toContain('acceptAll')
    expect(html).not.toContain('acceptEssential')
    expect(html).toBe('')
  })
})
