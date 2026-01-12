'use client'

import { useCallback } from 'react'
import { useUmami } from '@/providers/UmamiProvider'

// Event name constants for type safety
export const UMAMI_EVENTS = {
  // Page events
  PAGE_VIEW: 'page_view',
  PAGE_EXIT: 'page_exit',
  SCROLL_DEPTH: 'scroll_depth_reached',
  ENGAGEMENT_MILESTONE: 'engagement_milestone',

  // Navigation events
  NAV_CLICKED: 'nav_clicked',
  BREADCRUMB_CLICKED: 'breadcrumb_clicked',
  FOOTER_LINK_CLICKED: 'footer_link_clicked',

  // CTA events
  HERO_CTA_CLICKED: 'hero_cta_clicked',
  LAUNCH_APP_CLICKED: 'launch_app_clicked',
  WHITEPAPER_DOWNLOADED: 'whitepaper_downloaded',
  WHITEPAPER_VIEWED: 'whitepaper_viewed',

  // Language events
  LANGUAGE_CHANGED: 'language_changed',

  // Theme events
  THEME_TOGGLED: 'theme_toggled',

  // Feature events
  FEATURE_VIEWED: 'feature_viewed',
  TRUST_BADGE_VIEWED: 'trust_badge_viewed',
  GRADE_DISPLAY_VIEWED: 'grade_display_viewed',

  // Form events
  NEWSLETTER_SUBSCRIBED: 'newsletter_subscribed',
  FORM_SUBMITTED: 'form_submitted',

  // User & Session events
  USER_IDENTIFIED: 'user_identified',
  WALLET_CONNECTED: 'wallet_connected',
  BACKEND_USER_LOGGED_IN: 'backend_user_logged_in',
} as const

export const useUmamiAnalytics = () => {
  const { trackEvent, isReady, identifyUser, getCurrentUser, resetSession } = useUmami()

  // Page tracking
  const trackPageView = useCallback(
    (page: string, referrer?: string) => {
      trackEvent(UMAMI_EVENTS.PAGE_VIEW, {
        page,
        referrer: referrer || 'direct',
        language: navigator.language || 'unknown',
        timestamp: new Date().toISOString(),
      })
    },
    [trackEvent]
  )

  const trackPageExit = useCallback(
    (timeOnPage: number) => {
      trackEvent(UMAMI_EVENTS.PAGE_EXIT, {
        seconds_on_page: timeOnPage,
        page: window.location.pathname,
      })
    },
    [trackEvent]
  )

  const trackScrollDepth = useCallback(
    (depth: number) => {
      trackEvent(UMAMI_EVENTS.SCROLL_DEPTH, {
        depth,
        page: window.location.pathname,
      })
    },
    [trackEvent]
  )

  const trackEngagementMilestone = useCallback(
    (seconds: number) => {
      trackEvent(UMAMI_EVENTS.ENGAGEMENT_MILESTONE, {
        seconds,
        page: window.location.pathname,
      })
    },
    [trackEvent]
  )

  // Navigation tracking
  const trackNavClicked = useCallback(
    (destination: string, location: 'primary' | 'mobile' | 'footer') => {
      trackEvent(UMAMI_EVENTS.NAV_CLICKED, {
        destination,
        location,
        current_page: window.location.pathname,
      })
    },
    [trackEvent]
  )

  const trackBreadcrumbClicked = useCallback(
    (destination: string) => {
      trackEvent(UMAMI_EVENTS.BREADCRUMB_CLICKED, {
        destination,
        current_page: window.location.pathname,
      })
    },
    [trackEvent]
  )

  // CTA tracking
  const trackHeroCtaClicked = useCallback(
    (buttonText: string, buttonType: 'primary' | 'secondary') => {
      trackEvent(UMAMI_EVENTS.HERO_CTA_CLICKED, {
        button: buttonText,
        type: buttonType,
        page: window.location.pathname,
        location: 'hero',
      })
    },
    [trackEvent]
  )

  const trackLaunchAppClicked = useCallback(
    (location: 'header' | 'hero' | 'footer') => {
      trackEvent(UMAMI_EVENTS.LAUNCH_APP_CLICKED, {
        location,
        current_page: window.location.pathname,
      })
    },
    [trackEvent]
  )

  const trackWhitepaperViewed = useCallback(
    (language: string) => {
      trackEvent(UMAMI_EVENTS.WHITEPAPER_VIEWED, {
        language,
        referrer: document.referrer,
      })
    },
    [trackEvent]
  )

  const trackWhitepaperDownloaded = useCallback(
    (format: 'pdf' | 'epub', language: string) => {
      trackEvent(UMAMI_EVENTS.WHITEPAPER_DOWNLOADED, {
        format,
        language,
      })
    },
    [trackEvent]
  )

  // Language tracking
  const trackLanguageChanged = useCallback(
    (fromLocale: string, toLocale: string) => {
      trackEvent(UMAMI_EVENTS.LANGUAGE_CHANGED, {
        from_language: fromLocale,
        to_language: toLocale,
      })
    },
    [trackEvent]
  )

  // Theme tracking
  const trackThemeToggled = useCallback(
    (fromTheme: 'light' | 'dark', toTheme: 'light' | 'dark') => {
      trackEvent(UMAMI_EVENTS.THEME_TOGGLED, {
        from_theme: fromTheme,
        to_theme: toTheme,
      })
    },
    [trackEvent]
  )

  // Feature tracking
  const trackFeatureViewed = useCallback(
    (featureName: string) => {
      trackEvent(UMAMI_EVENTS.FEATURE_VIEWED, {
        feature: featureName,
        page: window.location.pathname,
      })
    },
    [trackEvent]
  )

  const trackTrustBadgeViewed = useCallback(
    (badgeType: string) => {
      trackEvent(UMAMI_EVENTS.TRUST_BADGE_VIEWED, {
        badge_type: badgeType,
      })
    },
    [trackEvent]
  )

  // Form tracking
  const trackNewsletterSubscribed = useCallback(
    (email?: string) => {
      trackEvent(UMAMI_EVENTS.NEWSLETTER_SUBSCRIBED, {
        has_email: !!email,
        page: window.location.pathname,
      })
    },
    [trackEvent]
  )

  const trackFormSubmitted = useCallback(
    (formType: string) => {
      trackEvent(UMAMI_EVENTS.FORM_SUBMITTED, {
        form_type: formType,
        page: window.location.pathname,
      })
    },
    [trackEvent]
  )

  // Generic event tracking
  const track = useCallback(
    (eventName: string, eventData?: Record<string, unknown>) => {
      trackEvent(eventName, eventData)
    },
    [trackEvent]
  )

  return {
    isReady,

    // User & Session Management
    identifyUser,
    getCurrentUser,
    resetSession,
    identifyBackendUser: identifyUser,

    // Event Tracking
    track,
    trackPageView,
    trackPageExit,
    trackScrollDepth,
    trackEngagementMilestone,
    trackNavClicked,
    trackBreadcrumbClicked,
    trackHeroCtaClicked,
    trackLaunchAppClicked,
    trackWhitepaperViewed,
    trackWhitepaperDownloaded,
    trackLanguageChanged,
    trackThemeToggled,
    trackFeatureViewed,
    trackTrustBadgeViewed,
    trackNewsletterSubscribed,
    trackFormSubmitted,
  }
}
