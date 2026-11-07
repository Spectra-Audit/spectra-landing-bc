/**
 * GDPR/ePrivacy regression tests for UmamiProvider.
 *
 * Invariant: no non-essential client-side storage may be written before the
 * visitor grants analytics consent, and none may survive "Reject All".
 * `umami_session_id` is a persistent analytics identifier, so writing it on
 * mount is exactly the violation SPE-18 reports.
 */
import React from 'react'
import { render } from '@testing-library/react'
import { UmamiProvider } from '@/providers/UmamiProvider'

const NON_ESSENTIAL_KEYS = [
  'umami_session_id',
  'umami_user_id',
  'umami_wallet_hash',
  'umami_session_returning',
]

function storedNonEssentialKeys(): string[] {
  return NON_ESSENTIAL_KEYS.filter((k) => localStorage.getItem(k) !== null)
}

describe('UmamiProvider consent gating', () => {
  beforeEach(() => localStorage.clear())

  it('writes no non-essential storage when no choice has been made yet', () => {
    render(
      <UmamiProvider>
        <div />
      </UmamiProvider>,
    )
    expect(storedNonEssentialKeys()).toEqual([])
  })

  it('removes non-essential storage left over from an earlier session', () => {
    // Simulate storage written by a previous (pre-fix) visit.
    localStorage.setItem('umami_session_id', 'sess_stale')
    localStorage.setItem('umami_user_id', 'user_stale')

    render(
      <UmamiProvider>
        <div />
      </UmamiProvider>,
    )
    expect(storedNonEssentialKeys()).toEqual([])
  })

  it('writes no non-essential storage after Reject All', () => {
    localStorage.setItem(
      'cookie_consent',
      JSON.stringify({
        analytics: false,
        marketing: false,
        functional: false,
        timestamp: Date.now(),
      }),
    )
    localStorage.setItem('umami_session_id', 'sess_stale')

    render(
      <UmamiProvider>
        <div />
      </UmamiProvider>,
    )
    expect(storedNonEssentialKeys()).toEqual([])
  })

  it('persists a session id once analytics consent is granted', () => {
    localStorage.setItem(
      'cookie_consent',
      JSON.stringify({
        analytics: true,
        marketing: false,
        functional: true,
        timestamp: Date.now(),
      }),
    )

    render(
      <UmamiProvider>
        <div />
      </UmamiProvider>,
    )
    expect(localStorage.getItem('umami_session_id')).toMatch(/^sess_/)
  })

  it('treats a consent record with no usable timestamp as no consent', () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ analytics: true }))

    render(
      <UmamiProvider>
        <div />
      </UmamiProvider>,
    )
    expect(storedNonEssentialKeys()).toEqual([])
  })
})
