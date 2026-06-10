import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { SITE_URL, localePath } from '@/lib/site'

const PAGES: Array<{ sub: string; priority: number }> = [
  { sub: '', priority: 1 },
  { sub: '/whitepaper', priority: 0.8 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return PAGES.flatMap(({ sub, priority }) => {
    const languages = {
      ...Object.fromEntries(locales.map((locale) => [locale, `${SITE_URL}${localePath(locale, sub)}`])),
      'x-default': `${SITE_URL}${localePath('en', sub)}`,
    }

    return locales.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, sub)}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === 'en' ? priority : priority - 0.2,
      alternates: { languages },
    }))
  })
}
