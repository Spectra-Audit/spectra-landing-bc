'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

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

interface ConsentData {
  analytics: boolean
  marketing: boolean
  functional: boolean
  timestamp: number
}

function readStoredConsent(): ConsentData | null {
  if (typeof window === 'undefined') return null
  try {
    const storedConsent = localStorage.getItem('cookie_consent')
    if (!storedConsent) return null
    const parsed = JSON.parse(storedConsent)
    const oneYear = 365 * 24 * 60 * 60 * 1000
    if (Date.now() - parsed.timestamp >= oneYear) return null
    return parsed as ConsentData
  } catch {
    return null
  }
}

export default function Analytics() {
  const t = useTranslations('cookieConsent')
  // Lazy initializer reads localStorage once on mount — no set-in-effect needed
  const [consent, setConsent] = useState<ConsentData | null>(readStoredConsent)
  const [showBanner, setShowBanner] = useState<boolean>(() => {
    const stored = readStoredConsent()
    // Show banner when there is no valid stored consent
    return stored === null
  })

  const loadAnalytics = () => {
    // Only load in production environment
    if (process.env.NODE_ENV !== 'production') return

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

  // On mount: if valid analytics consent already exists, load analytics scripts.
  // State is already initialized via lazy useState above — no setState needed here.
  useEffect(() => {
    if (consent?.analytics) {
      loadAnalytics()
    }
  }, [])

  const handleAccept = (preferences: Partial<ConsentData>) => {
    const newConsent: ConsentData = {
      analytics: preferences.analytics ?? true,
      marketing: preferences.marketing ?? false,
      functional: preferences.functional ?? true,
      timestamp: Date.now(),
    }

    setConsent(newConsent)
    localStorage.setItem('cookie_consent', JSON.stringify(newConsent))
    setShowBanner(false)

    // Load analytics if consent was given
    if (newConsent.analytics) {
      loadAnalytics()
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
    localStorage.setItem('cookie_consent', JSON.stringify(newConsent))
    setShowBanner(false)
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