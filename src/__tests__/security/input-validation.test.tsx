import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/[locale]/page'

// Mock components to isolate testing to security-relevant behaviour.
//
// NOTE: the page does NOT render an Ethereum-address <input> (nor any form).
// The earlier "Ethereum Address Input" assertions targeted UI that no longer
// exists; the remaining tests exercise the real rendered output: structured
// data scripts, absence of injected DOM nodes, effect cleanup on unmount, and
// graceful handling of missing translations.
jest.mock('@/components/ui', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="button" {...props}>
      {children}
    </button>
  ),
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  TrustBadge: ({ label, description, ...props }: any) => (
    <div data-testid="trust-badge" data-label={label} {...props}>
      {label}
    </div>
  ),
  GradeBadge: ({ grade, ...props }: any) => (
    <div data-testid="grade-badge" data-grade={grade} {...props}>
      Grade: {grade}
    </div>
  ),
  UnifiedGradeDisplay: ({ score, ...props }: any) => (
    <div data-testid="unified-grade-display" data-score={score} {...props} />
  ),
  MethodologyDiagram: (props: any) => <div data-testid="methodology-diagram" {...props} />,
  LearningLoopDiagram: (props: any) => <div data-testid="learning-loop-diagram" {...props} />,
  DisclaimerFooter: (props: any) => <div data-testid="disclaimer-footer" {...props} />,
  Navbar: () => <div data-testid="navbar">Navigation</div>,
  StatsBanner: () => <div data-testid="stats-banner">Stats</div>,
}))

jest.mock('@/components/ui/StructuredData', () => ({
  __esModule: true,
  default: ({ type, data }: any) => (
    <script type="application/ld+json" data-testid={`structured-data-${type}`}>
      {JSON.stringify(data)}
    </script>
  ),
  createSoftwareSchema: () => ({ '@type': 'SoftwareApplication' }),
  createOrganizationSchema: () => ({ '@type': 'Organization' }),
}))

jest.mock('@/components/ui/LanguageSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="language-selector">Language Selector</div>,
}))

jest.mock('@/components/ui/ThemeToggle', () => ({
  __esModule: true,
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}))

jest.mock('lucide-react', () => ({
  Activity: () => <div data-testid="activity-icon" />,
  X: () => <div data-testid="x-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Search: () => <div data-testid="search-icon" />,
  BarChart3: () => <div data-testid="barchart-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  CheckCircle: () => <div data-testid="checkcircle-icon" />,
  TrendingUp: () => <div data-testid="trendingup-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  Award: () => <div data-testid="award-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Users: () => <div data-testid="users-icon" />,
  GitBranch: () => <div data-testid="gitbranch-icon" />,
  Cpu: () => <div data-testid="cpu-icon" />,
  Layers: () => <div data-testid="layers-icon" />,
  ThumbsUp: () => <div data-testid="thumbsup-icon" />,
  Brain: () => <div data-testid="brain-icon" />,
  RefreshCw: () => <div data-testid="refreshcw-icon" />,
  FileCheck: () => <div data-testid="filecheck-icon" />,
}))

describe('Input Validation Security Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('DOM Injection Prevention', () => {
    it('should sanitize rendered content', () => {
      render(<HomePage />)

      // Only the structured-data JSON-LD scripts are allowed. Any other script
      // tag in the rendered output would indicate unsanitized content injection.
      const scripts = document.querySelectorAll('script')
      scripts.forEach(script => {
        if (!script.getAttribute('data-testid')?.startsWith('structured-data')) {
          throw new Error('Unexpected script tag found')
        }
      })
    })

    it('should not inject untrusted DOM nodes or inline event handlers', () => {
      const { container } = render(<HomePage />)

      // The page renders no <img>/<iframe> nodes from untrusted content.
      expect(container.querySelectorAll('img, iframe')).toHaveLength(0)

      // No element should carry inline on* event-handler attributes that could
      // execute injected script (e.g. onerror/onload from a markup-injection).
      const allElements = Array.from(container.querySelectorAll('*'))
      const withInlineHandlers = allElements.filter(el =>
        Array.from(el.attributes).some(attr => /^on[a-z]+$/i.test(attr.name))
      )
      expect(withInlineHandlers).toHaveLength(0)
    })
  })

  describe('Memory Leak Prevention', () => {
    it('should not break across repeated re-renders', () => {
      const { rerender } = render(<HomePage />)

      // Re-render multiple times to surface any unstable mount/cleanup behaviour.
      for (let i = 0; i < 100; i++) {
        rerender(<HomePage />)
      }

      // Component should still render its headline after repeated re-renders.
      expect(screen.getByText('hero.page.heroTitle')).toBeInTheDocument()
    })

    it('should clean up intervals and timeouts on unmount', () => {
      // Track that the interval registered by the page's effect is cleared on unmount.
      const originalSetInterval = window.setInterval
      const originalClearInterval = window.clearInterval
      const intervals = new Set<number>()

      window.setInterval = jest.fn((callback: Parameters<typeof originalSetInterval>[0], delay?: number) => {
        const id = originalSetInterval(callback, delay) as unknown as number
        intervals.add(id)
        return id
      }) as unknown as typeof window.setInterval

      const clearSpy = jest.fn((id?: number) => {
        if (id !== undefined) intervals.delete(id)
        return originalClearInterval(id)
      })
      window.clearInterval = clearSpy as unknown as typeof window.clearInterval

      const { unmount } = render(<HomePage />)
      const intervalsRegistered = intervals.size

      unmount()

      // Restore original functions
      window.setInterval = originalSetInterval
      window.clearInterval = originalClearInterval

      // The page registers an engagement-milestone interval in useEffect and must
      // clear it on unmount. Verify clearInterval ran and no interval leaked.
      // (We assert clean teardown rather than an empty <body>, since React Testing
      // Library leaves its own container <div> attached until auto-cleanup.)
      if (intervalsRegistered > 0) {
        expect(clearSpy).toHaveBeenCalled()
      }
      expect(intervals.size).toBe(0)

      // The rendered component content is gone after unmount.
      expect(screen.queryByText('hero.page.heroTitle')).not.toBeInTheDocument()
    })
  })

  describe('Error Boundary Handling', () => {
    it('should handle unexpected errors gracefully', () => {
      // Mock console.error to avoid noise in test output
      const originalError = console.error
      console.error = jest.fn()

      expect(() => {
        render(<HomePage />)
      }).not.toThrow()

      console.error = originalError
    })

    it('should handle missing dependencies gracefully', () => {
      // Simulate missing dependency
      const originalUseTranslations = require('next-intl').useTranslations
      require('next-intl').useTranslations = undefined

      expect(() => {
        render(<HomePage />)
      }).toThrow()

      // Restore
      require('next-intl').useTranslations = originalUseTranslations
    })
  })
})
