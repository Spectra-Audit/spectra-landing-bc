# Spectra — Landing Page

> The public marketing website for Spectra, a blockchain security audit platform for smart contracts and tokens.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Languages](https://img.shields.io/badge/i18n-16%20languages-success)](#internationalization)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## What is Spectra

Spectra is a blockchain security audit platform that analyzes smart contracts and tokens and produces structured security assessments. It is built for the people who need to understand on-chain risk before they act: web3 creators shipping new projects, DeFi protocols seeking transparency, and investors evaluating where to put their capital.

Assessments are organized across multiple analysis dimensions — including code security, tokenomics, liquidity health, and holder distribution — and rolled up into an overall score with supporting evidence.

## About this repository

This repository contains **only the public marketing landing page** for Spectra — the website at the link below. It is a [Next.js](https://nextjs.org/) application that explains what the platform does, how its scoring works, and how to get started. **It is not the audit engine itself**; it does not analyze contracts, run scans, or store assessment data.

- **Live site:** https://spectra-audit.com
- **The platform (web app):** https://app.spectra-audit.com

The landing page links out to the platform for anything interactive. If you are looking for the code that performs audits, you will not find it here.

## Features

What this landing page itself provides:

- **Internationalized in 16 languages**, including full right-to-left (RTL) support for Arabic. See [Internationalization](#internationalization).
- **Scoring methodology explainer** — a "How Security Scores Work" section that walks through each analysis dimension and how the overall grade is composed.
- **Methodology and learning-loop sections** — animated diagrams that explain the audit process and how scoring is refined over time.
- **Whitepaper page** — a dedicated, localized `/[locale]/whitepaper` route.
- **Performance-optimized images** — Next.js image pipeline configured for WebP/AVIF, responsive sizes, and long-lived caching, plus scripts to generate protocol and social images.
- **Privacy-aware analytics** — a cookie-consent banner gates analytics; nothing analytics-related loads until the visitor consents and only in production builds.
- **SEO and structured data** — per-locale metadata, Open Graph and Twitter cards, canonical and `hreflang` alternate links, and JSON-LD structured data.
- **Light/dark theme** with a theme toggle, and motion that respects `prefers-reduced-motion`.

> Note: figures and labels shown on the page (such as score bands and timing) are illustrative of how the platform presents results. This repository does not produce audit results.

## Tech stack

| Area | Technology | Version |
|------|------------|---------|
| Framework | [Next.js](https://nextjs.org/) (App Router, Turbopack) | `^16.2.6` |
| UI library | [React](https://react.dev/) | `^19.2.0` |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) | `^5.9.3` |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | `^3.4.18` |
| Internationalization | [next-intl](https://next-intl.dev/) | `^4.12.0` |
| Icons | [lucide-react](https://lucide.dev/) | `^0.553.0` |
| Testing | [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/) | `jest ^30.2.0` |
| Web vitals | [web-vitals](https://github.com/GoogleChrome/web-vitals) | `^5.1.0` |
| Linting | [ESLint](https://eslint.org/) (`eslint-config-next`) | `^9.39.1` |

Exact versions are defined in [`package.json`](package.json).

## Getting started

### Prerequisites

- **Node.js 20** (the version used in CI/deploys)
- **npm** (this repo uses npm and ships a `package-lock.json`)

### Install and run

```bash
# 1. Clone the repository
git clone https://github.com/Spectra-Audit/spectra-landing-bc.git
cd spectra-landing-bc

# 2. Install dependencies
npm install

# 3. Start the dev server (Next.js + Turbopack)
npm run dev
```

The dev server runs at **http://localhost:3000**. Because the default locale (`en`) is served without a prefix, the home page is reachable at both `/` and `/en`; other languages live under their locale prefix (for example `/es`, `/ja`, `/ar`).

> **Heads up on peer dependencies:** the deploy environment installs with `--legacy-peer-deps` (see [`netlify.toml`](netlify.toml)). If a plain `npm install` reports peer-dependency conflicts locally, run `npm install --legacy-peer-deps`.

### Environment variables

No environment variables are required to run the site locally, and there is **no committed `.env.example`** — the app renders fully without any configuration. All runtime-exposed variables are public (`NEXT_PUBLIC_*`) and optional:

| Variable | Used for | Required? |
|----------|----------|-----------|
| `NEXT_PUBLIC_SITE_URL` | Canonical/absolute URLs (set to `https://spectra-audit.com` in deploys) | No (defaults are fine locally) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID; analytics only loads in production **and** after cookie consent | No |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Optional custom analytics endpoint for event forwarding | No |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami analytics website ID; Umami only loads in production **and** after cookie consent, and is fully disabled if unset | No |
| `NEXT_PUBLIC_UMAMI_HOST` | Umami script host (defaults to `https://cloud.umami.is`) | No |

To set any of these locally, create a `.env.local` file (it is git-ignored) and add the variables you need:

```bash
# .env.local (optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Do not commit secrets. This is a public, client-rendered marketing site — only `NEXT_PUBLIC_*` values belong here, and they are exposed to the browser by design.

## Available scripts

| Script | Command | What it does |
|--------|---------|--------------|
| `dev` | `next dev --turbopack` | Start the development server with Turbopack |
| `build` | `next build` | Create a production build |
| `start` | `next start` | Serve the production build |
| `lint` | `next lint` | Run ESLint |
| `type-check` | `tsc --noEmit` | Type-check the project without emitting files |
| `test` | `jest` | Run the test suite |
| `test:watch` | `jest --watch` | Run tests in watch mode |
| `test:coverage` | `jest --coverage` | Run tests with a coverage report |
| `test:ci` | `jest --ci --coverage --watchAll=false` | Run tests in CI mode |
| `images:generate` | `node scripts/generate-protocol-logos.js && node scripts/generate-social-images.js` | Regenerate all generated images (logos + social) |
| `images:protocols` | `node scripts/generate-protocol-logos.js` | Regenerate protocol logo images only |
| `images:social` | `node scripts/generate-social-images.js` | Regenerate social/OG images only |
| `optimize:images` | `npm run images:generate && npm run build` | Regenerate images, then build |

## Project structure

```
.
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx        # Locale layout: i18n provider, RTL dir, per-locale metadata
│   │   │   ├── page.tsx          # Main landing page
│   │   │   └── whitepaper/
│   │   │       └── page.tsx      # Localized whitepaper page
│   │   ├── error/                # Error UI
│   │   ├── not-found/            # 404 page
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Root entry
│   ├── components/
│   │   └── ui/                   # UI components (Navbar, Card, Button, TrustBadge,
│   │                             #   MethodologyDiagram, LearningLoopDiagram, Analytics, …)
│   ├── contexts/                 # React contexts (e.g. ThemeContext)
│   ├── hooks/                    # Custom hooks (analytics, image optimization)
│   ├── i18n/
│   │   ├── config.ts             # Locale list, RTL config, locale display names
│   │   ├── request.ts            # next-intl server request config + message loading
│   │   ├── navigation.ts         # next-intl navigation helpers
│   │   └── locales/              # 16 translation files (en.json, es.json, … ar.json)
│   ├── lib/                      # Utilities (class merge, web vitals)
│   ├── providers/                # App providers (analytics)
│   └── __tests__/                # Component and security tests
├── scripts/                      # Image-generation scripts
│   ├── generate-protocol-logos.js
│   └── generate-social-images.js
├── middleware.ts                 # next-intl locale routing middleware
├── next.config.js                # Next.js config (images, headers, bundling)
├── tailwind.config.js            # Tailwind theme + design tokens
├── jest.config.ts                # Jest configuration
├── netlify.toml                  # Netlify deployment config
├── vercel.json                   # Vercel deployment config
└── package.json
```

## Internationalization

Localization is handled with [next-intl](https://next-intl.dev/) and the Next.js App Router.

- **Supported locales (16):** English (`en`), Spanish (`es`), Portuguese (`pt`), French (`fr`), German (`de`), Chinese — Simplified (`zh`), Japanese (`ja`), Korean (`ko`), Arabic (`ar`, **RTL**), Russian (`ru`), Turkish (`tr`), Hindi (`hi`), Bengali (`bn`), Telugu (`te`), Tamil (`ta`), and Marathi (`mr`).
- **Routing:** pages live under `src/app/[locale]/...`. The locale prefix is `as-needed`, so the default locale (`en`) has no prefix (`/` and `/en` both work) while every other language is served under its prefix (for example `/fr`, `/ko`, `/ar`). Locale detection is enabled, and `hreflang` alternate links are emitted automatically.
- **Translation files:** one JSON file per locale in [`src/i18n/locales/`](src/i18n/locales). The single source of truth for the supported-locale list and RTL handling is [`src/i18n/config.ts`](src/i18n/config.ts).
- **RTL:** Arabic (`ar`) is rendered right-to-left. The locale layout sets the document `dir` based on the locale, so RTL is applied automatically.

### Editing or adding a translation

To **edit** copy, change the relevant key in each `src/i18n/locales/<locale>.json` file. User-facing strings are referenced by key (for example `t('hero.page.heroTitle')`), so update the value, not the key.

To **add a language**:

1. Add the locale code to the `locales` array in `src/i18n/config.ts` (and to `localeNames` / `localeFlags`; add it to `rtlLocales` if the script is right-to-left).
2. Create `src/i18n/locales/<locale>.json` with the same key structure as `en.json`.
3. Verify routing at `/<locale>` and run the test suite.

If a key is missing for a locale at runtime, next-intl falls back to a readable `namespace.key` reference rather than crashing (see [`src/i18n/request.ts`](src/i18n/request.ts)).

## Deployment

This site is configured for **both Netlify and Vercel** — either can build and host it from the same source.

- **Netlify** — [`netlify.toml`](netlify.toml): builds with `npm run build` using the `@netlify/plugin-nextjs` plugin, Node 20, and security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) plus long-lived caching for static assets.
- **Vercel** — [`vercel.json`](vercel.json): builds with `npm run build` using the `nextjs` framework preset, with an equivalent set of security headers and caching rules.

Additional security headers (including HSTS) are also applied in [`next.config.js`](next.config.js).

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, branching and commit conventions, the required checks (`lint`, `type-check`, `test`), and the internationalization rules before opening a pull request.

## Security

Found a security issue in **this website**? Please review our [Security Policy](SECURITY.md) and report it privately — do not open a public issue. Vulnerabilities in the Spectra platform itself should be reported through the platform's channels described in that policy.

## License

Released under the [MIT License](LICENSE).
