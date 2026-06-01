import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageSelector from '@/components/ui/LanguageSelector'

// ---------------------------------------------------------------------------
// Mock wiring
//
// The component imports `useRouter`/`usePathname` from 'next/navigation' at
// module load. The previous version of this file called `jest.doMock(...)`
// INSIDE each test body, which has no effect on an already-imported module —
// so the component always used the throwaway `push: jest.fn()` and every
// `expect(mockPush).toHaveBeenCalledWith(...)` saw 0 calls.
//
// Fix: hoist a module-scope `mockPush` that the top-level factory references,
// and a MUTABLE `mockPathname` the factory reads on every render. Tests set
// `mockPathname` directly (no jest.doMock) and assert against `mockPush`.
// ---------------------------------------------------------------------------
const mockPush = jest.fn()
let mockPathname = '/en'

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
}))

// NOTE: LanguageSelector does NOT consume `localeNames`/`localeFlags` from this
// config — it has its own hardcoded `allLocaleNames`/`allLocaleFlags` tables.
// Only the `locales` array is read. So the rendered option labels come from the
// component's internal table (e.g. zh -> '简体中文', NOT '中文'). Mocking the
// config maps here would not change rendered text; assertions target the
// component's real internal labels.
jest.mock('@/i18n/config', () => ({
  locales: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ko'],
}))

// Card and Button are imported as DEFAULT exports (`import Card from './Card'`).
// Under next/jest's transform a CJS module whose export is a bare function
// resolves the default import to that function, so the dropdown opens correctly.
jest.mock('@/components/ui/Card', () => {
  function MockCard({ children, ...props }: any) {
    return (
      <div data-testid="card" {...props}>
        {children}
      </div>
    )
  }
  return MockCard
})

jest.mock('@/components/ui/Button', () => {
  function MockButton({ children, onClick, ...props }: any) {
    return (
      <button onClick={onClick} data-testid="button" {...props}>
        {children}
      </button>
    )
  }
  return MockButton
})

jest.mock('lucide-react', () => ({
  Globe: () => <div data-testid="globe-icon" />,
  Check: () => <div data-testid="check-icon" />,
}))

// Component's real internal native labels (allLocaleNames) used as option text.
const LABEL = {
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  zh: '简体中文',
  ko: '한국어',
}

describe('LanguageSelector Security Tests', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockPathname = '/en'
  })

  describe('Path Traversal Prevention', () => {
    // ⚠️ REAL APP BUG (left intentionally failing — see report).
    // handleLanguageChange in LanguageSelector.tsx splits the pathname on '/',
    // strips ONLY a leading known-locale segment, then re-prepends the new
    // locale to whatever remains. Malicious leading segments (../, encoded
    // traversal, null bytes, control chars, scheme-like text) are NOT stripped,
    // so the component pushes e.g. '/es/../../../etc/passwd'. The assertions
    // below express the SECURE expectation and must NOT be weakened to pass.
    it('should sanitize pathname to prevent path traversal attacks', async () => {
      mockPathname = '/../../../etc/passwd'

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const spanishOption = screen.getByText(LABEL.es)
      await user.click(spanishOption)

      // Should sanitize the pathname and not allow path traversal.
      expect(mockPush).toHaveBeenCalledWith('/es')
      expect(mockPush).not.toHaveBeenCalledWith('/es/../../../etc/passwd')
      expect(mockPush).not.toHaveBeenCalledWith('/../../../etc/passwd')
    })

    // ⚠️ REAL APP BUG (left intentionally failing).
    it('should handle encoded path traversal attempts', async () => {
      mockPathname = '/%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const frenchOption = screen.getByText(LABEL.fr)
      await user.click(frenchOption)

      // Should not decode and execute path traversal.
      expect(mockPush).toHaveBeenCalledWith('/fr')
      expect(mockPush).not.toHaveBeenCalledWith('/fr/%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd')
    })

    // ⚠️ REAL APP BUG (left intentionally failing).
    it('should handle null byte injection attempts', async () => {
      mockPathname = '/path\x00malicious'

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const germanOption = screen.getByText(LABEL.de)
      await user.click(germanOption)

      expect(mockPush).toHaveBeenCalledWith('/de')
      expect(mockPush).not.toHaveBeenCalledWith('/de/path\x00malicious')
    })

    // ⚠️ REAL APP BUG (left intentionally failing).
    it('should normalize Unicode path traversal attempts', async () => {
      mockPathname = '/path‮..malicious' // Right-to-left override

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const japaneseOption = screen.getByText(LABEL.ja)
      await user.click(japaneseOption)

      expect(mockPush).toHaveBeenCalledWith('/ja')
      expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('malicious'))
    })
  })

  describe('URL Manipulation Prevention', () => {
    // ⚠️ REAL APP BUG (left intentionally failing).
    it('should handle XSS in pathname', async () => {
      mockPathname = '/<script>alert("xss")</script>'

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const chineseOption = screen.getByText(LABEL.zh)
      await user.click(chineseOption)

      expect(mockPush).toHaveBeenCalledWith('/zh')
      expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('<script>'))
      expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('xss'))
    })

    // ⚠️ REAL APP BUG (left intentionally failing).
    it('should handle JavaScript protocol injection', async () => {
      mockPathname = 'javascript:alert("xss")'

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const koreanOption = screen.getByText(LABEL.ko)
      await user.click(koreanOption)

      expect(mockPush).toHaveBeenCalledWith('/ko')
      expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('javascript:'))
    })

    // ⚠️ REAL APP BUG (left intentionally failing).
    it('should handle data URL injection', async () => {
      mockPathname = 'data:text/html,<script>alert("xss")</script>'

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const spanishOption = screen.getByText(LABEL.es)
      await user.click(spanishOption)

      expect(mockPush).toHaveBeenCalledWith('/es')
      expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('data:'))
    })
  })

  describe('Regex Security', () => {
    it('should prevent ReDoS attacks with complex pathnames', async () => {
      // A long single path segment containing regex metacharacters. These are
      // benign literal characters in a URL path (no traversal / no scheme), so
      // the component legitimately preserves them when switching locale. The
      // security-relevant assertion here is the TIMING: locale switching must
      // not exhibit catastrophic backtracking.
      const complexPath = '/' + 'a'.repeat(1000) + '(' + 'a'.repeat(1000) + ')*' + 'b'.repeat(1000)
      mockPathname = complexPath

      const startTime = Date.now()
      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const frenchOption = screen.getByText(LABEL.fr)
      await user.click(frenchOption)

      const endTime = Date.now()

      // Should complete quickly (under 5 seconds) — no catastrophic backtracking.
      expect(endTime - startTime).toBeLessThan(5000)
      // The benign segment is preserved after the new locale prefix.
      expect(mockPush).toHaveBeenCalledWith('/fr/' + complexPath.slice(1))
    })

    it('should handle invalid locale patterns safely', async () => {
      // A normal (non-malicious) path segment that is not a known locale. The
      // component correctly preserves it as a sub-path when switching locale.
      mockPathname = '/invalid-locale-with-dashes-and-numbers-123'

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const germanOption = screen.getByText(LABEL.de)
      await user.click(germanOption)

      // Non-locale leading segment is preserved beneath the new locale prefix.
      expect(mockPush).toHaveBeenCalledWith('/de/invalid-locale-with-dashes-and-numbers-123')
    })
  })

  describe('Component Security', () => {
    it('should render safely with the configured locales', () => {
      expect(() => {
        render(<LanguageSelector />)
      }).not.toThrow()

      expect(screen.getByTestId('button')).toBeInTheDocument()
    })

    it('should render the trigger button without errors', () => {
      // The component derives its label set internally and ignores any external
      // localeNames/localeFlags config, so it renders consistently for the
      // configured `locales` array regardless of partial config maps.
      expect(() => {
        render(<LanguageSelector />)
      }).not.toThrow()

      expect(screen.getByTestId('button')).toBeInTheDocument()
    })

    it('should prevent clickjacking attacks', async () => {
      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')

      // Attempt to simulate clickjacking by setting z-index and position.
      languageButton.style.zIndex = '-1'
      languageButton.style.position = 'absolute'

      await user.click(languageButton)

      // Should handle gracefully (component remains mounted and interactive).
      expect(screen.getByTestId('button')).toBeInTheDocument()
    })

    it('should handle rapid clicking without errors', async () => {
      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')

      // Rapid clicks (toggles dropdown open/closed repeatedly).
      for (let i = 0; i < 10; i++) {
        await user.click(languageButton)
      }

      // Component should remain stable.
      expect(screen.getByTestId('button')).toBeInTheDocument()
    })
  })

  describe('Memory and Performance Security', () => {
    it('should not leak memory on repeated language changes', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<LanguageSelector />)

      for (let i = 0; i < 100; i++) {
        rerender(<LanguageSelector />)

        const languageButton = screen.getByTestId('button')
        await user.click(languageButton)

        await waitFor(() => {
          expect(screen.getByTestId('card')).toBeInTheDocument()
        })

        // Close dropdown by clicking the overlay backdrop (first overlay div).
        await user.click(languageButton)
      }

      // Should complete without memory issues.
      expect(screen.getByTestId('button')).toBeInTheDocument()
    })

    it('should render the configured locale set efficiently', () => {
      // The component renders its internal locale table for the configured
      // `locales` array. Rendering must complete promptly.
      const startTime = Date.now()
      render(<LanguageSelector />)
      const endTime = Date.now()

      // Should render within reasonable time.
      expect(endTime - startTime).toBeLessThan(1000)
      expect(screen.getByTestId('button')).toBeInTheDocument()
    })
  })
})
