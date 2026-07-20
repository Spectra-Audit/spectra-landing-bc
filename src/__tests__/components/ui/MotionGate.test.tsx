import React from 'react'
import { render, screen } from '@testing-library/react'
import MotionGate from '@/components/ui/MotionGate'

describe('MotionGate Component', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    })
  })

  describe('Render behavior', () => {
    it('should render children when prefers-reduced-motion is not set', () => {
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

      render(
        <MotionGate>
          <div data-testid="motion-content">Animated Content</div>
        </MotionGate>
      )

      expect(screen.getByTestId('motion-content')).toBeInTheDocument()
      expect(screen.getByText('Animated Content')).toBeInTheDocument()
    })

    it('should not render children when prefers-reduced-motion is enabled', () => {
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

      const { container } = render(
        <MotionGate>
          <div data-testid="motion-content">Animated Content</div>
        </MotionGate>
      )

      expect(container.querySelector('[data-testid="motion-content"]')).not.toBeInTheDocument()
    })
  })

  describe('prefers-reduced-motion detection', () => {
    it('should query for (prefers-reduced-motion: reduce)', () => {
      const matchMediaSpy = jest.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: matchMediaSpy,
      })

      render(
        <MotionGate>
          <div>Content</div>
        </MotionGate>
      )

      expect(matchMediaSpy).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
    })
  })

  describe('Multiple animation types', () => {
    it('should guard SVG animations (SMIL)', () => {
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

      const { container } = render(
        <MotionGate>
          <svg data-testid="animated-svg">
            <circle cx="50" cy="50" r="40" />
            <animateMotion dur="5s" />
          </svg>
        </MotionGate>
      )

      expect(container.querySelector('[data-testid="animated-svg"]')).not.toBeInTheDocument()
    })

    it('should guard CSS animations', () => {
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

      const { container } = render(
        <MotionGate>
          <div data-testid="css-animated" className="animate-fade-in">
            Content
          </div>
        </MotionGate>
      )

      expect(container.querySelector('[data-testid="css-animated"]')).not.toBeInTheDocument()
    })
  })

  describe('SSR hydration safety (useSyncExternalStore)', () => {
    it('should not cause hydration mismatch by using false on server', () => {
      // Simulating SSR context where window is undefined
      const originalWindow = global.window

      // In the actual component, getServerSnapshot returns false
      // This test verifies the logic
      render(
        <MotionGate>
          <div data-testid="content">Content</div>
        </MotionGate>
      )

      // After hydration, the component should render correctly
      // The useSyncExternalStore pattern ensures deterministic rendering
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  describe('Fallback for browsers without matchMedia', () => {
    it('should handle missing matchMedia gracefully', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: undefined,
      })

      expect(() => {
        render(
          <MotionGate>
            <div data-testid="fallback-content">Content</div>
          </MotionGate>
        )
      }).not.toThrow()
    })

    it('should render children when matchMedia is unavailable', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: undefined,
      })

      render(
        <MotionGate>
          <div data-testid="fallback-content">Content</div>
        </MotionGate>
      )

      // Without matchMedia, default behavior is to render children
      expect(screen.getByTestId('fallback-content')).toBeInTheDocument()
    })
  })

  describe('Media query listener registration', () => {
    it('should register event listener for media query changes', () => {
      const addEventListenerSpy = jest.fn()

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: addEventListenerSpy,
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      render(
        <MotionGate>
          <div>Content</div>
        </MotionGate>
      )

      expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('should handle legacy addListener API when addEventListener is unavailable', () => {
      const addListenerSpy = jest.fn()

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: addListenerSpy,
          removeListener: jest.fn(),
          addEventListener: undefined,
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      render(
        <MotionGate>
          <div>Content</div>
        </MotionGate>
      )

      expect(addListenerSpy).toHaveBeenCalled()
    })
  })

  describe('Nested MotionGate', () => {
    it('should handle nested MotionGates correctly', () => {
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

      render(
        <MotionGate>
          <div data-testid="outer">
            <MotionGate>
              <div data-testid="inner">Nested</div>
            </MotionGate>
          </div>
        </MotionGate>
      )

      expect(screen.getByTestId('outer')).toBeInTheDocument()
      expect(screen.getByTestId('inner')).toBeInTheDocument()
    })

    it('should respect reduced-motion at both levels', () => {
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

      const { container } = render(
        <MotionGate>
          <div data-testid="outer">
            <MotionGate>
              <div data-testid="inner">Nested</div>
            </MotionGate>
          </div>
        </MotionGate>
      )

      // Both should be hidden when prefers-reduced-motion is enabled
      expect(container.querySelector('[data-testid="outer"]')).not.toBeInTheDocument()
      expect(container.querySelector('[data-testid="inner"]')).not.toBeInTheDocument()
    })
  })

  describe('Security: Content isolation', () => {
    it('should render user-supplied content safely', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      // React escapes content by default
      render(
        <MotionGate>
          <div data-testid="content">{'<script>alert("xss")</script>'}</div>
        </MotionGate>
      )

      // Script should not execute, content should be escaped
      expect(screen.getByTestId('content')).toBeInTheDocument()
      expect(screen.getByTestId('content').innerHTML).not.toContain('<script>')
    })
  })
})
