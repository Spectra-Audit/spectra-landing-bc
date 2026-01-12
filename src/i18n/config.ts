export const defaultLocale = 'en'
export const locales = ['en', 'es', 'pt', 'fr', 'de', 'zh', 'ja', 'ko', 'ar', 'ru', 'tr', 'hi', 'bn', 'te', 'ta', 'mr'] as const
export type Locale = (typeof locales)[number]

// RTL (right-to-left) locales
export const rtlLocales = ['ar'] as const
export const isRtlLocale = (locale: Locale) => rtlLocales.includes(locale as any)

export const localeNames: Record<Locale, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  es: { native: 'Español', english: 'Spanish' },
  pt: { native: 'Português', english: 'Portuguese' },
  fr: { native: 'Français', english: 'French' },
  de: { native: 'Deutsch', english: 'German' },
  zh: { native: '简体中文', english: 'Chinese (Simplified)' },
  ja: { native: '日本語', english: 'Japanese' },
  ko: { native: '한국어', english: 'Korean' },
  ar: { native: 'العربية', english: 'Arabic' },
  ru: { native: 'Русский', english: 'Russian' },
  tr: { native: 'Türkçe', english: 'Turkish' },
  hi: { native: 'हिन्दी', english: 'Hindi' },
  bn: { native: 'বাংলা', english: 'Bengali' },
  te: { native: 'తెలుగు', english: 'Telugu' },
  ta: { native: 'தமிழ்', english: 'Tamil' },
  mr: { native: 'मराठी', english: 'Marathi' }
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  pt: '🇧🇷',
  fr: '🇫🇷',
  de: '🇩🇪',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷',
  ar: '🇸🇦',
  ru: '🇷🇺',
  tr: '🇹🇷',
  hi: '🇮🇳',
  bn: '🇧🇩',
  te: '🇮🇳',
  ta: '🇱🇰',
  mr: '🇮🇳'
}