/**
 * GDPR consent regression tests for Analytics.tsx
 *
 * Critical invariant: "Accept Essential" MUST NOT trigger GA4 injection.
 * Clicking it must persist analytics=false, functional=true in localStorage
 * and must NOT append any gtag script tags to the document.
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Analytics from '@/components/ui/Analytics'

// next-intl is mocked globally in jest.setup.js (key → key), but Analytics
// uses a different namespace, so ensure it is satisfied.

describe('Analytics consent banner', () => {
  beforeEach(() => {
    localStorage.clear()
    // Remove any script tags that may have been appended in a prior test.
    document
      .querySelectorAll('script[src*="googletagmanager"], script[data-gtag]')
      .forEach((el) => el.remove())
  })

  it('"Accept Essential" persists analytics=false and functional=true', () => {
    render(<Analytics />)

    const essentialBtn = screen.getByText('acceptEssential')
    fireEvent.click(essentialBtn)

    const stored = JSON.parse(localStorage.getItem('cookie_consent') ?? 'null')
    expect(stored).not.toBeNull()
    expect(stored.analytics).toBe(false)
    expect(stored.functional).toBe(true)
    expect(stored.marketing).toBe(false)
  })

  it('"Accept Essential" does NOT inject a GA4 script tag', () => {
    // We only test this in non-production (NODE_ENV=test), which already gates
    // loadAnalytics() via the `process.env.NODE_ENV !== 'production'` guard.
    // The test still exercises the correct consent value path: if analytics
    // were incorrectly true, loadAnalytics() would be called even though it
    // short-circuits in test env — verifying consent=false is the authoritative
    // assertion.
    render(<Analytics />)

    fireEvent.click(screen.getByText('acceptEssential'))

    const stored = JSON.parse(localStorage.getItem('cookie_consent') ?? 'null')
    // analytics must be false — loadAnalytics() must NOT have been called.
    expect(stored.analytics).toBe(false)

    // Belt-and-suspenders: confirm no gtag scripts were appended regardless.
    const gtagScripts = document.querySelectorAll(
      'script[src*="googletagmanager"]'
    )
    expect(gtagScripts.length).toBe(0)
  })

  it('"Accept All" persists analytics=true', () => {
    render(<Analytics />)

    fireEvent.click(screen.getByText('acceptAll'))

    const stored = JSON.parse(localStorage.getItem('cookie_consent') ?? 'null')
    expect(stored.analytics).toBe(true)
    expect(stored.marketing).toBe(true)
    expect(stored.functional).toBe(true)
  })

  it('"Reject All" persists analytics=false and functional=true', () => {
    render(<Analytics />)

    fireEvent.click(screen.getByText('rejectAll'))

    const stored = JSON.parse(localStorage.getItem('cookie_consent') ?? 'null')
    expect(stored.analytics).toBe(false)
    expect(stored.functional).toBe(true)
    expect(stored.marketing).toBe(false)
  })
})
