import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { locales, isRtlLocale } from '@/i18n/config'
import { ThemeProvider } from '@/contexts/ThemeContext'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('og.title'),
      description: t('og.description'),
      type: 'website',
      url: `https://spectra-audit.com/${locale}`,
      images: [
        {
          url: 'https://spectra-audit.com/images/og-image.jpg',
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
      images: ['https://spectra-audit.com/images/og-image.jpg'],
    },
    alternates: {
      canonical: `https://spectra-audit.com/${locale}`,
      languages: {
        ...locales.reduce((acc, loc) => {
          acc[loc] = `https://spectra-audit.com/${loc}`
          return acc
        }, {} as Record<string, string>),
        'x-default': 'https://spectra-audit.com/en',
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
  const dir = isRtlLocale(locale as any) ? 'rtl' : 'ltr'

  return (
    <ThemeProvider>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <div dir={dir}>
          {children}
        </div>
      </NextIntlClientProvider>
    </ThemeProvider>
  )
}