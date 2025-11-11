import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './src/i18n/config'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Optional: Configure path strategy
  localePrefix: 'as-needed', // 'always' or 'as-needed'

  // Optional: Configure locale detection
  localeDetection: true,

  // Optional: Configure alternate links
  alternateLinks: true
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)']
}