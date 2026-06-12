/**
 * GDPR consent regression tests for Analytics.tsx
 *
 * Critical invariant: "Accept Essential" MUST NOT trigger GA4 injection.
 * Clicking it must persist analytics=false, functional=true in localStorage
 * and must NOT call document.head.appendChild with a googletagmanager script.
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Analytics from '@/components/ui/Analytics'

// next-intl is mocked globally in jest.setup.js (key → key), but Analytics
// uses a different namespace, so ensure it is satisfied.

describe('Analytics consent banner', () => {
  // Spy on document.head.appendChild — the actual sink loadAnalytics() uses
  // to inject the GA4 <script src="googletagmanager.com/..."> element.
  let appendChildSpy: jest.SpyInstance

  beforeEach(() => {
    localStorage.clear()
    // Remove any script tags that may have been appended in a prior test.
    document
      .querySelectorAll('script[src*="googletagmanager"], script[data-gtag]')
      .forEach((el) => el.remove())

    // Spy on the real injection sink — calls through so other head appends
    // (e.g. React internals) are unaffected. We only inspect the arguments
    // to detect GA4 script injection.
    appendChildSpy = jest.spyOn(document.head, 'appendChild')
  })

  afterEach(() => {
    appendChildSpy.mockRestore()
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
    // This assertion is independent of the NODE_ENV production guard inside
    // loadAnalytics(). Even if that guard were removed, the spy would catch
    // any call to document.head.appendChild with a <script> whose src points
    // to googletagmanager. The persisted analytics=false remains the canonical
    // contract check; the spy-based assertion is a structurally independent
    // proof that the injection sink is never reached for essential-only consent.
    render(<Analytics />)

    fireEvent.click(screen.getByText('acceptEssential'))

    const stored = JSON.parse(localStorage.getItem('cookie_consent') ?? 'null')
    // analytics must be false — loadAnalytics() must NOT have been called.
    expect(stored.analytics).toBe(false)

    // Independent structural proof: document.head.appendChild must NOT have
    // been called with a script element whose src targets googletagmanager.
    const gtagAppendCalls = appendChildSpy.mock.calls.filter(([node]) => {
      return (
        node instanceof HTMLScriptElement &&
        typeof node.src === 'string' &&
        node.src.includes('googletagmanager')
      )
    })
    expect(gtagAppendCalls).toHaveLength(0)
  })

  it('"Accept All" persists analytics=true and DOES inject a GA4 script tag in production', () => {
    // Force production mode so loadAnalytics() does not early-return, and
    // provide a GA ID so the script-creation branch is entered.
    const originalNodeEnv = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true,
    })
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123'

    try {
      render(<Analytics />)
      fireEvent.click(screen.getByText('acceptAll'))

      const stored = JSON.parse(localStorage.getItem('cookie_consent') ?? 'null')
      expect(stored.analytics).toBe(true)
      expect(stored.marketing).toBe(true)
      expect(stored.functional).toBe(true)

      // The GA4 script MUST have been appended via document.head.appendChild.
      const gtagAppendCalls = appendChildSpy.mock.calls.filter(([node]) => {
        return (
          node instanceof HTMLScriptElement &&
          typeof node.src === 'string' &&
          node.src.includes('googletagmanager')
        )
      })
      expect(gtagAppendCalls.length).toBeGreaterThan(0)
    } finally {
      // Always restore env, even on assertion failure.
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalNodeEnv,
        writable: true,
        configurable: true,
      })
      delete process.env.NEXT_PUBLIC_GA_ID
    }
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
