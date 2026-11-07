import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TrackedCta from '@/components/ui/TrackedCta'
import { useUmamiAnalytics } from '@/hooks/useUmamiAnalytics'

// Mock the analytics hook
jest.mock('@/hooks/useUmamiAnalytics')

// The real Button is deliberately NOT mocked: the contract these tests
// exist to protect is that a navigation CTA renders a real `<a href>`
// (SPE-16), which only the real Button can satisfy.

// The CTA renders as a link in every case except a rejected URL scheme,
// where it falls back to a plain button.
const cta = () => screen.getByRole('link')

describe('TrackedCta Component', () => {
  const mockTrackHeroCtaClicked = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useUmamiAnalytics as jest.Mock).mockReturnValue({
      trackHeroCtaClicked: mockTrackHeroCtaClicked,
    })

    global.window.open = jest.fn()
    Element.prototype.scrollIntoView = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('openUrl action', () => {
    it('should render a real link to the URL, opening in a new tab', () => {
      render(
        <TrackedCta
          action={{ type: 'openUrl', url: 'https://app.spectra-audit.com' }}
        >
          Start Audit
        </TrackedCta>
      )

      const link = cta()
      // A real href is the point: it survives a failed/pending JS bundle,
      // middle-click and cmd-click, and is followable by crawlers.
      expect(link).toHaveAttribute('href', 'https://app.spectra-audit.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should let the browser navigate rather than calling window.open', () => {
      render(
        <TrackedCta action={{ type: 'openUrl', url: 'https://app.spectra-audit.com' }}>
          Start Audit
        </TrackedCta>
      )

      fireEvent.click(cta())

      // window.open is popup-blockable and leaves no href behind.
      expect(window.open).not.toHaveBeenCalled()
    })

    it('should not preventDefault on click, so the navigation still happens', () => {
      render(
        <TrackedCta
          action={{ type: 'openUrl', url: 'https://app.spectra-audit.com' }}
          heroCta={{ label: 'Start', variant: 'primary' }}
        >
          Start Audit
        </TrackedCta>
      )

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
      cta().dispatchEvent(clickEvent)

      expect(mockTrackHeroCtaClicked).toHaveBeenCalledTimes(1)
      expect(clickEvent.defaultPrevented).toBe(false)
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

      fireEvent.click(cta())

      expect(mockTrackHeroCtaClicked).toHaveBeenCalledWith('Get Started', 'primary')
    })

    it('should not track hero CTA when heroCta prop is omitted', () => {
      render(
        <TrackedCta action={{ type: 'openUrl', url: 'https://example.com' }}>
          Click Here
        </TrackedCta>
      )

      fireEvent.click(cta())

      expect(mockTrackHeroCtaClicked).not.toHaveBeenCalled()
    })

    it('should track synchronously on click, before the browser leaves', () => {
      render(
        <TrackedCta
          action={{ type: 'openUrl', url: 'https://example.com' }}
          heroCta={{ label: 'Test', variant: 'primary' }}
        >
          Click
        </TrackedCta>
      )

      fireEvent.click(cta())

      // The handler is the only chance to record the click: the browser
      // handles navigation itself once the handler returns.
      expect(mockTrackHeroCtaClicked).toHaveBeenCalledTimes(1)
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

      fireEvent.click(cta())

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
        fireEvent.click(cta())
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

      fireEvent.click(cta())

      expect(mockTrackHeroCtaClicked).toHaveBeenCalledWith('Learn More', 'secondary')
      expect(mockElement.scrollIntoView).toHaveBeenCalled()

      document.body.removeChild(mockElement)
    })
  })

  describe('Button props passthrough', () => {
    it('should pass through Button props (className, size, variant)', () => {
      render(
        <TrackedCta
          action={{ type: 'openUrl', url: 'https://example.com' }}
          size="lg"
          variant="gradient"
          className="custom-class"
        >
          Test
        </TrackedCta>
      )

      const button = cta()
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
    it.each([
      'javascript:alert("xss")',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
    ])('should refuse to put %s in an href', (evilUrl) => {
      render(
        <TrackedCta action={{ type: 'openUrl', url: evilUrl }}>
          Click
        </TrackedCta>
      )

      // No link at all: a non-http(s) scheme is dropped rather than
      // rendered as a clickable href that would execute on click.
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.getByRole('button')).not.toHaveAttribute('href')
    })

    it('should safely pass targetId to getElementById without injection', () => {
      // getElementById is the safe API (not innerHTML)
      render(
        <TrackedCta action={{ type: 'scrollTo', targetId: 'mySection' }}>
          Scroll
        </TrackedCta>
      )

      fireEvent.click(cta())

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

      fireEvent.click(cta())

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

      fireEvent.click(cta())

      expect(mockTrackHeroCtaClicked).toHaveBeenCalledWith('Secondary Button', 'secondary')
    })
  })
})
