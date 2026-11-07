const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// --- Content-Security-Policy, report-only (SPE-20) -------------------------
//
// This is the policy we intend to ENFORCE as a real HTTP header. It ships
// report-only first so it cannot break the site while we watch for
// violations.
//
// Why a real header when `SiteHeadMeta.tsx` already enforces a CSP via
// `<meta http-equiv>`: the meta form is strictly weaker. Per spec, browsers
// ignore `frame-ancestors`, `report-uri` and `report-to` in a meta CSP, and a
// meta policy only covers the HTML document that carries it — never
// non-HTML responses, and nothing the parser fetched before reaching the tag.
// So clickjacking protection and violation reporting are only obtainable as a
// header, which is what this adds.
//
// The directive list deliberately mirrors the meta policy rather than
// tightening it. That policy is already enforcing in production, so it is
// known-workable; keeping them identical means any report we collect is
// evidence about the *delivery path* (something the meta tag never covered),
// not noise from a policy nobody has run yet. Tightening — in particular
// dropping 'unsafe-inline' / 'unsafe-eval' from script-src, which needs
// per-request nonces and a check against the analytics loaders — is separate
// follow-up work, not part of this baseline.
//
// Rollout: leave report-only for >= 1 week, confirm reports are clean, then
// rename this header to `Content-Security-Policy` and delete the CSP meta tag
// from `SiteHeadMeta.tsx` so there is one policy in one place.
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://cloud.umami.is",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://api.spectra-audit.com https://cloud.umami.is https://*.netlify.com https://*.netlify.app",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Header-only directive: blocks this site being framed anywhere. Matches
  // the existing `X-Frame-Options: DENY` below, which modern browsers ignore
  // in favour of frame-ancestors when both are present.
  "frame-ancestors 'none'",
]

// Where violation reports go. Unset by default: no collector has been chosen
// yet, and inventing a URL would silently black-hole every report. With it
// unset the policy still ships and violations still surface in the browser
// console; set it to start the >= 1 week collection window.
//
// `report-uri` is deprecated but is still the only directive Safari and
// Firefox honour, so both it and the modern `report-to` are sent.
const CSP_REPORT_URI = process.env.CSP_REPORT_URI || ''
const CSP_REPORT_GROUP = 'csp-endpoint'

const cspReportOnlyValue = [
  ...CSP_DIRECTIVES,
  ...(CSP_REPORT_URI
    ? [`report-uri ${CSP_REPORT_URI}`, `report-to ${CSP_REPORT_GROUP}`]
    : []),
].join('; ')

/** Headers that only make sense when a report collector is configured. */
const cspReportingHeaders = CSP_REPORT_URI
  ? [
      {
        key: 'Reporting-Endpoints',
        value: `${CSP_REPORT_GROUP}="${CSP_REPORT_URI}"`,
      },
    ]
  : []

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Performance optimizations
  experimental: {
    // optimizeCss (critical-CSS inlining) intentionally NOT enabled: it relies
    // on `critters`, which is deprecated and was never in the lockfile — so it
    // already no-op'd on Vercel while silently running locally. Removing the
    // flag makes local match prod. Revisit deliberately (measure FCP; use a
    // supported inliner) if critical-CSS inlining is wanted.
    scrollRestoration: true,
    largePageDataBytes: 128 * 1000, // 128KB
  },

  // Bundle analyzer for development
  webpack: (config, { dev, isServer, webpack }) => {
    if (!dev && !isServer) {
      // Bundle splitting optimizations
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          ui: {
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }

      // Tree shaking optimizations
      config.optimization.usedExports = true
      config.optimization.sideEffects = false

      // Performance budgets
      if (!dev) {
        config.performance = {
          hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
          maxEntrypointSize: 512000,
          maxAssetSize: 512000,
        }
      }
    }

    // Optimize lucide-react imports manually since optimizePackageImports has conflicts
    config.resolve.alias = {
      ...config.resolve.alias,
      'lucide-react': 'lucide-react/dist/esm',
    }

    return config
  },

  // Enhanced image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add quality configurations
    qualities: [75, 95],
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    // Advanced optimization
    unoptimized: false,
  },

  // Compression
  compress: true,

  // Headers for internationalization and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // The enforcing CSP still comes from the meta tag in
          // SiteHeadMeta.tsx. This report-only header is the real-header
          // version of that same policy, plus the directives meta cannot
          // carry — see CSP_DIRECTIVES above for the rollout plan.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: cspReportOnlyValue
          },
          ...cspReportingHeaders,
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      },
      {
        // Special headers for static assets
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Special headers for images
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400'
          }
        ]
      }
    ]
  },

  // Redirects for legacy routes - note: locale prefix handling is done by middleware
  async redirects() {
    return [
      // `localePrefix: 'as-needed'` serves the default locale unprefixed, so
      // /en and /en/* are duplicates of / and /*. next-intl's middleware
      // already redirects them, but only with a temporary 307, which does not
      // consolidate link equity onto the canonical URL (SPE-4 plan line 90).
      // next.config.js redirects are evaluated BEFORE middleware, so these
      // win and emit a literal 301 instead.
      { source: '/en', destination: '/', statusCode: 301 },
      { source: '/en/:path+', destination: '/:path+', statusCode: 301 }
    ]
  }
}

module.exports = withNextIntl(nextConfig)