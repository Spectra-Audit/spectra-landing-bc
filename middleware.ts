import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './src/i18n/config'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Use 'as-needed' for better Netlify compatibility
  // This means the default locale (en) doesn't need a prefix
  localePrefix: 'as-needed',

  // Locale is pinned to the URL: one URL always serves one locale.
  //
  // This used to be `true`, which made the middleware 307-redirect by
  // `Accept-Language` — `GET /` with `Accept-Language: de` landed on `/de`.
  // Three problems with that:
  //
  //  1. The redirect response carried no `Vary: Accept-Language`, so any
  //     shared cache in front of the site (the CDN, a corporate proxy) could
  //     hand the German redirect to the next visitor regardless of their
  //     language.
  //  2. `/` is the canonical and `x-default` URL for the English page and is
  //     listed as such in the sitemap. A canonical URL that redirects
  //     elsewhere depending on a request header is not a stable canonical.
  //  3. Google asks specifically for no automatic redirection based on
  //     perceived user language, because it stops crawlers reaching every
  //     localized version:
  //     https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites#avoid-automatic-redirection
  //
  // Visitors still choose a language through the navbar's LanguageSelector,
  // which navigates to that locale's URL. hreflang (both the <link> tags and
  // the Link response header) is what points a search engine, or a visitor
  // arriving on the wrong one, at the right version.
  localeDetection: false,

  // No locale cookie either. With detection off nothing reads it: the locale
  // comes from the path on every request. Writing it anyway would mean
  // setting a cookie on first visit that changes no behaviour.
  localeCookie: false,

  // Optional: Configure alternate links
  alternateLinks: true
})

export const config = {
  // Match all pathnames except for:
  // - API routes (/api/*)
  // - Next.js internal routes (_next/*)
  // - Static files with extensions
  // - /sample-report, which lives in the `(root)` segment outside `[locale]`.
  //   Left in the matcher, next-intl would rewrite it to /en/sample-report and
  //   the request would 404, because there is no such route under `[locale]`.
  matcher: [
    // Match all paths that don't start with api, _next, or have a file extension
    '/((?!api|_next|_vercel|sample-report|.*\\..*).*)',
  ]
}
