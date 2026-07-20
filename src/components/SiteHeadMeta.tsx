// Static, locale-independent <head> meta tags: mobile viewport config,
// security headers (defense-in-depth alongside the real HTTP headers set in
// next.config.js), and the Content-Security-Policy. None of this depends on
// request data, so it's safe to render from a Server Component in either of
// the app's two root layouts (`app/(root)/layout.tsx` and
// `app/[locale]/layout.tsx`) without opting either one out of static
// rendering.
export default function SiteHeadMeta() {
  return (
    <>
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
    </>
  )
}
