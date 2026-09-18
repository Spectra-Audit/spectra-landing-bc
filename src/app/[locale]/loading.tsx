import SpectraLoader from '@/components/ui/SpectraLoader'

// Route-level loading UI for the whole `[locale]` segment. Next.js wraps
// this segment's `page.tsx` (the homepage) AND every nested route below it
// — currently just `[locale]/whitepaper` — in a Suspense boundary keyed to
// this file, so one `loading.tsx` here gives real coverage for both routes
// without needing a duplicate under `whitepaper/`. It does NOT cover this
// segment's own `layout.tsx` (the layout wraps the boundary, not the other
// way around) or the `(root)` route group (`/`, `/not-found`, `/error`),
// which has no async work worth covering — `(root)/page.tsx` just calls
// `redirect()`.
export default function LocaleLoading() {
  return <SpectraLoader variant="fullscreen" />
}
