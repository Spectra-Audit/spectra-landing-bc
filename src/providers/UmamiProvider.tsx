'use client'

import { useEffect, useState, createContext, useContext, ReactNode, useCallback } from 'react'

// Umami Website ID for Target B
const UMAMI_WEBSITE_ID = 'acdf9f95-bc94-40e1-a3f6-3a952c4c6728'
const UMAMI_HOST = 'https://cloud.umami.is'

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

  // Initialize session from localStorage
  useEffect(() => {
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

    // Load Umami script
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = `${UMAMI_HOST}/script.js`
    script.setAttribute('data-website-id', UMAMI_WEBSITE_ID)
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

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const identifyUser = useCallback(async (userId: string, walletAddress?: string) => {
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
  }, [currentUser.sessionId]);

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

    const newSessionId = generateSessionId();
    localStorage.setItem('umami_session_id', newSessionId);

    setCurrentUser({
      sessionId: newSessionId,
    });

    trackEvent('session_reset', {
      new_session_id: newSessionId,
    });
  }, []);

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

  const value: UmamiContextValue = {
    trackEvent,
    isReady,
    identifyUser,
    getCurrentUser,
    resetSession,
  }

  return <UmamiContext.Provider value={value}>{children}</UmamiContext.Provider>
}
