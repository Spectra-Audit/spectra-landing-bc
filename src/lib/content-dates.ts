// Real content modification dates for pages that expose dates to crawlers.
// Bump the matching entry when a page's visible content changes substantively.
// Deliberately NOT `new Date()`: a build-time timestamp makes every page claim
// it changed today, which search engines learn to ignore (SPE-4 G4).
export const WHITEPAPER_PUBLISHED = '2026-01-12'
export const WHITEPAPER_MODIFIED = '2026-09-25'

// --- sitemap `lastmod` source (SPE-4 P0-2 / G4) -----------------------------
//
// Keyed by the same `sub` path `localePath`/`absoluteLocaleUrl` take, so the
// sitemap can look a page up by the thing it already has. A page absent from
// this map gets NO `lastmod` at all — an omitted date is a true statement,
// whereas a guessed one is a lie that costs us the signal permanently.
//
// These are hardcoded rather than read from git at build time on purpose: CI
// builds from shallow clones where `git log` has no history to report, so a
// build-time lookup would silently degrade to "no date" or to the clone date.
// The cost is that a human must bump the entry; the comment above each one
// records where its current value came from so that bump is checkable.
//
// MAINTENANCE: changing a page's visible copy (including its translations in
// `src/i18n/locales/*.json`) means bumping its date here in the same commit.
export const PAGE_CONTENT_MODIFIED: Record<string, string> = {
  // Home. Last substantive content change: hero score relabelled "Sample" and
  // wired to a real report (8584131), plus the CTA links made real (7f7e2d3).
  '': '2026-11-07',

  // Whitepaper. Tracks the document's own editorial date, which is also what
  // the page's JSON-LD reports as `dateModified` — the two must not disagree.
  // Note this is deliberately NOT the last commit date for
  // `whitepaper/page.tsx`: the 2026-11-07 commits there were i18n and 404
  // plumbing, which changed no whitepaper prose.
  '/whitepaper': WHITEPAPER_MODIFIED,

  // Sample report. Added as a standalone English document in 8584131.
  '/sample-report': '2026-11-07',
}
