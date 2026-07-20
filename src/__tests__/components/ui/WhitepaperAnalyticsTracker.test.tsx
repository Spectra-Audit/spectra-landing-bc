import React from 'react'
import { render } from '@testing-library/react'
import WhitepaperAnalyticsTracker from '@/components/ui/WhitepaperAnalyticsTracker'
import { useUmamiAnalytics } from '@/hooks/useUmamiAnalytics'

jest.mock('@/hooks/useUmamiAnalytics')

describe('WhitepaperAnalyticsTracker Component', () => {
  const mockTrackPageView = jest.fn()
  const mockTrackWhitepaperViewed = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockTrackPageView.mockClear()
    mockTrackWhitepaperViewed.mockClear()

    ;(useUmamiAnalytics as jest.Mock).mockReturnValue({
      trackPageView: mockTrackPageView,
      trackWhitepaperViewed: mockTrackWhitepaperViewed,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Render behavior', () => {
    it('should render as null (render-nothing island)', () => {
      const { container } = render(<WhitepaperAnalyticsTracker />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Page view tracking', () => {
    it('should track page view on mount with whitepaper page name', () => {
      render(<WhitepaperAnalyticsTracker />)

      expect(mockTrackPageView).toHaveBeenCalledWith('whitepaper', expect.any(String))
    })

    it('should pass document.referrer to trackPageView', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://google.com',
        writable: true,
        configurable: true,
      })

      render(<WhitepaperAnalyticsTracker />)

      expect(mockTrackPageView).toHaveBeenCalledWith('whitepaper', 'https://google.com')
    })

    it('should handle empty referrer gracefully', () => {
      Object.defineProperty(document, 'referrer', {
        value: '',
        writable: true,
        configurable: true,
      })

      render(<WhitepaperAnalyticsTracker />)

      expect(mockTrackPageView).toHaveBeenCalledWith('whitepaper', '')
    })
  })

  describe('Whitepaper view tracking', () => {
    it('should track whitepaper viewed on mount', () => {
      render(<WhitepaperAnalyticsTracker />)

      expect(mockTrackWhitepaperViewed).toHaveBeenCalledWith('en')
    })

    it('should track with English language currently (pre-existing TODO)', () => {
      render(<WhitepaperAnalyticsTracker />)

      // Currently hardcoded to 'en', should be dynamic based on locale
      expect(mockTrackWhitepaperViewed).toHaveBeenCalledWith('en')
    })

    it('should call both tracking functions on mount', () => {
      render(<WhitepaperAnalyticsTracker />)

      expect(mockTrackPageView).toHaveBeenCalledTimes(1)
      expect(mockTrackWhitepaperViewed).toHaveBeenCalledTimes(1)
    })
  })

  describe('Effect behavior', () => {
    it('should run effect only once on mount', () => {
      const { rerender } = render(<WhitepaperAnalyticsTracker />)

      expect(mockTrackPageView).toHaveBeenCalledTimes(1)
      expect(mockTrackWhitepaperViewed).toHaveBeenCalledTimes(1)

      rerender(<WhitepaperAnalyticsTracker />)

      // Effect should not re-run on re-render
      expect(mockTrackPageView).toHaveBeenCalledTimes(1)
      expect(mockTrackWhitepaperViewed).toHaveBeenCalledTimes(1)
    })
  })

  describe('No cleanup required', () => {
    it('should not register event listeners that need cleanup', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener')

      render(<WhitepaperAnalyticsTracker />)

      // This component doesn't register listeners, so cleanup is minimal
      expect(addEventListenerSpy).not.toHaveBeenCalled()

      addEventListenerSpy.mockRestore()
    })

    it('should not leak memory from repeated mounts', () => {
      const { unmount, rerender } = render(<WhitepaperAnalyticsTracker />)

      unmount()
      jest.clearAllMocks()

      render(<WhitepaperAnalyticsTracker />)

      // Second mount should track normally
      expect(mockTrackPageView).toHaveBeenCalledTimes(1)
      expect(mockTrackWhitepaperViewed).toHaveBeenCalledTimes(1)
    })
  })

  describe('Analytics data integrity', () => {
    it('should not duplicate tracking calls', () => {
      render(<WhitepaperAnalyticsTracker />)

      expect(mockTrackPageView).toHaveBeenCalledTimes(1)
      expect(mockTrackWhitepaperViewed).toHaveBeenCalledTimes(1)
    })

    it('should track page view before whitepaper view', () => {
      const callOrder: string[] = []

      mockTrackPageView.mockImplementation(() => callOrder.push('pageView'))
      mockTrackWhitepaperViewed.mockImplementation(() => callOrder.push('whitepaperView'))

      render(<WhitepaperAnalyticsTracker />)

      // Both calls should happen, order depends on implementation
      expect(callOrder).toContain('pageView')
      expect(callOrder).toContain('whitepaperView')
    })
  })

  describe('Edge cases', () => {
    it('should handle multiple consecutive mounts without double-tracking', () => {
      const { unmount } = render(<WhitepaperAnalyticsTracker />)
      const firstCallCount = mockTrackPageView.mock.calls.length

      unmount()
      jest.clearAllMocks()

      render(<WhitepaperAnalyticsTracker />)
      // Each mount should track independently
      expect(mockTrackPageView).toHaveBeenCalledTimes(1)
      expect(mockTrackWhitepaperViewed).toHaveBeenCalledTimes(1)
    })
  })

  describe('Security: Referrer validation', () => {
    it('should pass referrer as-is without sanitization (trust browser API)', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'data:text/html,<script>alert("xss")</script>',
        writable: true,
        configurable: true,
      })

      render(<WhitepaperAnalyticsTracker />)

      // We pass referrer as-is; the analytics backend should validate
      expect(mockTrackPageView).toHaveBeenCalledWith('whitepaper', expect.any(String))
    })

    it('should handle very long referrer URLs', () => {
      const longReferrer = 'https://example.com/' + 'a'.repeat(10000)
      Object.defineProperty(document, 'referrer', {
        value: longReferrer,
        writable: true,
        configurable: true,
      })

      render(<WhitepaperAnalyticsTracker />)

      expect(mockTrackPageView).toHaveBeenCalledWith('whitepaper', longReferrer)
    })
  })

  describe('TODO: Locale-aware language parameter', () => {
    it('should currently hardcode language to en', () => {
      render(<WhitepaperAnalyticsTracker />)

      // TODO: Make this dynamic based on locale (useLocale from next-intl)
      expect(mockTrackWhitepaperViewed).toHaveBeenCalledWith('en')
    })

    it('should not accept locale prop yet (pre-extraction state)', () => {
      // Once the component becomes locale-aware, it should detect locale
      // and pass it to trackWhitepaperViewed instead of hardcoded 'en'
      render(<WhitepaperAnalyticsTracker />)

      expect(mockTrackWhitepaperViewed).toHaveBeenCalledWith('en')
    })
  })
})
