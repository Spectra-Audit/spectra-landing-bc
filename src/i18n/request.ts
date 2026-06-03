import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` resolves to the locale the middleware matched for this
  // request, or to an explicit locale passed to awaitable next-intl APIs
  // (e.g. getTranslations({ locale })). The deprecated `locale` param is only
  // populated for the latter, so reading it alone left getLocale() — which
  // passes no explicit locale — always falling back to the default locale.
  const requested = await requestLocale
  const safeLocale = requested && locales.includes(requested as any) ? requested : defaultLocale

  try {
    // Import the messages for the requested locale
    const messages = (await import(`./locales/${safeLocale}.json`)).default

    return {
      messages,
      timeZone: 'UTC',
      locale: safeLocale, // Explicitly set the locale
      defaultLocale,
      // Fallback to default locale if translation is missing
      getMessageFallback: ({ key, namespace }) => {
        if (namespace) {
          return `${namespace}.${key}`
        }
        return key
      }
    }
  } catch (error) {
    console.warn(`Failed to load locale "${safeLocale}", falling back to "${defaultLocale}"`, error)

    // Fallback to default locale
    const messages = (await import(`./locales/${defaultLocale}.json`)).default

    return {
      messages,
      timeZone: 'UTC',
      locale: defaultLocale,
      defaultLocale,
      getMessageFallback: ({ key, namespace }) => {
        if (namespace) {
          return `${namespace}.${key}`
        }
        return key
      }
    }
  }
})