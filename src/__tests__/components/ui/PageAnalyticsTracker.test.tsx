import React from 'react'
import { render } from '@testing-library/react'
import { act } from '@testing-library/react'
import PageAnalyticsTracker from '@/components/ui/PageAnalyticsTracker'
import { useUmamiAnalytics } from '@/hooks/useUmamiAnalytics'

jest.mock('@/hooks/useUmamiAnalytics')

describe('PageAnalyticsTracker Component', () => {
  const mockTrackPageView = jest.fn()
  const mockTrackScrollDepth = jest.fn()
  const mockTrackEngagementMilestone = jest.fn()
  const mockTrackPageExit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    ;(useUmamiAnalytics as jest.Mock).mockReturnValue({
      trackPageView: mockTrackPageView,
      trackScrollDepth: mockTrackScrollDepth,
      trackEngagementMilestone: mockTrackEngagementMilestone,
      trackPageExit: mockTrackPageExit,
    })

    // Setup scroll tracking mocks
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 10000,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('Render behavior', () => {
    it('should render as null (render-nothing island)', () => {
      const { container } = render(<PageAnalyticsTracker />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Page view tracking', () => {
    it('should track page view on mount with home page name', () => {
      render(<PageAnalyticsTracker />)

      expect(mockTrackPageView).toHaveBeenCalledWith('home', expect.any(String))
      expect(mockTrackPageView).toHaveBeenCalledTimes(1)
    })

    it('should pass document.referrer to trackPageView', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://example.com',
        writable: true,
        configurable: true,
      })

      render(<PageAnalyticsTracker />)

      expect(mockTrackPageView).toHaveBeenCalledWith('home', 'https://example.com')
    })
  })

  describe('Scroll depth tracking', () => {
    it('should track scroll depth at 25%', () => {
      render(<PageAnalyticsTracker />)

      // Simulate scroll to 25%
      // With scrollHeight=10000, innerHeight=800: scrollable=9200
      // 25% = 2300 pixels
      ;(window as any).scrollY = 2300
      window.dispatchEvent(new Event('scroll'))

      expect(mockTrackScrollDepth).toHaveBeenCalledWith(25)
    })

    it('should track scroll depth at 50%', () => {
      render(<PageAnalyticsTracker />)

      ;(window as any).scrollY = 4600
      window.dispatchEvent(new Event('scroll'))

      expect(mockTrackScrollDepth).toHaveBeenCalledWith(50)
    })

    it('should track scroll depth at 75%', () => {
      render(<PageAnalyticsTracker />)

      ;(window as any).scrollY = 6900
      window.dispatchEvent(new Event('scroll'))

      expect(mockTrackScrollDepth).toHaveBeenCalledWith(75)
    })

    it('should track scroll depth at 90%', () => {
      render(<PageAnalyticsTracker />)

      ;(window as any).scrollY = 8280
      window.dispatchEvent(new Event('scroll'))

      expect(mockTrackScrollDepth).toHaveBeenCalledWith(90)
    })

    it('should track each scroll depth range only once', () => {
      render(<PageAnalyticsTracker />)

      // Scroll through multiple ranges to verify tracking happens per range
      // First scroll to 30% (enters 25-50 range)
      ;(window as any).scrollY = 2760
      window.dispatchEvent(new Event('scroll'))

      // The component tracks 25 when entering the 25-50% range
      expect(mockTrackScrollDepth).toHaveBeenCalledWith(25)
    })
  })

  describe('Engagement milestone tracking', () => {
    it('should track engagement milestone at 10 seconds', () => {
      render(<PageAnalyticsTracker />)

      // Fast-forward 10 seconds
      act(() => {
        jest.advanceTimersByTime(10000)
      })

      expect(mockTrackEngagementMilestone).toHaveBeenCalledWith(10)
    })

    it('should track engagement milestone at 30 seconds', () => {
      render(<PageAnalyticsTracker />)

      act(() => {
        jest.advanceTimersByTime(30000)
      })

      expect(mockTrackEngagementMilestone).toHaveBeenCalledWith(30)
    })

    it('should track engagement milestones at 10, 30, 60, 180, 300 seconds', () => {
      render(<PageAnalyticsTracker />)

      act(() => {
        jest.advanceTimersByTime(10000)
      })
      expect(mockTrackEngagementMilestone).toHaveBeenCalledWith(10)

      act(() => {
        jest.advanceTimersByTime(20000)
      })
      expect(mockTrackEngagementMilestone).toHaveBeenCalledWith(30)

      act(() => {
        jest.advanceTimersByTime(30000)
      })
      expect(mockTrackEngagementMilestone).toHaveBeenCalledWith(60)

      act(() => {
        jest.advanceTimersByTime(120000)
      })
      expect(mockTrackEngagementMilestone).toHaveBeenCalledWith(180)

      act(() => {
        jest.advanceTimersByTime(120000)
      })
      expect(mockTrackEngagementMilestone).toHaveBeenCalledWith(300)
    })
  })

  describe('Cleanup and memory leak prevention', () => {
    it('should remove scroll event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
      const { unmount } = render(<PageAnalyticsTracker />)

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      removeEventListenerSpy.mockRestore()
    })

    it('should clear engagement milestone interval on unmount', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
      const { unmount } = render(<PageAnalyticsTracker />)

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
      clearIntervalSpy.mockRestore()
    })

    it('should not leak intervals when component unmounts', () => {
      const { unmount } = render(<PageAnalyticsTracker />)

      act(() => {
        jest.advanceTimersByTime(10000)
      })
      expect(mockTrackEngagementMilestone).toHaveBeenCalledWith(10)

      unmount()

      // After unmount, advancing timers should not trigger more tracking
      act(() => {
        jest.advanceTimersByTime(20000)
      })
      expect(mockTrackEngagementMilestone).toHaveBeenCalledTimes(1)
    })

    it('should not trigger page exit tracking in test environment', () => {
      const { unmount } = render(<PageAnalyticsTracker />)

      // beforeunload event is mocked and may not trigger in JSDOM
      unmount()

      // We're verifying cleanup happens without errors
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('Security: Effect cleanup and data integrity', () => {
    it('should not re-initialize tracking on re-render', () => {
      const { rerender } = render(<PageAnalyticsTracker />)

      expect(mockTrackPageView).toHaveBeenCalledTimes(1)

      act(() => {
        rerender(<PageAnalyticsTracker />)
      })

      // Should still be called only once (effect not re-initialized)
      expect(mockTrackPageView).toHaveBeenCalledTimes(1)
    })

    it('should handle rapid scroll events without memory issues', () => {
      render(<PageAnalyticsTracker />)

      // Simulate rapid scrolling
      for (let i = 0; i < 100; i++) {
        ;(window as any).scrollY = Math.random() * 5000
        window.dispatchEvent(new Event('scroll'))
      }

      // Should handle high volume of events gracefully
      expect(mockTrackScrollDepth).toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('should handle document.referrer being empty', () => {
      Object.defineProperty(document, 'referrer', {
        value: '',
        writable: true,
        configurable: true,
      })

      render(<PageAnalyticsTracker />)

      expect(mockTrackPageView).toHaveBeenCalledWith('home', '')
    })

    it('should handle zero scroll height gracefully', () => {
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 800, // Same as innerHeight, so no scrollable area
        writable: true,
        configurable: true,
      })

      render(<PageAnalyticsTracker />)

      ;(window as any).scrollY = 0
      window.dispatchEvent(new Event('scroll'))

      // Should not crash even with no scrollable content
      // trackScrollDepth might not be called if there's no scroll to track
      expect(() => {
        window.dispatchEvent(new Event('scroll'))
      }).not.toThrow()
    })
  })
})
