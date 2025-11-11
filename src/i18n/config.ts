export const defaultLocale = 'en'
export const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ko'] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  es: { native: 'Español', english: 'Spanish' },
  fr: { native: 'Français', english: 'French' },
  de: { native: 'Deutsch', english: 'German' },
  ja: { native: '日本語', english: 'Japanese' },
  zh: { native: '简体中文', english: 'Chinese' },
  ko: { native: '한국어', english: 'Korean' }
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  ja: '🇯🇵',
  zh: '🇨🇳',
  ko: '🇰🇷'
}