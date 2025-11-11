import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './config'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Optional: Configure path strategy
  localePrefix: 'as-needed', // or 'always', 'never'

  // Optional: Configure locale detection
  localeDetection: true,

  // Optional: Configure alternate links
  alternateLinks: true
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|fr|de|ja|zh|ko)/:path*']
}