import { getTranslations, setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { localePath, absoluteLocaleUrl } from '@/lib/site'

// The whitepaper page is a client component, so its metadata lives in this
// segment layout. Without it the page inherits the homepage title, description,
// and canonical — which told crawlers it was a duplicate of the homepage.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // Enable static rendering — see app/[locale]/layout.tsx for why this is
  // required (not just removing `force-dynamic`) to get SSG per locale.
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'whitepaper.metadata' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'article',
      siteName: 'Spectra Audit',
      url: localePath(locale, '/whitepaper'),
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og-image.jpg'],
    },
    // Absolute, via the shared helper, for the same reason as the home page —
    // see `src/lib/site.ts`. /whitepaper never had the trailing-slash
    // divergence (its path is non-empty for every locale), but it goes through
    // the same helper so it cannot acquire one later.
    alternates: {
      canonical: absoluteLocaleUrl(locale, '/whitepaper'),
      languages: {
        ...locales.reduce((acc, loc) => {
          acc[loc] = absoluteLocaleUrl(loc, '/whitepaper')
          return acc
        }, {} as Record<string, string>),
        'x-default': absoluteLocaleUrl('en', '/whitepaper'),
      },
    },
  }
}

export default async function WhitepaperLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return children
}
