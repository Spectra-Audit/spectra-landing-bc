// Canonical production origin. The apex domain 308-redirects to www, so every
// URL we expose to crawlers (canonical, hreflang, sitemap, schema) must use www.
export const SITE_URL = 'https://www.spectra-audit.com'

// With localePrefix 'as-needed' the default locale is served unprefixed, so its
// canonical must be '/' — '/en' is a redirect and must never be declared canonical.
export const localePath = (locale: string, sub = '') =>
  locale === 'en' ? sub || '/' : `/${locale}${sub}`

export const absoluteLocaleUrl = (locale: string, sub = '') =>
  `${SITE_URL}${localePath(locale, sub) === '/' ? '/' : localePath(locale, sub)}`
