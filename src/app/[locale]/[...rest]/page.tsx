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
 *
 * This file must stay OUTSIDE the `(pages)` route group. A Suspense boundary
 * above it — which is what `(pages)/loading.tsx` is — makes Next flush the
 * streamed shell, and a 200 status with it, before this component runs, so
 * the 404 below degrades into a soft 404. Measured on a production build:
 * with `loading.tsx` directly under `[locale]`, `/zh/nope` answered 200;
 * with it inside the group, 404.
 */
export default function CatchAllNotFound() {
  notFound()
}
