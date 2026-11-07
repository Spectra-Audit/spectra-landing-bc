import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { absoluteLocaleUrl } from '@/lib/site'
import { PAGE_CONTENT_MODIFIED } from '@/lib/content-dates'

const PAGES: Array<{ sub: string; priority: number }> = [
  { sub: '', priority: 1 },
  { sub: '/whitepaper', priority: 0.8 },
]

// `lastModified` is omitted entirely when we have no real date for a page.
// Returning `{}` lets the caller spread it away, so the key never reaches the
// XML — an absent `lastmod` is valid and honest, a build-time one is neither
// (SPE-4 P0-2 / G4).
function lastModifiedFor(sub: string): { lastModified?: string } {
  const date = PAGE_CONTENT_MODIFIED[sub]
  return date ? { lastModified: date } : {}
}

export default function sitemap(): MetadataRoute.Sitemap {
  // /sample-report is one English document at one URL (it lives outside the
  // `[locale]` segment), so it gets a single entry with no hreflang alternates
  // rather than a row per locale.
  const sampleReport = {
    url: absoluteLocaleUrl('en', '/sample-report'),
    ...lastModifiedFor('/sample-report'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }

  const localizedPages = PAGES.flatMap(({ sub, priority }) => {
    // Built with `absoluteLocaleUrl`, never `${SITE_URL}${localePath(...)}`.
    // The hand-rolled concatenation is what made the en home `loc` here
    // (`https://www.spectra-audit.com/`) disagree with the served canonical
    // (`https://www.spectra-audit.com`) — see `src/lib/site.ts`.
    const languages = {
      ...Object.fromEntries(locales.map((locale) => [locale, absoluteLocaleUrl(locale, sub)])),
      'x-default': absoluteLocaleUrl('en', sub),
    }

    const lastModified = lastModifiedFor(sub)

    return locales.map((locale) => ({
      url: absoluteLocaleUrl(locale, sub),
      ...lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === 'en' ? priority : priority - 0.2,
      alternates: { languages },
    }))
  })

  return [...localizedPages, sampleReport]
}
