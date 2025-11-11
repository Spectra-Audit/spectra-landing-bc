import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, defaultLocale } from '@/i18n/config'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ThemeProvider } from '@/contexts/ThemeContext'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const safeLocale = locale || defaultLocale
  const t = await getTranslations({ locale: safeLocale, namespace: 'meta' })

  // Import messages directly to access keywords array
  const messages = (await import(`@/i18n/locales/${safeLocale}.json`)).default
  const keywords = messages.meta?.keywords || []

  return {
    title: {
      default: t('title'),
      template: `%s | ${t('title').split(' - ')[0] || 'Spectra'}`
    },
    description: t('description'),
    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    authors: [{ name: 'Spectra Security' }],
    creator: 'Spectra Security',
    publisher: 'Spectra Security',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://spectra.security'),
    alternates: {
      canonical: `/${safeLocale === 'en' ? '' : safeLocale}`,
      languages: {
        'en': '/',
        'es': '/es',
        'fr': '/fr',
        'de': '/de',
        'ja': '/ja',
        'zh': '/zh',
        'ko': '/ko'
      }
    },
    openGraph: {
      type: 'website',
      locale: safeLocale === 'zh' ? 'zh_CN' : safeLocale === 'ja' ? 'ja_JP' : safeLocale === 'ko' ? 'ko_KR' : `${safeLocale}_${safeLocale.toUpperCase()}`,
      url: `https://spectra.security${safeLocale === 'en' ? '' : `/${safeLocale}`}`,
      title: t('title'),
      description: t('description'),
      siteName: 'Spectra Security',
      images: [
        {
          url: '/og-image.jpg',
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
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
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
  const safeLocale = locale || defaultLocale

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(safeLocale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <div className="scroll-smooth" lang={safeLocale}>
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  )
}