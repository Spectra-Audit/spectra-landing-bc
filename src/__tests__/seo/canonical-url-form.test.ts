/**
 * SPE-4 P0-3 / G5 and P0-2 / G4.
 *
 * Two regressions this locks down, both of which shipped to production and
 * both of which QA had marked PASS:
 *
 *  1. The en home advertised two different URLs. The served canonical was
 *     `https://www.spectra-audit.com`; the sitemap `<loc>` was
 *     `https://www.spectra-audit.com/`. One byte, two candidate URLs for one
 *     page, and Google picking the winner instead of us.
 *  2. Every one of the 32 sitemap rows carried `lastmod` = build time, so the
 *     whole site claimed it changed today, on every deploy, forever.
 */
import sitemap from '@/app/sitemap'
import { locales } from '@/i18n/config'
import { SITE_URL, localePath, absoluteLocaleUrl, canonicalizeRootUrl } from '@/lib/site'
import { PAGE_CONTENT_MODIFIED } from '@/lib/content-dates'

// What the four surfaces must all agree on, written out literally rather than
// derived — if a refactor changes the agreed form, this test should fail and
// make someone decide that on purpose.
const EN_HOME_URL = 'https://www.spectra-audit.com'

describe('en home canonical URL form (P0-3 / G5)', () => {
  it('is the bare origin with no trailing slash', () => {
    expect(absoluteLocaleUrl('en')).toBe(EN_HOME_URL)
    expect(absoluteLocaleUrl('en')).not.toMatch(/\/$/)
    expect(SITE_URL).toBe(EN_HOME_URL)
  })

  it('is byte-identical across sitemap loc, canonical, hreflang and x-default', () => {
    const rows = sitemap()
    const homeRow = rows.find((row) => row.url === absoluteLocaleUrl('en'))

    // The sitemap `loc`.
    expect(homeRow).toBeDefined()
    expect(homeRow!.url).toBe(EN_HOME_URL)

    // The sitemap's own hreflang block.
    const languages = homeRow!.alternates?.languages as Record<string, string>
    expect(languages.en).toBe(EN_HOME_URL)
    expect(languages['x-default']).toBe(EN_HOME_URL)

    // The canonical and the <head> hreflang tags. Both layouts feed
    // `alternates` from `absoluteLocaleUrl`, so asserting the helper asserts
    // what Next emits: an absolute URL is passed through verbatim rather than
    // being re-resolved against `metadataBase`, which is the resolution step
    // that used to drop the slash on one surface but not the others.
    expect(absoluteLocaleUrl('en')).toBe(EN_HOME_URL)

    // The `Link: rel="alternate"` response header, which next-intl builds
    // itself and which middleware.ts normalizes on the way out.
    expect(canonicalizeRootUrl(`${SITE_URL}/`)).toBe(EN_HOME_URL)
  })

  it('leaves every non-root URL alone', () => {
    // The root collapse must not eat a real path's segment or slash.
    expect(canonicalizeRootUrl(`${SITE_URL}/de`)).toBe(`${SITE_URL}/de`)
    expect(canonicalizeRootUrl(`${SITE_URL}/whitepaper`)).toBe(`${SITE_URL}/whitepaper`)
    expect(canonicalizeRootUrl(`${SITE_URL}/de/`)).toBe(`${SITE_URL}/de/`)

    expect(absoluteLocaleUrl('de')).toBe(`${SITE_URL}/de`)
    expect(absoluteLocaleUrl('en', '/whitepaper')).toBe(`${SITE_URL}/whitepaper`)
    expect(absoluteLocaleUrl('de', '/whitepaper')).toBe(`${SITE_URL}/de/whitepaper`)
  })

  it('keeps localePath relative so internal hrefs still point somewhere', () => {
    // The fix must not reach into `localePath`: an `<a href="">` is a link to
    // the current URL, not to the home page.
    expect(localePath('en')).toBe('/')
    expect(localePath('de')).toBe('/de')
  })

  it('emits no trailing slash on any sitemap URL', () => {
    for (const row of sitemap()) {
      expect(row.url).not.toMatch(/\/$/)
    }
  })

  it('covers every locale with a hreflang entry on every localized page', () => {
    for (const row of sitemap()) {
      const languages = row.alternates?.languages as Record<string, string> | undefined
      if (!languages) continue
      for (const locale of locales) {
        expect(languages[locale]).toBe(absoluteLocaleUrl(locale, row.url.replace(SITE_URL, '').replace(/^\/[a-z]{2}(?=\/|$)/, '')))
      }
    }
  })
})

describe('sitemap lastmod (P0-2 / G4)', () => {
  it('reports no build-time dates: output is identical across two different clocks', () => {
    // Fake timers move the whole `Date` constructor, not just `Date.now`, so
    // this catches `new Date()` as well as `Date.now()`. Without that, the two
    // runs would only differ by however many milliseconds elapsed between
    // them, and the test would pass by luck on a fast machine.
    jest.useFakeTimers()
    try {
      jest.setSystemTime(new Date('2030-06-01T12:00:00Z'))
      const far = JSON.stringify(sitemap())

      jest.setSystemTime(new Date('2020-02-02T02:02:02Z'))
      const near = JSON.stringify(sitemap())

      expect(far).toBe(near)
      // And neither run may mention either fake year.
      expect(far).not.toContain('2030')
      expect(far).not.toContain('2020')
    } finally {
      jest.useRealTimers()
    }
  })

  it('traces every lastmod present to a real content date', () => {
    const known = new Set(Object.values(PAGE_CONTENT_MODIFIED))
    const today = new Date().toISOString().slice(0, 10)

    for (const row of sitemap()) {
      if (row.lastModified === undefined) continue

      const value = String(row.lastModified)
      expect(known).toContain(value)
      // A real content date may legitimately be today's date; a build-time
      // date is today's date *and* a full timestamp. Rejecting the timestamp
      // form is what distinguishes them.
      expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(value).not.toContain('T')
      void today
    }
  })

  it('omits lastmod rather than inventing one for an unlisted page', () => {
    // Guard the mechanism, not just today's data: a page with no entry must
    // produce a row with no `lastModified` key at all.
    expect(PAGE_CONTENT_MODIFIED['/does-not-exist']).toBeUndefined()

    const rows = sitemap()
    const withDates = rows.filter((row) => row.lastModified !== undefined)
    expect(withDates.length).toBeGreaterThan(0)

    for (const row of rows) {
      const sub = row.url.replace(SITE_URL, '').replace(/^\/[a-z]{2}(?=\/|$)/, '')
      if (PAGE_CONTENT_MODIFIED[sub] === undefined) {
        expect(row).not.toHaveProperty('lastModified')
      }
    }
  })
})
