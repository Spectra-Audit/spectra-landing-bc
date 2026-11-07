import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { Home, FileText } from 'lucide-react'
import { Navbar } from '@/components/ui'
import { localePath } from '@/lib/site'

/**
 * Localized 404 for everything under the `[locale]` segment.
 *
 * Next renders this file for any URL the middleware mapped onto a locale but
 * no route matched (`/zh/pricing`, `/foo`), and for an explicit `notFound()`
 * — e.g. the unknown-locale guard in this segment's layout. Before it
 * existed, those requests fell through to Next's built-in 404, which is
 * English-only ("404: This page could not be found."), unbranded, and ships
 * `<html>` with no `lang` attribute on all 16 locales.
 *
 * Server Component: no hooks, no browser APIs. The locale comes from the
 * request (`getLocale`), so the home and whitepaper links keep the visitor
 * inside the language they arrived in, and the Navbar's LanguageSelector is
 * there if they want a different one.
 *
 * `not-found.tsx` receives no `params`, which is why this reads the locale
 * from the request instead of a prop.
 *
 * Known limitation, measured on a production build: this markup is not in the
 * server response. The app has two root layouts and no `app/layout.tsx` above
 * them (see `app/(root)/layout.tsx`), so Next has no single root layout to
 * render a not-found boundary inside — it emits an internal error document
 * (`<html id="__next_error__">`, no `lang`) and leaves this content to
 * hydrate from the RSC payload, so `/zh/nope` arrives as
 * `<body><div hidden></div></body>` and is blank with JavaScript off.
 *
 * Two things were tried and did not help: co-locating a `not-found.tsx` in
 * the catch-all segment, and having this file render its own `<html>`/`<body>`
 * the way `global-error.tsx` must. Next replaced the document both times.
 *
 * It is still the better of the two available trades. The alternative —
 * rendering this as an ordinary page from the catch-all instead of throwing
 * `notFound()` — server-renders fine but answers HTTP 200, and a soft 404 is
 * exactly what the audit behind SPE-24 is trying to get rid of: the status
 * code is what makes a crawler drop the URL. Visitors with JavaScript (which
 * is all of them, in practice) get the localized page; crawlers get the 404.
 * Making it server-rendered too means collapsing the two root layouts into
 * one, which is a separate change — `(root)` exists to serve `/` if the
 * middleware ever fails to run, and that safety net is worth keeping until
 * someone decides otherwise.
 */
export default async function LocaleNotFound() {
  const locale = await getLocale()
  const t = await getTranslations('notFound')
  const tNav = await getTranslations('nav')

  const homeHref = localePath(locale)
  const whitepaperHref = localePath(locale, '/whitepaper')

  return (
    <div className="touch-manipulation">
      <Navbar />

      <main className="min-h-[70vh] flex items-center justify-center px-4 py-24 sm:py-32">
        <div className="text-center max-w-xl">
          <p className="text-display-lg font-display font-extrabold text-gradient-spectra mb-4">
            404
          </p>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-4">
            {t('title')}
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-10 leading-relaxed">
            {t('description')}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={homeHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-spectra-blue-500 to-spectra-purple-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <Home className="w-5 h-5" />
              {t('backHome')}
            </Link>

            <Link
              href={whitepaperHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold hover:border-spectra-blue-500 hover:text-spectra-blue-600 dark:hover:text-spectra-blue-400 transition-colors"
            >
              <FileText className="w-5 h-5" />
              {tNav('whitepaper')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
