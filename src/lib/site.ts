// Canonical production origin. The apex domain 308-redirects to www, so every
// URL we expose to crawlers (canonical, hreflang, sitemap, schema) must use www.
export const SITE_URL = 'https://www.spectra-audit.com'

// With localePrefix 'as-needed' the default locale is served unprefixed, so its
// canonical must be '/' — '/en' is a redirect and must never be declared canonical.
export const localePath = (locale: string, sub = '') =>
  locale === 'en' ? sub || '/' : `/${locale}${sub}`

// THE one place a crawler-facing absolute URL is built (SPE-4 P0-3 / G5).
//
// We publish the NO-trailing-slash form: `https://www.spectra-audit.com`, not
// `.../`. That is not a style preference, it is what the platform already
// serves — `next.config.js` leaves `trailingSlash` at its default `false`, and
// Next's metadata layer resolves a canonical of '/' against `metadataBase`
// down to the bare origin. Picking the slash form would mean changing what
// production emits today; picking this one means everything else catches up to
// it, with no redirect hop on the single most-linked URL on the site.
//
// The bug this replaces: `localePath('en')` returns '/', and callers used to
// string-concatenate `${SITE_URL}${localePath(...)}` themselves. For every
// locale but `en` that is fine ('/de' -> '.../de'), but for the en home it
// produced `https://www.spectra-audit.com/` — so the sitemap and JSON-LD
// advertised a URL one byte different from the served canonical. Google treats
// those as two candidate URLs for one page and picks a winner itself.
//
// So: `localePath` stays the *relative* helper (an `<a href>` needs '/', not
// ''), and this is the *absolute* helper that collapses the root to the bare
// origin. Callers must never rebuild `${SITE_URL}${localePath(...)}` by hand.
export const absoluteLocaleUrl = (locale: string, sub = '') => {
  const path = localePath(locale, sub)
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`
}

// Collapses a bare-origin-root URL (`https://host/`) to the canonical bare
// origin (`https://host`), leaving every other URL untouched. Used to bring
// next-intl's `Link: rel="alternate"` header into line with the rest — see
// `middleware.ts` for why that header needs post-processing at all.
export const canonicalizeRootUrl = (url: string) =>
  url.replace(/^(https?:\/\/[^/?#]+)\/$/, '$1')
