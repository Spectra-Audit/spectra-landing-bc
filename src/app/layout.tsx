import { Inter, JetBrains_Mono } from 'next/font/google'
import '@/globals.css'
import Analytics from '@/components/ui/Analytics'
import PerformanceMonitor from '@/components/ui/PerformanceMonitor'
import { UmamiProvider } from '@/providers/UmamiProvider'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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

        {/* Content Security Policy */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={
            process.env.NODE_ENV === 'production'
              ? `
                default-src 'self';
                script-src 'self' https://www.googletagmanager.com https://cloud.umami.is;
                style-src 'self' https://fonts.googleapis.com;
                font-src 'self' https://fonts.gstatic.com;
                img-src 'self' data: https: blob:;
                connect-src 'self' https://api.spectra-audit.com https://cloud.umami.is;
                frame-src 'none';
                object-src 'none';
                base-uri 'self';
                form-action 'self';
                upgrade-insecure-requests;
              `.trim().replace(/\s+/g, ' ')
              : `
                default-src 'self';
                script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://cloud.umami.is;
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                font-src 'self' https://fonts.gstatic.com;
                img-src 'self' data: https: blob:;
                connect-src 'self' https://api.spectra-audit.com https://cloud.umami.is;
                frame-src 'none';
                object-src 'none';
                base-uri 'self';
                form-action 'self';
              `.trim().replace(/\s+/g, ' ')
          }
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased transition-colors duration-300 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white`} suppressHydrationWarning>
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

        {/* Privacy-Compliant Analytics */}
        <Analytics />

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

              // Accessibility enhancement: skip to main content
              document.addEventListener('DOMContentLoaded', function() {
                const skipLink = document.createElement('a');
                skipLink.href = '#main-content';
                skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded z-50';
                skipLink.textContent = 'Skip to main content';
                document.body.insertBefore(skipLink, document.body.firstChild);
              });

              // Error tracking
              window.addEventListener('error', function(e) {
                console.error('Application error:', e.error);
                // Track to analytics if consent is given
                if (window.analyticsConsent) {
                  fetch('/api/errors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      error: e.error?.message || 'Unknown error',
                      filename: e.filename,
                      lineno: e.lineno,
                      colno: e.colno,
                      stack: e.error?.stack,
                      url: window.location.href,
                      timestamp: new Date().toISOString()
                    })
                  }).catch(() => {}); // Silently fail to not break user experience
                }
              });
            `
          }}
        />
      </body>
    </html>
  )
}