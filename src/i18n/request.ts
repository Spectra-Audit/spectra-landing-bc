import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale } from './config'

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale
  const safeLocale = locale && locales.includes(locale as any) ? locale : defaultLocale

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