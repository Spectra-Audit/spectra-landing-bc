'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import {
  CONSENT_STORAGE_KEY,
  clearNonEssentialStorage,
  readStoredConsent,
  type ConsentData,
} from '@/lib/consent'

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer: any[]
    performanceData?: {
      loadTime: number
      domContentLoaded: number
      firstPaint: number
    }
  }
}

export default function Analytics() {
  const t = useTranslations('cookieConsent')
  // Visibility MUST NOT be decided during render. This page is prerendered,
  // and the server cannot read localStorage, so a render-time decision bakes
  // the banner into the static HTML; a returning visitor's first client render
  // then disagrees with that markup and the stale banner survives hydration
  // as dead DOM (SPE-18: "re-appears despite Accept All", clicks ignored).
  // Instead: render nothing until mounted, then decide from storage.
  const [consent, setConsent] = useState<ConsentData | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const applyStoredConsent = () => {
      const stored = readStoredConsent()
      setConsent(stored)
      // Ask only when there is no valid stored choice.
      setShowBanner(stored === null)
    }

    applyStoredConsent()
  }, [])

  const analyticsLoaded = useRef(false)

  const loadAnalytics = () => {
    // Only load in production environment
    if (process.env.NODE_ENV !== 'production') return
    // Reachable from the consent click and from the returning-visitor effect;
    // injecting the GA4 tag twice would double-count every page view.
    if (analyticsLoaded.current) return
    analyticsLoaded.current = true

    // Google Analytics 4
    const gtagId = process.env.NEXT_PUBLIC_GA_ID
    if (gtagId) {
      // Load gtag script
      const script1 = document.createElement('script')
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
      document.head.appendChild(script1)

      const script2 = document.createElement('script')
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gtagId}', {
          anonymize_ip: true,
          cookie_flags: 'SameSite=Lax;Secure',
          send_page_view: false
        });
      `
      document.head.appendChild(script2)

      // Track page view
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
        })
      }
    }

    // Custom analytics endpoint (if configured)
    const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT
    if (analyticsEndpoint) {
      trackCustomEvent('page_view', {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      })
    }
  }

  const trackCustomEvent = (eventName: string, properties: Record<string, any>) => {
    // Only track if analytics consent is given
    if (!consent?.analytics) return

    // Send to Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, {
        ...properties,
        custom_map: properties,
      })
    }

    // Send to custom analytics endpoint
    const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT
    if (analyticsEndpoint) {
      fetch(analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventName,
          properties: {
            ...properties,
            url: window.location.href,
            timestamp: new Date().toISOString(),
          },
        }),
      }).catch((error) => {
        console.warn('Failed to send custom analytics event:', error)
      })
    }
  }

  // Once consent is known (from storage on mount, or from a click), load
  // analytics if it was granted. loadAnalytics() is idempotent.
  useEffect(() => {
    if (consent?.analytics) {
      loadAnalytics()
    }
    // loadAnalytics is deliberately omitted: it is re-created each render but
    // guarded by the analyticsLoaded ref, so adding it would only re-run a no-op.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent])

  const handleAccept = (preferences: Partial<ConsentData>) => {
    const newConsent: ConsentData = {
      analytics: preferences.analytics ?? true,
      marketing: preferences.marketing ?? false,
      functional: preferences.functional ?? true,
      timestamp: Date.now(),
    }

    setConsent(newConsent)
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsent))
    setShowBanner(false)

    // Load analytics if consent was given
    if (newConsent.analytics) {
      loadAnalytics()
    } else {
      // "Accept Essential" declines analytics, so withhold non-essential
      // storage exactly as a full rejection would.
      clearNonEssentialStorage()
    }

    // Track consent event
    if (newConsent.analytics) {
      setTimeout(() => {
        trackCustomEvent('cookie_consent_given', {
          consent_type: 'custom',
          analytics: true,
          marketing: newConsent.marketing,
        })
      }, 1000)
    }
  }

  const handleReject = () => {
    const newConsent: ConsentData = {
      analytics: false,
      marketing: false,
      functional: true, // Essential cookies
      timestamp: Date.now(),
    }

    setConsent(newConsent)
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsent))
    setShowBanner(false)

    // Rejection must also remove anything non-essential already stored.
    clearNonEssentialStorage()
  }

  if (!showBanner || consent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 p-4 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-white text-sm mb-2">
              <span className="font-medium">{t('noticeLabel')}</span> {t('message')}
            </p>
            <p className="text-neutral-400 text-xs">
              {t('details')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleAccept({ analytics: false, marketing: false })}
              className="px-4 py-2 bg-security-green text-white rounded hover:bg-security-green/90 transition-colors text-sm font-medium"
            >
              {t('acceptEssential')}
            </button>
            <button
              onClick={() => handleAccept({ analytics: true, marketing: true })}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              {t('acceptAll')}
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 border border-neutral-600 text-neutral-300 rounded hover:bg-neutral-800 transition-colors text-sm"
            >
              {t('rejectAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export analytics functions for use in other components
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // This will be called from other components
  // We'll need to ensure analytics is loaded first
  if (typeof window !== 'undefined' && (window as any).analyticsReady) {
    const event = new CustomEvent('trackAnalytics', {
      detail: { eventName, properties },
    })
    window.dispatchEvent(event)
  }
}

// Performance monitoring integration
export const trackPerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const loadTime = navigation.loadEventEnd - navigation.fetchStart

      trackEvent('page_performance', {
        load_time: loadTime,
        dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        first_contentful_paint: navigation.responseStart - navigation.fetchStart,
      })
    })
  }
}