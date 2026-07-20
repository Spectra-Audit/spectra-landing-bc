import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { locales, isRtlLocale } from '@/i18n/config'
import { SITE_URL, localePath } from '@/lib/site'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Analytics from '@/components/ui/Analytics'
import PerformanceMonitor from '@/components/ui/PerformanceMonitor'
import { UmamiProvider } from '@/providers/UmamiProvider'
import { inter, jetbrainsMono } from '@/lib/fonts'
import SiteHeadMeta from '@/components/SiteHeadMeta'
import ThemeInitScript from '@/components/ThemeInitScript'
import '@/globals.css'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // Enable static rendering: must run before any next-intl API that could
  // otherwise fall back to the request-scoped (dynamic) locale lookup.
  setRequestLocale(locale)

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

// This is a root layout: it owns <html>/<body> for every route under
// `[locale]` (the whole localized marketing site). It works alongside
// `app/(root)/layout.tsx` via Next.js's "multiple root layouts" pattern —
// there is intentionally no shared `app/layout.tsx` above both, since that
// would force this entire subtree dynamic (it can't know `params.locale`
// and would have to fall back to a request-scoped locale lookup).
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

  // Enable static rendering for this request. Must be called before any
  // next-intl API (useLocale/useTranslations/etc.) that a descendant Server
  // Component might invoke without an explicit `locale` — without this,
  // next-intl falls back to reading the negotiated locale from `headers()`,
  // which is a dynamic API and opts the whole route out of static
  // generation (defeating `generateStaticParams` above).
  setRequestLocale(locale)

  // Get messages specifically for this locale
  const messages = await getMessages({ locale })
  const t = await getTranslations({ locale, namespace: 'accessibility' })
  const dir = isRtlLocale(locale as any) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <SiteHeadMeta />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased transition-colors duration-300 bg-white dark:bg-ink-950 text-neutral-900 dark:text-white`} suppressHydrationWarning>
        <UmamiProvider>
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
        </UmamiProvider>

        {/* Theme initialization script to prevent flash */}
        <ThemeInitScript />

        {/* Performance Monitoring */}
        <PerformanceMonitor />

        {/* Performance and Accessibility */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              window.addEventListener('load', function() {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

                // Store for analytics if consent is given
                window.performanceData = {
                  loadTime: pageLoadTime,
                  domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                  firstPaint: perfData.responseStart - perfData.navigationStart
                };
              });
            `
          }}
        />
      </body>
    </html>
  )
}
