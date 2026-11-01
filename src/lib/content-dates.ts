// Real content modification dates for pages that expose dates to crawlers.
// Bump the matching entry when a page's visible content changes substantively.
// Deliberately NOT `new Date()`: a build-time timestamp makes every page claim
// it changed today, which search engines learn to ignore (SPE-4 G4).
export const WHITEPAPER_PUBLISHED = '2026-01-12'
export const WHITEPAPER_MODIFIED = '2026-09-25'
