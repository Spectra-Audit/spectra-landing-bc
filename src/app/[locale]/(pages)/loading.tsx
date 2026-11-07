import SpectraLoader from '@/components/ui/SpectraLoader'

// Loading UI for the site's real pages: the homepage and `/whitepaper`.
// Next wraps everything in this route group in a Suspense boundary keyed to
// this file, so one `loading.tsx` covers both routes without a duplicate
// under `whitepaper/`. It does NOT cover `[locale]/layout.tsx` (the layout
// wraps the boundary, not the other way around) or the `(root)` route group,
// which has no async work worth covering.
//
// The `(pages)` group is why this sits one level below `[locale]` rather than
// directly inside it: a Suspense boundary above a route makes Next flush the
// streamed shell — and with it a 200 status — before the route finishes
// rendering, which turns the `notFound()` in `[locale]/[...rest]/page.tsx`
// into a soft 404. Keeping the boundary inside the group leaves the catch-all
// outside it, so unknown URLs still answer with a real 404 status. Route
// groups do not appear in the URL, so nothing about these two routes changed.
export default function PagesLoading() {
  return <SpectraLoader variant="fullscreen" />
}
