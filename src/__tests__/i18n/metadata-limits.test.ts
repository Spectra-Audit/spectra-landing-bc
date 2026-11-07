import fs from 'fs'
import path from 'path'
import { locales } from '@/i18n/config'

/**
 * Every locale must ship its own title and meta description, within the
 * length budgets search engines actually render.
 *
 * Why this is worth a test. The site shipped with `metadata.description`
 * byte-identical English in all sixteen locales, and `whitepaper.metadata`
 * untranslated English everywhere — QA confirmed it live twice (SPE-8, then
 * SPE-9). Nothing in the build catches that: the keys exist, next-intl
 * resolves them, the pages render, and a missing translation looks exactly
 * like a deliberate one. Three home titles were also over the 60-char cutoff
 * (de, ar, ta) and the whitepaper description was 190 chars, so both halves of
 * the failure — "not translated" and "too long" — are asserted here.
 *
 * The cross-locale uniqueness check is the part that would have caught the
 * original bug. A per-locale length check passes happily on sixteen copies of
 * the same English sentence.
 *
 * Limits: 60 for titles and 160 for descriptions are the truncation points
 * Google uses for desktop SERPs. They are budgets, not hard errors, which is
 * why no runtime code enforces them and a test has to.
 */

const LOCALES_DIR = path.join(process.cwd(), 'src/i18n/locales')

const TITLE_MAX = 60
const DESCRIPTION_MAX = 160

type Messages = {
  metadata: {
    title: string
    description: string
    og: { title: string; description: string }
  }
  whitepaper: { metadata: { title: string; description: string } }
}

const messages: Record<string, Messages> = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, `${locale}.json`), 'utf8')),
  ])
)

// [field path, accessor, limit] — the four strings that reach a <title> or a
// meta/og description tag, plus the og title that feeds social cards.
const FIELDS: Array<[string, (m: Messages) => string, number]> = [
  ['metadata.title', (m) => m.metadata.title, TITLE_MAX],
  ['metadata.description', (m) => m.metadata.description, DESCRIPTION_MAX],
  ['metadata.og.title', (m) => m.metadata.og.title, TITLE_MAX],
  ['metadata.og.description', (m) => m.metadata.og.description, DESCRIPTION_MAX],
  ['whitepaper.metadata.title', (m) => m.whitepaper.metadata.title, TITLE_MAX],
  ['whitepaper.metadata.description', (m) => m.whitepaper.metadata.description, DESCRIPTION_MAX],
]

describe('locale metadata', () => {
  it('covers all sixteen locales', () => {
    expect(locales).toHaveLength(16)
    expect(Object.keys(messages)).toHaveLength(16)
  })

  describe.each(FIELDS)('%s', (fieldPath, read, limit) => {
    it.each(locales)(`[%s] is present and <= ${limit} chars`, (locale) => {
      const value = read(messages[locale])

      expect(typeof value).toBe('string')
      expect(value.trim().length).toBeGreaterThan(0)

      // Count characters, not bytes and not UTF-16 code units. ar, ja, zh,
      // hi, bn, te, ta and mr are all multi-byte in UTF-8, so
      // `Buffer.byteLength` would report two to four times the real length
      // and reject perfectly short copy — while conversely a byte budget set
      // loose enough for them would let real overruns through in the Latin
      // locales. `.length` is closer but still wrong in principle: it counts
      // UTF-16 code units, so anything outside the BMP (an emoji, a CJK
      // Ext-B ideograph) counts double. Spreading the string counts code
      // points, which is what a SERP truncates on.
      expect([...value].length).toBeLessThanOrEqual(limit)
    })

    // The exact regression QA confirmed live twice: the English string
    // shipped verbatim under every locale's key. The duplicate grouping
    // below also catches that, but only for as long as all fifteen stay
    // identical to each other — translate fourteen, leave one in English,
    // and the grouping goes quiet while a user-visible bug ships. This
    // check names English directly, so a single untranslated locale fails.
    it.each(locales.filter((locale) => locale !== 'en'))(
      '[%s] is not byte-identical to the English string',
      (locale) => {
        const value = read(messages[locale])
        const english = read(messages.en)

        expect(value).not.toBe(english)
        expect(Buffer.from(value, 'utf8').equals(Buffer.from(english, 'utf8'))).toBe(false)
      }
    )

    // English is the source copy, so it is excluded from the "differs from
    // English" comparison but still has to be unique against the other
    // fifteen, which the duplicate grouping below covers.
    it('is translated per locale, not one string repeated', () => {
      const byValue = new Map<string, string[]>()

      for (const locale of locales) {
        const value = read(messages[locale])
        byValue.set(value, [...(byValue.get(value) ?? []), locale])
      }

      const duplicated = [...byValue.entries()].filter(([, locs]) => locs.length > 1)

      expect(duplicated).toEqual([])
    })
  })
})
