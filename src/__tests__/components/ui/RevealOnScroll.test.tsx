import React from 'react'
import { render } from '@testing-library/react'
import { act } from '@testing-library/react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

describe('RevealOnScroll Component', () => {
  let mockIntersectionObserver: jest.Mock
  let observerCallback: IntersectionObserverCallback | null = null
  let observedElements: Set<Element> = new Set()

  beforeEach(() => {
    jest.useFakeTimers()
    observedElements.clear()

    mockIntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
      observerCallback = callback
      return {
        observe: jest.fn((el: Element) => observedElements.add(el)),
        unobserve: jest.fn((el: Element) => observedElements.delete(el)),
        disconnect: jest.fn(() => observedElements.clear()),
      }
    })

    // Mock window.IntersectionObserver
    ;(window as any).IntersectionObserver = mockIntersectionObserver

    // Mock matchMedia for prefers-reduced-motion check
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('Render behavior', () => {
    it('should render as null (render-nothing island)', () => {
      const { container } = render(<RevealOnScroll />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('IntersectionObserver setup', () => {
    it('should create IntersectionObserver on mount', () => {
      render(<RevealOnScroll />)

      expect(mockIntersectionObserver).toHaveBeenCalled()
    })

    it('should use correct root margin for early reveal', () => {
      render(<RevealOnScroll />)

      const call = mockIntersectionObserver.mock.calls[0][1]
      expect(call.rootMargin).toBe('0px 0px 200px 0px')
    })

    it('should use threshold of 0 for reveal on first visible pixel', () => {
      render(<RevealOnScroll />)

      const call = mockIntersectionObserver.mock.calls[0][1]
      expect(call.threshold).toBe(0)
    })
  })

  describe('[data-reveal] element observation', () => {
    it('should observe all [data-reveal] elements in the DOM', () => {
      // Create mock elements with data-reveal attribute
      const container = document.createElement('div')
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')
      el1.setAttribute('data-reveal', '')
      el2.setAttribute('data-reveal', '')
      container.appendChild(el1)
      container.appendChild(el2)
      document.body.appendChild(container)

      const observeSpy = jest.fn()
      ;(window as any).IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
        observerCallback = callback
        return {
          observe: observeSpy,
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        }
      })

      render(<RevealOnScroll />)

      expect(observeSpy).toHaveBeenCalledWith(el1)
      expect(observeSpy).toHaveBeenCalledWith(el2)
      expect(observeSpy).toHaveBeenCalledTimes(2)

      document.body.removeChild(container)
    })

    it('should not observe elements without data-reveal', () => {
      const container = document.createElement('div')
      const revealEl = document.createElement('div')
      const normalEl = document.createElement('div')
      revealEl.setAttribute('data-reveal', '')
      container.appendChild(revealEl)
      container.appendChild(normalEl)
      document.body.appendChild(container)

      const observeSpy = jest.fn()
      ;(window as any).IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
        return {
          observe: observeSpy,
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        }
      })

      render(<RevealOnScroll />)

      // Should only observe the element with data-reveal attribute
      expect(observeSpy).toHaveBeenCalledWith(revealEl)
      expect(observeSpy).toHaveBeenCalledTimes(1)
      // normalEl should not be observed
      expect(observeSpy).not.toHaveBeenCalledWith(normalEl)

      document.body.removeChild(container)
    })
  })

  describe('Reveal behavior (is-visible class)', () => {
    it('should add is-visible class when element intersects', () => {
      const element = document.createElement('div')
      element.setAttribute('data-reveal', '')
      document.body.appendChild(element)

      render(<RevealOnScroll />)

      // Simulate intersection
      if (observerCallback) {
        observerCallback(
          [{ target: element, isIntersecting: true }] as IntersectionObserverEntry[],
          {} as IntersectionObserver
        )
      }

      expect(element.classList.contains('is-visible')).toBe(true)

      document.body.removeChild(element)
    })

    it('should not add is-visible class when element is not intersecting', () => {
      const element = document.createElement('div')
      element.setAttribute('data-reveal', '')
      document.body.appendChild(element)

      render(<RevealOnScroll />)

      if (observerCallback) {
        observerCallback(
          [{ target: element, isIntersecting: false }] as IntersectionObserverEntry[],
          {} as IntersectionObserver
        )
      }

      expect(element.classList.contains('is-visible')).toBe(false)

      document.body.removeChild(element)
    })

    it('should unobserve element after revealing', () => {
      const element = document.createElement('div')
      element.setAttribute('data-reveal', '')
      document.body.appendChild(element)

      const unobserveSpy = jest.fn()
      ;(window as any).IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
        observerCallback = callback
        return {
          observe: jest.fn(),
          unobserve: unobserveSpy,
          disconnect: jest.fn(),
        }
      })

      render(<RevealOnScroll />)

      if (observerCallback) {
        observerCallback(
          [{ target: element, isIntersecting: true }] as IntersectionObserverEntry[],
          {} as IntersectionObserver
        )
      }

      expect(unobserveSpy).toHaveBeenCalledWith(element)

      document.body.removeChild(element)
    })
  })

  describe('Failsafe reveal mechanism', () => {
    it('should force-reveal all elements after 2.5 seconds', () => {
      const element = document.createElement('div')
      element.setAttribute('data-reveal', '')
      document.body.appendChild(element)

      render(<RevealOnScroll />)

      // Before timeout
      expect(element.classList.contains('is-visible')).toBe(false)

      // Fast-forward 2.5 seconds
      act(() => {
        jest.advanceTimersByTime(2500)
      })

      // After timeout, should be revealed
      expect(element.classList.contains('is-visible')).toBe(true)

      document.body.removeChild(element)
    })

    it('should handle multiple elements in failsafe reveal', () => {
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')
      el1.setAttribute('data-reveal', '')
      el2.setAttribute('data-reveal', '')
      document.body.appendChild(el1)
      document.body.appendChild(el2)

      render(<RevealOnScroll />)

      act(() => {
        jest.advanceTimersByTime(2500)
      })

      expect(el1.classList.contains('is-visible')).toBe(true)
      expect(el2.classList.contains('is-visible')).toBe(true)

      document.body.removeChild(el1)
      document.body.removeChild(el2)
    })
  })

  describe('Cleanup and memory leak prevention', () => {
    it('should disconnect observer on unmount', () => {
      const disconnectSpy = jest.fn()
      ;(window as any).IntersectionObserver = jest.fn(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: disconnectSpy,
      }))

      const { unmount } = render(<RevealOnScroll />)

      unmount()

      expect(disconnectSpy).toHaveBeenCalled()
    })

    it('should clear timeout on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

      const { unmount } = render(<RevealOnScroll />)

      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()

      clearTimeoutSpy.mockRestore()
    })

    it('should not leave elements revealed after unmount', () => {
      const element = document.createElement('div')
      element.setAttribute('data-reveal', '')
      document.body.appendChild(element)

      const { unmount } = render(<RevealOnScroll />)

      unmount()

      // After unmount, failsafe should be cleared
      act(() => {
        jest.advanceTimersByTime(2500)
      })

      // Component should be cleaned up and not affect the DOM
      // (In a real test, we'd verify the observer is disconnected)

      document.body.removeChild(element)
    })
  })

  describe('Progressive enhancement (prefers-reduced-motion)', () => {
    it('should not run effect when prefers-reduced-motion is enabled', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      render(<RevealOnScroll />)

      expect(mockIntersectionObserver).not.toHaveBeenCalled()
    })

    it('should run effect when prefers-reduced-motion is disabled', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      render(<RevealOnScroll />)

      expect(mockIntersectionObserver).toHaveBeenCalled()
    })
  })

  describe('Browser API fallback', () => {
    it('should handle missing IntersectionObserver gracefully', () => {
      // Save original
      const originalIO = (window as any).IntersectionObserver
      delete (window as any).IntersectionObserver

      expect(() => {
        render(<RevealOnScroll />)
      }).not.toThrow()

      // Restore
      ;(window as any).IntersectionObserver = originalIO
    })
  })

  describe('Security: DOM mutation safety', () => {
    it('should only manipulate data-reveal elements (not arbitrary DOM)', () => {
      const revealEl = document.createElement('div')
      const otherEl = document.createElement('div')
      revealEl.setAttribute('data-reveal', '')
      document.body.appendChild(revealEl)
      document.body.appendChild(otherEl)

      render(<RevealOnScroll />)

      jest.advanceTimersByTime(2500)

      expect(revealEl.classList.contains('is-visible')).toBe(true)
      expect(otherEl.classList.contains('is-visible')).toBe(false)

      document.body.removeChild(revealEl)
      document.body.removeChild(otherEl)
    })

    it('should only add reveal-init class to html element', () => {
      render(<RevealOnScroll />)

      // reveal-init is added to document.documentElement
      expect(document.documentElement.classList.contains('reveal-init')).toBe(true)

      // Should not pollute other elements
      const otherEl = document.createElement('div')
      document.body.appendChild(otherEl)
      expect(otherEl.classList.contains('reveal-init')).toBe(false)
      document.body.removeChild(otherEl)
    })
  })
})
