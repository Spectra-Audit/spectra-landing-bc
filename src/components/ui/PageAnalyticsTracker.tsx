'use client'

import { useEffect, useState } from 'react'
import { useUmamiAnalytics } from '@/hooks/useUmamiAnalytics'

/**
 * Render-nothing client island that owns the home page's page-view /
 * scroll-depth / engagement-milestone / page-exit analytics side effects.
 *
 * Extracted out of the home page's default export so the page itself could
 * become a Server Component — this is the only piece of that component that
 * actually needed to run on the client (everything it does lives in
 * `useEffect`; there was never any render output tied to it).
 */
export default function PageAnalyticsTracker() {
  const [timeOnPage, setTimeOnPage] = useState(0)
  const {
    trackPageView,
    trackScrollDepth,
    trackEngagementMilestone,
    trackPageExit,
  } = useUmamiAnalytics()

  useEffect(() => {
    trackPageView('home', document.referrer)

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      if (scrollPercent >= 25 && scrollPercent < 50) {
        trackScrollDepth(25)
      } else if (scrollPercent >= 50 && scrollPercent < 75) {
        trackScrollDepth(50)
      } else if (scrollPercent >= 75 && scrollPercent < 90) {
        trackScrollDepth(75)
      } else if (scrollPercent >= 90) {
        trackScrollDepth(90)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Track engagement milestones
    const milestones = [10, 30, 60, 180, 300] // seconds
    const milestoneInterval = setInterval(() => {
      setTimeOnPage(prev => {
        const newTime = prev + 1
        if (milestones.includes(newTime)) {
          trackEngagementMilestone(newTime)
        }
        return newTime
      })
    }, 1000)

    // Track page exit
    window.addEventListener('beforeunload', () => {
      trackPageExit(timeOnPage)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(milestoneInterval)
    }
  }, [])

  return null
}
