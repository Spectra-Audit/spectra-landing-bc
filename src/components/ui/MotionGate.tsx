'use client'

import { useSyncExternalStore } from 'react'

/**
 * Renders `children` only when the visitor has NOT requested reduced motion.
 *
 * Extracted out of `MethodologyDiagram` so that component could become a
 * Server Component: SVG SMIL `<animateMotion>` isn't affected by CSS
 * `prefers-reduced-motion` overrides (unlike the CSS opacity pulse, which is
 * handled globally in globals.css), so skipping it requires a real
 * `matchMedia` read — a genuine browser API that can only run in a Client
 * Component.
 *
 * `useSyncExternalStore` gives a deterministic `false` on the server and the
 * real media-query value after hydration, so this never causes an
 * SSR/client hydration mismatch (see Lesson #065 / CLAUDE.md hydration-safety
 * note: no browser reads in a lazy `useState` initializer for new islands).
 */

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (mq.addEventListener) {
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }
  // Legacy fallback
  mq.addListener(cb)
  return () => mq.removeListener(cb)
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getServerSnapshot(): boolean {
  return false
}

export default function MotionGate({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (prefersReducedMotion) return null
  return <>{children}</>
}
