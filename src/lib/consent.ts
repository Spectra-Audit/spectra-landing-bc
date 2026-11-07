/**
 * Single source of truth for the cookie-consent contract.
 *
 * Both the banner (components/ui/Analytics.tsx) and every consumer of
 * non-essential storage (providers/UmamiProvider.tsx) read consent through
 * here, so "did the visitor agree?" is answered the same way everywhere.
 */

export interface ConsentData {
  analytics: boolean
  marketing: boolean
  functional: boolean
  timestamp: number
}

export const CONSENT_STORAGE_KEY = 'cookie_consent'

/**
 * Client-side storage that is NOT strictly necessary to serve the site, and so
 * requires consent under GDPR/ePrivacy. Keep this list in sync with anything
 * that writes analytics identifiers.
 */
export const NON_ESSENTIAL_STORAGE_KEYS = [
  'umami_session_id',
  'umami_user_id',
  'umami_wallet_hash',
  'umami_session_returning',
] as const

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

/** Returns the stored choice, or null when absent, malformed, or expired. */
export function readStoredConsent(): ConsentData | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    // A record without a usable timestamp cannot be aged out, so treat it as
    // no consent rather than as consent that never expires.
    if (typeof parsed?.timestamp !== 'number') return null
    if (Date.now() - parsed.timestamp >= ONE_YEAR_MS) return null
    return parsed as ConsentData
  } catch {
    return null
  }
}

/** True only when the visitor actively granted analytics consent. */
export function hasAnalyticsConsent(): boolean {
  return readStoredConsent()?.analytics === true
}

/**
 * "Reject All" must do more than stop future writes: it must also remove
 * non-essential storage already written under an earlier choice.
 */
export function clearNonEssentialStorage(): void {
  if (typeof window === 'undefined') return
  try {
    for (const key of NON_ESSENTIAL_STORAGE_KEYS) {
      localStorage.removeItem(key)
    }
  } catch {
    /* storage unavailable: nothing was persisted, nothing to clear */
  }
}
