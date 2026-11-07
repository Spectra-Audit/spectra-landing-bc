'use client'

import { useEffect, useState, createContext, useContext, ReactNode, useCallback } from 'react'

import { clearNonEssentialStorage, hasAnalyticsConsent } from '@/lib/consent'

// Umami config is supplied via environment variables. If NEXT_PUBLIC_UMAMI_WEBSITE_ID
// is not set, Umami is a clean no-op and no script is ever injected.
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const UMAMI_HOST = process.env.NEXT_PUBLIC_UMAMI_HOST || 'https://cloud.umami.is'

// Type declarations for Umami
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void
    }
  }
}

interface UmamiContextValue {
  trackEvent: (eventName: string, eventData?: Record<string, unknown>) => void
  isReady: boolean
  identifyUser: (userId: string, walletAddress?: string) => Promise<void>
  getCurrentUser: () => { userId?: string; walletAddress?: string; sessionId: string } | null
  resetSession: () => void
}

const UmamiContext = createContext<UmamiContextValue>({
  trackEvent: () => {},
  isReady: false,
  identifyUser: async () => {},
  getCurrentUser: () => null,
  resetSession: () => {},
})

export const useUmami = () => useContext(UmamiContext)

interface UmamiProviderProps {
  children: ReactNode
}

// Hash wallet address for privacy
async function hashWalletAddress(address: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(address.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate session ID
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export function UmamiProvider({ children }: UmamiProviderProps) {
  const [isReady, setIsReady] = useState(false)
  const [currentUser, setCurrentUser] = useState<{
    userId?: string;
    walletAddress?: string;
    sessionId: string;
  }>({
    sessionId: '',
  });

  // Single consent gate for everything non-essential this provider does.
  // The cookie banner (Analytics.tsx) writes localStorage in the same tab
  // without emitting an event, so until a choice is made we poll for it.
  const [consentGranted, setConsentGranted] = useState(hasAnalyticsConsent)

  useEffect(() => {
    if (consentGranted) return

    // No choice yet, or "Reject All": leave nothing non-essential on the
    // device, then watch for a later "Accept" in this same tab.
    clearNonEssentialStorage()

    const consentPoll = setInterval(() => {
      if (hasAnalyticsConsent()) {
        clearInterval(consentPoll)
        setConsentGranted(true)
      }
    }, 1000)

    return () => clearInterval(consentPoll)
  }, [consentGranted])

  // Session identifiers are non-essential analytics storage: read or create
  // them only once analytics consent exists.
  useEffect(() => {
    if (!consentGranted) return

    const initializeSession = () => {
      const savedSession = localStorage.getItem('umami_session_id');
      const savedUserId = localStorage.getItem('umami_user_id');
      const savedWallet = localStorage.getItem('umami_wallet_hash');

      const sessionId = savedSession || generateSessionId();

      if (!savedSession) {
        localStorage.setItem('umami_session_id', sessionId);
      }

      setCurrentUser({
        sessionId,
        userId: savedUserId || undefined,
        walletAddress: savedWallet || undefined,
      });
    };

    initializeSession();
  }, [consentGranted])

  // trackEvent is declared first so that the script-load effect below and the
  // identifyUser/resetSession callbacks below can reference it without triggering
  // the react-hooks/immutability "accessed before declared" error.
  const trackEvent = useCallback((eventName: string, eventData?: Record<string, unknown>) => {
    // Enrich all events with session and user data
    const enrichedData = {
      ...eventData,
      session_id: currentUser.sessionId,
      ...(currentUser.userId && { user_id: currentUser.userId }),
      ...(currentUser.walletAddress && { wallet_hash: currentUser.walletAddress }),
    };

    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track(eventName, enrichedData)
    } else {
      console.log('Umami not ready, queuing event:', eventName, enrichedData)
    }
  }, [currentUser]);

  // Load the Umami script only when:
  //   1. a website ID is configured (env-gated — no hardcoded ID in source),
  //   2. we are in production (matches Analytics.tsx's loadAnalytics gate), and
  //   3. the visitor has granted analytics cookie consent (same banner as GA).
  useEffect(() => {
    if (!consentGranted) return
    if (!UMAMI_WEBSITE_ID) return
    if (process.env.NODE_ENV !== 'production') return

    let script: HTMLScriptElement | null = null

    const injectScript = () => {
      script = document.createElement('script')
      script.async = true
      script.defer = true
      script.src = `${UMAMI_HOST}/script.js`
      script.setAttribute('data-website-id', UMAMI_WEBSITE_ID as string)
      script.setAttribute('data-auto-track', 'false')

      script.onload = () => {
        const checkUmami = () => {
          if (window.umami) {
            setIsReady(true)
            trackEvent('session_started', {
              session_id: currentUser.sessionId,
              is_new_session: !localStorage.getItem('umami_session_returning'),
              has_existing_user: !!localStorage.getItem('umami_user_id'),
            })
            localStorage.setItem('umami_session_returning', 'true')
          } else {
            setTimeout(checkUmami, 100)
          }
        }
        checkUmami()
      }

      script.onerror = () => {
        console.warn('Failed to load Umami analytics')
      }

      document.head.appendChild(script)
    }

    injectScript()

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [consentGranted])

  const identifyUser = useCallback(async (userId: string, walletAddress?: string) => {
    // Identifiers are non-essential storage: refuse to persist them until the
    // visitor has granted analytics consent.
    if (!hasAnalyticsConsent()) return

    let walletHash: string | undefined;

    if (walletAddress) {
      walletHash = await hashWalletAddress(walletAddress);
      localStorage.setItem('umami_wallet_hash', walletHash);
    }

    localStorage.setItem('umami_user_id', userId);

    setCurrentUser({
      sessionId: currentUser.sessionId,
      userId,
      walletAddress: walletHash,
    });

    trackEvent('user_identified', {
      user_id: userId,
      has_wallet: !!walletAddress,
      session_id: currentUser.sessionId,
    });
  }, [currentUser.sessionId, trackEvent]);

  const getCurrentUser = useCallback(() => {
    if (currentUser.userId || currentUser.walletAddress) {
      return {
        userId: currentUser.userId,
        walletAddress: currentUser.walletAddress,
        sessionId: currentUser.sessionId,
      };
    }
    return {
      sessionId: currentUser.sessionId,
    };
  }, [currentUser]);

  const resetSession = useCallback(() => {
    localStorage.removeItem('umami_user_id');
    localStorage.removeItem('umami_wallet_hash');

    // Without consent, reset means "leave nothing behind" rather than
    // "start a fresh tracked session".
    if (!hasAnalyticsConsent()) {
      clearNonEssentialStorage()
      setCurrentUser({ sessionId: '' })
      return
    }

    const newSessionId = generateSessionId();
    localStorage.setItem('umami_session_id', newSessionId);

    setCurrentUser({
      sessionId: newSessionId,
    });

    trackEvent('session_reset', {
      new_session_id: newSessionId,
    });
  }, [trackEvent]);

  const value: UmamiContextValue = {
    trackEvent,
    isReady,
    identifyUser,
    getCurrentUser,
    resetSession,
  }

  return <UmamiContext.Provider value={value}>{children}</UmamiContext.Provider>
}
