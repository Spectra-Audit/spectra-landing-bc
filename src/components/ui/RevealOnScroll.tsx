'use client'

import { useEffect } from 'react'

/**
 * Render-nothing client island that attaches an IntersectionObserver to
 * every server-rendered `[data-reveal]` element on the page and adds
 * `.is-visible` as each one scrolls into view.
 *
 * Progressive enhancement: the content behind `[data-reveal]` is always
 * server-rendered and visible; the hidden state is gated on the
 * `.reveal-init` class this effect adds to `<html>`, so no-JS users (and
 * users before hydration) see everything immediately.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) return

    document.documentElement.classList.add('reveal-init')
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reveal = (el: Element) => el.classList.add('is-visible')

    // Trigger ~200px before an element enters the viewport so nothing pops in
    // late. threshold 0 = reveal on the first visible pixel.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target)
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px 200px 0px', threshold: 0 }
    )
    els.forEach((el) => io.observe(el))

    // Failsafe: never leave content hidden. If the observer misses anything
    // (fast scroll, restored scroll position, slow device), force-reveal all.
    const failsafe = window.setTimeout(() => els.forEach(reveal), 2500)
    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])

  return null
}
