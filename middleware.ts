import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './src/i18n/config'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Use 'always' to ensure locale is always in the URL for proper routing
  localePrefix: 'always',

  // Optional: Configure locale detection
  localeDetection: true,

  // Optional: Configure alternate links
  alternateLinks: true
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)']
}