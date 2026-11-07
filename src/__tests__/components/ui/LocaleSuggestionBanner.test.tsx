import { pickSuggestedLocale } from '@/components/ui/LocaleSuggestionBanner'
import { locales, localeSuggestions } from '@/i18n/config'

/**
 * The banner replaced an Accept-Language redirect, so the matching rule is
 * the part that has to behave: offering the wrong language, or offering a
 * language the visitor is already reading, is the whole failure mode.
 */
describe('pickSuggestedLocale', () => {
  it('offers a locale the visitor prefers over the one they are reading', () => {
    expect(pickSuggestedLocale(['de-DE', 'de', 'en'], 'en')).toBe('de')
  })

  it('stays quiet when the top preference is already the current locale', () => {
    expect(pickSuggestedLocale(['de-DE', 'de', 'en'], 'de')).toBeNull()
  })

  it('matches a regional tag to its base locale', () => {
    expect(pickSuggestedLocale(['pt-BR'], 'en')).toBe('pt')
    expect(pickSuggestedLocale(['zh-Hans-CN'], 'en')).toBe('zh')
  })

  it('skips preferences this site does not publish', () => {
    expect(pickSuggestedLocale(['nl-NL', 'sv', 'fr-CA'], 'en')).toBe('fr')
  })

  it('is decided by the first supported preference, not by a later one', () => {
    // A visitor whose first choice is the current page gets nothing, even
    // though a different supported language appears further down the list —
    // they are already reading their preferred language.
    expect(pickSuggestedLocale(['en-GB', 'de'], 'en')).toBeNull()
  })

  it('returns null when nothing matches or the list is empty', () => {
    expect(pickSuggestedLocale(['nl', 'sv'], 'en')).toBeNull()
    expect(pickSuggestedLocale([], 'en')).toBeNull()
  })

  it('is case-insensitive about language tags', () => {
    expect(pickSuggestedLocale(['ZH-hans'], 'en')).toBe('zh')
  })
})

describe('localeSuggestions', () => {
  it('covers every locale with copy in that locale, not English', () => {
    for (const locale of locales) {
      const entry = localeSuggestions[locale]

      expect(entry?.message?.trim()).toBeTruthy()
      expect(entry?.dismiss?.trim()).toBeTruthy()

      if (locale !== 'en') {
        expect(entry.message).not.toBe(localeSuggestions.en.message)
        expect(entry.dismiss).not.toBe(localeSuggestions.en.dismiss)
      }
    }
  })
})
