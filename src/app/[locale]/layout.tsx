import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { locales, isRtlLocale } from '@/i18n/config'
import { SITE_URL, localePath } from '@/lib/site'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Analytics from '@/components/ui/Analytics'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('og.title'),
      description: t('og.description'),
      type: 'website',
      siteName: 'Spectra Audit',
      url: localePath(locale),
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: t('og.imageAlt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('og.title'),
      description: t('og.description'),
      images: ['/images/og-image.jpg'],
    },
    alternates: {
      canonical: localePath(locale),
      languages: {
        ...locales.reduce((acc, loc) => {
          acc[loc] = localePath(loc)
          return acc
        }, {} as Record<string, string>),
        'x-default': '/',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Get messages specifically for this locale
  const messages = await getMessages({ locale })
  const t = await getTranslations({ locale, namespace: 'accessibility' })
  const dir = isRtlLocale(locale as any) ? 'rtl' : 'ltr'

  return (
    <ThemeProvider>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded z-50"
        >
          {t('skipToMain')}
        </a>
        <div dir={dir}>
          {children}
        </div>
        {/* Privacy-Compliant Analytics + cookie consent (inside the locale provider so the banner is translated) */}
        <Analytics />
      </NextIntlClientProvider>
    </ThemeProvider>
  )
}