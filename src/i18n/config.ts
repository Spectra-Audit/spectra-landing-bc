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

// Copy for the "read this page in <language>" banner (LocaleSuggestionBanner),
// keyed by the locale being SUGGESTED rather than by the locale of the page
// showing it — the whole point is to address a visitor in a language they
// read, on a page that is not in it. That is why these strings live here and
// not in `locales/*.json`: a message in `de.json` is only loaded when the page
// is already German, which is exactly when this banner does not appear.
export const localeSuggestions: Record<Locale, { message: string; dismiss: string }> = {
  en: { message: 'Read this page in English', dismiss: 'Close' },
  es: { message: 'Leer esta página en español', dismiss: 'Cerrar' },
  pt: { message: 'Ler esta página em português', dismiss: 'Fechar' },
  fr: { message: 'Lire cette page en français', dismiss: 'Fermer' },
  de: { message: 'Diese Seite auf Deutsch lesen', dismiss: 'Schließen' },
  zh: { message: '用简体中文阅读本页', dismiss: '关闭' },
  ja: { message: 'このページを日本語で読む', dismiss: '閉じる' },
  ko: { message: '이 페이지를 한국어로 보기', dismiss: '닫기' },
  ar: { message: 'اقرأ هذه الصفحة بالعربية', dismiss: 'إغلاق' },
  ru: { message: 'Читать эту страницу на русском', dismiss: 'Закрыть' },
  tr: { message: 'Bu sayfayı Türkçe okuyun', dismiss: 'Kapat' },
  hi: { message: 'इस पृष्ठ को हिन्दी में पढ़ें', dismiss: 'बंद करें' },
  bn: { message: 'এই পৃষ্ঠাটি বাংলায় পড়ুন', dismiss: 'বন্ধ করুন' },
  te: { message: 'ఈ పేజీని తెలుగులో చదవండి', dismiss: 'మూసివేయి' },
  ta: { message: 'இந்தப் பக்கத்தை தமிழில் படிக்கவும்', dismiss: 'மூடு' },
  mr: { message: 'हे पृष्ठ मराठीत वाचा', dismiss: 'बंद करा' }
}
