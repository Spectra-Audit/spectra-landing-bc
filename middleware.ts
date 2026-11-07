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

  // Optional: Configure locale detection
  localeDetection: true,

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