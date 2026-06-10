import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { localePath } from '@/lib/site'

// The whitepaper page is a client component, so its metadata lives in this
// segment layout. Without it the page inherits the homepage title, description,
// and canonical — which told crawlers it was a duplicate of the homepage.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
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
    alternates: {
      canonical: localePath(locale, '/whitepaper'),
      languages: {
        ...locales.reduce((acc, loc) => {
          acc[loc] = localePath(loc, '/whitepaper')
          return acc
        }, {} as Record<string, string>),
        'x-default': localePath('en', '/whitepaper'),
      },
    },
  }
}

export default function WhitepaperLayout({ children }: { children: React.ReactNode }) {
  return children
}
