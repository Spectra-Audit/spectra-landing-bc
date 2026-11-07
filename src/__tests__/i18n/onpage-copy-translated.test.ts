import fs from 'fs'
import path from 'path'
import { locales } from '@/i18n/config'

/**
 * On-page copy that must be in the page's own language.
 *
 * `metadata-limits.test.ts` guards the strings that reach <title> and the
 * meta/og tags. This guards two sets of strings a visitor reads on the page
 * itself, both of which have already shipped wrong:
 *
 *  - `whitepaper.hero.*` is the /whitepaper H1, split over two lines. Its
 *    first line was the literal English "The Multi-Dimensional" in all
 *    sixteen locales, so /zh rendered the H1 as
 *    "The Multi-Dimensional安全审计框架" — half English, in the single
 *    strongest on-page ranking signal the page has.
 *  - `notFound.*` is the localized 404 (app/[locale]/not-found.tsx). Before
 *    it existed, 404s fell through to Next's built-in English page.
 *
 * Why these checks and not uniqueness across all sixteen: Hindi and Marathi
 * legitimately share "सुरक्षा ऑडिट फ्रेमवर्क" for the subtitle, so a strict
 * all-distinct assertion would fail on correct copy. "Differs from English"
 * is what catches the real bug (one English string pasted everywhere), and
 * for the ten locales that do not use the Latin alphabet, "contains a
 * non-ASCII character" catches it even if the English source copy changes.
 */

const LOCALES_DIR = path.join(process.cwd(), 'src/i18n/locales')

// Locales whose script is not Latin: any value here that is pure ASCII is
// untranslated by definition.
const NON_LATIN_LOCALES = ['zh', 'ja', 'ko', 'ar', 'ru', 'hi', 'bn', 'te', 'ta', 'mr'] as const

type Messages = {
  whitepaper: { hero: { title: string; subtitle: string } }
  notFound: { title: string; description: string; backHome: string }
}

const messages: Record<string, Messages> = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, `${locale}.json`), 'utf8')),
  ])
)

const FIELDS: Array<[string, (m: Messages) => string]> = [
  ['whitepaper.hero.title', (m) => m.whitepaper.hero.title],
  ['whitepaper.hero.subtitle', (m) => m.whitepaper.hero.subtitle],
  ['notFound.title', (m) => m.notFound.title],
  ['notFound.description', (m) => m.notFound.description],
  ['notFound.backHome', (m) => m.notFound.backHome],
]

const NON_EN_LOCALES = locales.filter((locale) => locale !== 'en')

describe('on-page copy is localized', () => {
  describe.each(FIELDS)('%s', (_fieldPath, read) => {
    it.each(locales)('[%s] is present', (locale) => {
      const value = read(messages[locale])

      expect(typeof value).toBe('string')
      expect(value.trim().length).toBeGreaterThan(0)
    })

    it.each(NON_EN_LOCALES)('[%s] is not the English string', (locale) => {
      expect(read(messages[locale])).not.toBe(read(messages.en))
    })

    it.each(NON_LATIN_LOCALES)('[%s] is written in its own script', (locale) => {
      expect(read(messages[locale])).toMatch(/[^\u0000-\u007F]/)
    })
  })
})
