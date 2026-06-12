import { Inter, JetBrains_Mono } from 'next/font/google'
import '@/globals.css'
import PerformanceMonitor from '@/components/ui/PerformanceMonitor'
import { UmamiProvider } from '@/providers/UmamiProvider'
import { getLocale } from 'next-intl/server'
import { isRtlLocale, type Locale } from '@/i18n/config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// <html lang>/<dir> below is derived from getLocale(), which resolves the active
// locale from the request at runtime. This root layout sits above the [locale]
// segment, so it has no params.locale and can't know the locale statically.
// Force dynamic rendering so the root layout re-renders per request and emits the
// correct lang/dir per locale — a static shell would bake in the default locale.
export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const dir = isRtlLocale(locale as Locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Mobile Viewport Configuration */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />

        {/* Content Security Policy - Use same for both dev and production to ensure compatibility */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={
            `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://cloud.umami.is;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com data:;
              img-src 'self' data: https: blob:;
              connect-src 'self' https://api.spectra-audit.com https://cloud.umami.is https://*.netlify.com https://*.netlify.app;
              frame-src 'none';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
            `.trim().replace(/\s+/g, ' ')
          }
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased transition-colors duration-300 bg-white dark:bg-ink-950 text-neutral-900 dark:text-white`} suppressHydrationWarning>
        <UmamiProvider>
          {children}
        </UmamiProvider>

        {/* Theme initialization script to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'system';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `
          }}
        />

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