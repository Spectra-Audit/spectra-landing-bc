import { Inter, JetBrains_Mono } from 'next/font/google'
import '@/globals.css'

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
    <html suppressHydrationWarning>
      <head>
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
                script-src 'self' https://www.googletagmanager.com;
                style-src 'self' https://fonts.googleapis.com;
                font-src 'self' https://fonts.gstatic.com;
                img-src 'self' data: https: blob:;
                connect-src 'self' https://api.spectra.security;
                frame-src 'none';
                object-src 'none';
                base-uri 'self';
                form-action 'self';
                upgrade-insecure-requests;
              `.trim().replace(/\s+/g, ' ')
              : `
                default-src 'self';
                script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                font-src 'self' https://fonts.gstatic.com;
                img-src 'self' data: https: blob:;
                connect-src 'self' https://api.spectra.security;
                frame-src 'none';
                object-src 'none';
                base-uri 'self';
                form-action 'self';
              `.trim().replace(/\s+/g, ' ')
          }
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased transition-colors duration-300`}>
        {children}

        {/* Performance and Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              window.addEventListener('load', function() {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

                // Track performance metrics
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'page_load_time', {
                    custom_map: { load_time: pageLoadTime }
                  });
                }
              });

              // Accessibility enhancement: skip to main content
              document.addEventListener('DOMContentLoaded', function() {
                const skipLink = document.createElement('a');
                skipLink.href = '#main-content';
                skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded';
                skipLink.textContent = 'Skip to main content';
                document.body.insertBefore(skipLink, document.body.firstChild);
              });
            `
          }}
        />
      </body>
    </html>
  )
}