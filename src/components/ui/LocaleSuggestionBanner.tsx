'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { X, Languages } from 'lucide-react'
import { locales, isRtlLocale, localeSuggestions, type Locale } from '@/i18n/config'
import { localePath } from '@/lib/site'
import { readStoredConsent } from '@/lib/consent'

/**
 * "Read this page in <language>" — the hint that replaces the old redirect.
 *
 * The middleware used to send `GET /` to `/de` based on `Accept-Language`
 * (see `middleware.ts` for why that had to stop: an uncacheable redirect on
 * the canonical URL, and crawlers bounced off every other locale). The
 * language preference in the browser is still useful information, so it is
 * offered here as a link the visitor can take or dismiss, instead of being
 * applied to them. This is the shape Google asks for.
 *
 * Client-only by necessity — `navigator.languages` does not exist on the
 * server, and a server-rendered banner would have to vary by request header,
 * which is the cacheability problem all over again. It renders `null` until
 * the effect runs, so the prerendered HTML (and therefore hydration) is
 * unaffected.
 */

const DISMISSED_STORAGE_KEY = 'spectra_locale_hint_dismissed'

/**
 * The locale to offer, or `null` to stay quiet.
 *
 * Exact tags win over base languages, so `pt-BR` prefers `pt` over a later
 * `pt`-adjacent entry, and the first preference that maps to a locale we
 * actually publish decides the answer. Returning `null` when the best match
 * IS the current locale is what keeps the banner off 15 of 16 locales for
 * any given visitor.
 *
 * Exported for the unit test: this is the part with the branches, and it is
 * pure, so it does not need a DOM to check.
 */
export function pickSuggestedLocale(
  preferred: readonly string[],
  current: string
): Locale | null {
  for (const tag of preferred) {
    const normalized = tag.toLowerCase()
    const base = normalized.split('-')[0]

    const match = (locales as readonly string[]).includes(normalized)
      ? (normalized as Locale)
      : (locales as readonly string[]).includes(base)
        ? (base as Locale)
        : null

    if (match) return match === current ? null : match
  }

  return null
}

/**
 * Where the banner points. Deliberately an allow-list rather than a rewrite
 * of the current path: the site has exactly two pages, so there is no reason
 * to reconstruct a URL out of `usePathname()` and then have to prove the
 * result is safe (`LanguageSelector` carries a whole sanitizer and a security
 * test for doing that). Anything unrecognized falls back to the locale root.
 */
function suggestionHref(pathname: string, target: Locale): string {
  const withoutLocale = pathname.replace(
    new RegExp(`^/(?:${locales.join('|')})(?=/|$)`),
    ''
  )

  return withoutLocale === '/whitepaper'
    ? localePath(target, '/whitepaper')
    : localePath(target)
}

/**
 * Reads the browser's state and decides whether to offer anything. Returns a
 * plain string or null, so `useSyncExternalStore` can compare snapshots by
 * identity without any caching of its own.
 */
function readSuggestion(locale: string): Locale | null {
  // The cookie banner is a full-width bar at the bottom of the viewport and
  // owns that space until it is answered. Until then this one stays out of the
  // way rather than stacking a second decision on top of the first.
  if (readStoredConsent() === null) return null

  try {
    if (localStorage.getItem(DISMISSED_STORAGE_KEY) === '1') return null
  } catch {
    // Storage can throw (Safari private mode, blocked third-party context).
    // Not being able to read the dismissal is not a reason to hide the hint.
  }

  const preferred = navigator.languages?.length
    ? navigator.languages
    : [navigator.language].filter(Boolean)

  return pickSuggestedLocale(preferred, locale)
}

// Nothing to subscribe to: the three inputs (stored consent, the dismissal
// flag, the browser's language list) do not change under us during a page
// view. The store exists for its server snapshot — `null`, so the prerendered
// HTML carries no banner and hydration has nothing to reconcile.
const noopSubscribe = () => () => {}

export default function LocaleSuggestionBanner() {
  const locale = useLocale()
  const pathname = usePathname()
  // `useState` for the dismissal, set from a click handler rather than from an
  // effect, which is what keeps this component out of a cascading render.
  const [dismissed, setDismissed] = useState(false)

  const suggested = useSyncExternalStore(
    noopSubscribe,
    () => readSuggestion(locale),
    () => null
  )

  if (dismissed || !suggested) return null

  const { message, dismiss } = localeSuggestions[suggested]

  const remember = () => {
    setDismissed(true)
    try {
      // A "do not show me this again" flag for a banner the visitor just
      // closed: it is the UI they asked for, holds no identifier, and is read
      // by nothing but this component — so it is not in
      // NON_ESSENTIAL_STORAGE_KEYS and does not wait on analytics consent.
      localStorage.setItem(DISMISSED_STORAGE_KEY, '1')
    } catch {
      // Dismissal then lasts for this page view only, which is still better
      // than refusing to close.
    }
  }

  return (
    <div
      role="region"
      aria-label={message}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur-sm dark:border-white/10 dark:bg-ink-900/95"
    >
      <div className="max-w-5xl mx-auto flex items-center gap-3 px-4 py-3 sm:px-6">
        <Languages
          className="w-5 h-5 flex-shrink-0 text-spectra-blue-600 dark:text-spectra-blue-400"
          aria-hidden="true"
        />

        <Link
          href={suggestionHref(pathname, suggested)}
          hrefLang={suggested}
          lang={suggested}
          dir={isRtlLocale(suggested) ? 'rtl' : 'ltr'}
          onClick={remember}
          className="flex-1 text-sm font-medium text-neutral-800 underline decoration-spectra-blue-500/40 underline-offset-4 hover:text-spectra-blue-600 dark:text-neutral-100 dark:hover:text-spectra-blue-400"
        >
          {message}
        </Link>

        <button
          type="button"
          onClick={remember}
          lang={suggested}
          aria-label={dismiss}
          className="flex-shrink-0 rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
