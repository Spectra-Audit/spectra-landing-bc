import { notFound } from 'next/navigation'

/**
 * Catch-all under `[locale]` whose only job is to 404.
 *
 * Without it, an unmatched URL matches no route at all, and Next falls back
 * to the GLOBAL not-found — it cannot infer that `/zh/pricing` belongs to the
 * `zh` segment. The global one is Next's built-in English page. Routing the
 * request through a real `[locale]` route instead means the `notFound()`
 * below is caught by `app/[locale]/not-found.tsx`, which renders in the
 * visitor's language inside the locale layout (so `<html lang>` and `dir` are
 * right too).
 *
 * This is the recipe next-intl documents for `localePrefix: 'as-needed'`:
 * https://next-intl.dev/docs/environments/error-files#catching-unknown-routes
 *
 * Requests the middleware does not rewrite onto a locale (anything with a
 * file extension, `/api/*`, `/_next/*` — see `middleware.ts`'s matcher) still
 * get the built-in 404. Those are not pages anyone browses to.
 */
export default function CatchAllNotFound() {
  notFound()
}
