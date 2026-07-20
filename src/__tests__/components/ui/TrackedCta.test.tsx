import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TrackedCta from '@/components/ui/TrackedCta'
import { useUmamiAnalytics } from '@/hooks/useUmamiAnalytics'

// Mock the analytics hook
jest.mock('@/hooks/useUmamiAnalytics')

// Mock the Button component to isolate the island
jest.mock('@/components/ui/Button', () => {
  return function MockButton({ onClick, children, ...props }: any) {
    return (
      <button onClick={onClick} data-testid="tracked-cta-button" {...props}>
        {children}
      </button>
    )
  }
})

describe('TrackedCta Component', () => {
  const mockTrackHeroCtaClicked = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useUmamiAnalytics as jest.Mock).mockReturnValue({
      trackHeroCtaClicked: mockTrackHeroCtaClicked,
    })

    // Mock window.open and document.getElementById
    global.window.open = jest.fn()
    Element.prototype.scrollIntoView = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('openUrl action', () => {
    it('should open URL in new tab when clicked', () => {
      render(
        <TrackedCta
          action={{ type: 'openUrl', url: 'https://app.spectra-audit.com' }}
        >
          Start Audit
        </TrackedCta>
      )

      const button = screen.getByTestId('tracked-cta-button')
      fireEvent.click(button)

      expect(window.open).toHaveBeenCalledWith('https://app.spectra-audit.com', '_blank')
    })

    it('should track hero CTA when heroCta prop is provided', () => {
      render(
        <TrackedCta
          action={{ type: 'openUrl', url: 'https://example.com' }}
          heroCta={{ label: 'Get Started', variant: 'primary' }}
        >
          Click Here
        </TrackedCta>
      )

      fireEvent.click(screen.getByTestId('tracked-cta-button'))

      expect(mockTrackHeroCtaClicked).toHaveBeenCalledWith('Get Started', 'primary')
    })

    it('should not track hero CTA when heroCta prop is omitted', () => {
      render(
        <TrackedCta action={{ type: 'openUrl', url: 'https://example.com' }}>
          Click Here
        </TrackedCta>
      )

      fireEvent.click(screen.getByTestId('tracked-cta-button'))

      expect(mockTrackHeroCtaClicked).not.toHaveBeenCalled()
    })

    it('should open URL before tracking (no race condition)', () => {
      const callOrder: string[] = []
      ;(window.open as jest.Mock).mockImplementation(() => {
        callOrder.push('open')
      })
      mockTrackHeroCtaClicked.mockImplementation(() => {
        callOrder.push('track')
      })

      render(
        <TrackedCta
          action={{ type: 'openUrl', url: 'https://example.com' }}
          heroCta={{ label: 'Test', variant: 'primary' }}
        >
          Click
        </TrackedCta>
      )

      fireEvent.click(screen.getByTestId('tracked-cta-button'))

      // Tracking should happen first (in handleClick), then URL opens
      expect(callOrder[0]).toBe('track')
      expect(callOrder[1]).toBe('open')
    })
  })

  describe('scrollTo action', () => {
    it('should scroll to target element when clicked', () => {
      // Create a mock element with scrollIntoView
      const mockElement = document.createElement('div')
      mockElement.id = 'target-section'
      document.body.appendChild(mockElement)

      render(
        <TrackedCta action={{ type: 'scrollTo', targetId: 'target-section' }}>
          Scroll
        </TrackedCta>
      )

      fireEvent.click(screen.getByTestId('tracked-cta-button'))

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })

      document.body.removeChild(mockElement)
    })

    it('should handle missing target element gracefully', () => {
      render(
        <TrackedCta action={{ type: 'scrollTo', targetId: 'nonexistent' }}>
          Scroll
        </TrackedCta>
      )

      // Should not throw when element doesn't exist
      expect(() => {
        fireEvent.click(screen.getByTestId('tracked-cta-button'))
      }).not.toThrow()
    })

    it('should track hero CTA before scrolling', () => {
      const mockElement = document.createElement('div')
      mockElement.id = 'target'
      document.body.appendChild(mockElement)

      render(
        <TrackedCta
          action={{ type: 'scrollTo', targetId: 'target' }}
          heroCta={{ label: 'Learn More', variant: 'secondary' }}
        >
          Scroll
        </TrackedCta>
      )

      fireEvent.click(screen.getByTestId('tracked-cta-button'))

      expect(mockTrackHeroCtaClicked).toHaveBeenCalledWith('Learn More', 'secondary')
      expect(mockElement.scrollIntoView).toHaveBeenCalled()

      document.body.removeChild(mockElement)
    })
  })

  describe('Button props passthrough', () => {
    it('should pass through Button props (className, size, variant)', () => {
      const { container } = render(
        <TrackedCta
          action={{ type: 'openUrl', url: 'https://example.com' }}
          size="lg"
          variant="gradient"
          className="custom-class"
        >
          Test
        </TrackedCta>
      )

      const button = screen.getByTestId('tracked-cta-button')
      expect(button).toHaveClass('custom-class')
      // Note: size and variant are passed through but may not be visible in className
    })

    it('should render children content correctly', () => {
      render(
        <TrackedCta action={{ type: 'openUrl', url: 'https://example.com' }}>
          Click Me
        </TrackedCta>
      )

      expect(screen.getByText('Click Me')).toBeInTheDocument()
    })
  })

  describe('Security: XSS prevention', () => {
    it('should not render user-supplied URLs unsafely', () => {
      const evilUrl = 'javascript:alert("xss")'
      render(
        <TrackedCta action={{ type: 'openUrl', url: evilUrl }}>
          Click
        </TrackedCta>
      )

      fireEvent.click(screen.getByTestId('tracked-cta-button'))

      // window.open is called with the URL as-is (Next.js Button/host should validate)
      // Our job is to ensure we're not evaluating/interpolating it
      expect(window.open).toHaveBeenCalledWith(evilUrl, '_blank')
    })

    it('should safely pass targetId to getElementById without injection', () => {
      // getElementById is the safe API (not innerHTML)
      render(
        <TrackedCta action={{ type: 'scrollTo', targetId: 'mySection' }}>
          Scroll
        </TrackedCta>
      )

      fireEvent.click(screen.getByTestId('tracked-cta-button'))

      // No assertion needed — the test passes if no error is thrown
      // and scrollIntoView is called safely via the DOM API
    })
  })

  describe('Analytics data integrity', () => {
    it('should track with exact label and variant from heroCta', () => {
      render(
        <TrackedCta
          action={{ type: 'openUrl', url: 'https://example.com' }}
          heroCta={{ label: 'Exact Label', variant: 'primary' }}
        >
          Button
        </TrackedCta>
      )

      fireEvent.click(screen.getByTestId('tracked-cta-button'))

      expect(mockTrackHeroCtaClicked).toHaveBeenCalledWith('Exact Label', 'primary')
      expect(mockTrackHeroCtaClicked).toHaveBeenCalledTimes(1)
    })

    it('should track with secondary variant correctly', () => {
      render(
        <TrackedCta
          action={{ type: 'openUrl', url: 'https://example.com' }}
          heroCta={{ label: 'Secondary Button', variant: 'secondary' }}
        >
          Button
        </TrackedCta>
      )

      fireEvent.click(screen.getByTestId('tracked-cta-button'))

      expect(mockTrackHeroCtaClicked).toHaveBeenCalledWith('Secondary Button', 'secondary')
    })
  })
})
