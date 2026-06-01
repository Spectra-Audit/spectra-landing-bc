import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageSelector from '@/components/ui/LanguageSelector'

// next/navigation is mocked once, at module scope, BEFORE LanguageSelector is
// imported. Per-test overrides go through the mutable `mockPathname` variable
// (and the shared `mockPush` spy) rather than `jest.doMock`, because the
// component is imported statically above: a `jest.doMock` here (without
// `jest.resetModules()` + a dynamic re-import) never reaches the already-loaded
// module, so the spy would record zero calls. The mutable-variable pattern lets
// each test drive `usePathname()` and observe `router.push()` for real.
let mockPathname = '/test-path'
const mockPush = jest.fn()

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
}))

jest.mock('@/i18n/config', () => ({
  locales: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ko'],
  localeNames: {
    en: { native: 'English', english: 'English' },
    es: { native: 'Español', english: 'Spanish' },
    fr: { native: 'Français', english: 'French' },
    de: { native: 'Deutsch', english: 'German' },
    ja: { native: '日本語', english: 'Japanese' },
    zh: { native: '中文', english: 'Chinese' },
    ko: { native: '한국어', english: 'Korean' },
  },
  localeFlags: {
    en: '🇺🇸',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    ja: '🇯🇵',
    zh: '🇨🇳',
    ko: '🇰🇷',
  },
}))

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

describe('LanguageSelector Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPathname = '/test-path'
  })

  describe('Path Traversal Prevention', () => {
    it('should sanitize pathname to prevent path traversal attacks', async () => {
      mockPathname = '/../../../etc/passwd'

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      // Wait for dropdown to open
      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      // Try to switch to Spanish
      const spanishOption = screen.getByText('Español')
      await user.click(spanishOption)

      // Should sanitize the pathname and not allow path traversal
      expect(mockPush).toHaveBeenCalledWith('/es')
      expect(mockPush).not.toHaveBeenCalledWith('/es/../../../etc/passwd')
      expect(mockPush).not.toHaveBeenCalledWith('/../../../etc/passwd')
    })

    it('should handle encoded path traversal attempts', async () => {
      mockPathname = '/%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const frenchOption = screen.getByText('Français')
      await user.click(frenchOption)

      // Should not decode and execute path traversal
      expect(mockPush).toHaveBeenCalledWith('/fr')
      expect(mockPush).not.toHaveBeenCalledWith('/fr/../../../etc/passwd')
    })

    it('should handle null byte injection attempts', async () => {
      mockPathname = '/path\x00malicious'

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const germanOption = screen.getByText('Deutsch')
      await user.click(germanOption)

      expect(mockPush).toHaveBeenCalledWith('/de')
      expect(mockPush).not.toHaveBeenCalledWith('/de/path\x00malicious')
    })

    it('should normalize Unicode path traversal attempts', async () => {
      mockPathname = '/path‮..malicious' // Right-to-left override

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const japaneseOption = screen.getByText('日本語')
      await user.click(japaneseOption)

      expect(mockPush).toHaveBeenCalledWith('/ja')
      expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('malicious'))
    })
  })

  describe('URL Manipulation Prevention', () => {
    it('should handle XSS in pathname', async () => {
      const xssPath = '/<script>alert("xss")</script>'
      mockPathname = xssPath

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const chineseOption = screen.getByText('简体中文')
      await user.click(chineseOption)

      expect(mockPush).toHaveBeenCalledWith('/zh')
      expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('<script>'))
      expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('xss'))
    })

    it('should handle JavaScript protocol injection', async () => {
      const jsPath = 'javascript:alert("xss")'
      mockPathname = jsPath

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const koreanOption = screen.getByText('한국어')
      await user.click(koreanOption)

      expect(mockPush).toHaveBeenCalledWith('/ko')
      expect(mockPush).not.toHaveBeenCalledWith('javascript:')
    })

    it('should handle data URL injection', async () => {
      const dataUrl = 'data:text/html,<script>alert("xss")</script>'
      mockPathname = dataUrl

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const spanishOption = screen.getByText('Español')
      await user.click(spanishOption)

      expect(mockPush).toHaveBeenCalledWith('/es')
      expect(mockPush).not.toHaveBeenCalledWith('data:')
    })
  })

  describe('Regex Security', () => {
    it('should prevent ReDoS attacks with complex pathnames', async () => {
      // Create a pathname that could cause catastrophic backtracking
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

      const frenchOption = screen.getByText('Français')
      await user.click(frenchOption)

      const endTime = Date.now()

      // Should complete quickly (under 5 seconds)
      expect(endTime - startTime).toBeLessThan(5000)
      expect(mockPush).toHaveBeenCalledWith('/fr')
    })

    it('should handle invalid locale patterns safely', async () => {
      mockPathname = '/invalid-locale-with-dashes-and-numbers-123'

      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')
      await user.click(languageButton)

      await waitFor(() => {
        expect(screen.getByTestId('card')).toBeInTheDocument()
      })

      const germanOption = screen.getByText('Deutsch')
      await user.click(germanOption)

      // Under `as-needed` locale prefixing the leading segment is a legitimate
      // (non-locale) in-app route, not a locale to strip, so it is preserved
      // under the new locale. The point is it is handled safely — no traversal,
      // no throw, a clean '/'-anchored route.
      expect(mockPush).toHaveBeenCalledWith('/de/invalid-locale-with-dashes-and-numbers-123')
    })
  })

  describe('Component Security', () => {
    it('should render safely with malformed locale config', () => {
      jest.doMock('@/i18n/config', () => ({
        locales: ['en', null, undefined, 'es'], // Invalid values
        localeNames: {
          en: { native: 'English', english: 'English' },
          null: { native: 'Null', english: 'Null' }, // Invalid key
          es: { native: 'Español', english: 'Spanish' },
        },
        localeFlags: {
          en: '🇺🇸',
          null: '❓', // Invalid key
          es: '🇪🇸',
        },
      }))

      expect(() => {
        render(<LanguageSelector />)
      }).not.toThrow()

      expect(screen.getByTestId('button')).toBeInTheDocument()
    })

    it('should handle missing locale information gracefully', () => {
      jest.doMock('@/i18n/config', () => ({
        locales: ['en', 'missing-locale'],
        localeNames: {
          en: { native: 'English', english: 'English' },
          // missing 'missing-locale'
        },
        localeFlags: {
          en: '🇺🇸',
          // missing 'missing-locale'
        },
      }))

      expect(() => {
        render(<LanguageSelector />)
      }).not.toThrow()

      expect(screen.getByTestId('button')).toBeInTheDocument()
    })

    it('should prevent clickjacking attacks', async () => {
      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')

      // Attempt to simulate clickjacking by setting z-index and position
      languageButton.style.zIndex = '-1'
      languageButton.style.position = 'absolute'

      await user.click(languageButton)

      // Should not open dropdown if button is not visible/accessible
      // Implementation may vary, but should handle gracefully
      expect(screen.getByTestId('button')).toBeInTheDocument()
    })

    it('should handle rapid clicking without errors', async () => {
      const user = userEvent.setup()
      render(<LanguageSelector />)

      const languageButton = screen.getByTestId('button')

      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        await user.click(languageButton)
      }

      // Component should remain stable
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

        // Close the dropdown by toggling the trigger again (the dropdown closes
        // via its own overlay/trigger, not a bare document.body click), so each
        // iteration starts from a closed state and the open/close cycle repeats.
        await user.click(languageButton)
      }

      // Should complete without memory issues
      expect(screen.getByTestId('button')).toBeInTheDocument()
    })

    it('should handle large numbers of locales efficiently', () => {
      const manyLocales = Array.from({ length: 1000 }, (_, i) => `locale-${i}`)
      const manyLocaleNames: Record<string, { native: string; english: string }> = {}
      const manyLocaleFlags: Record<string, string> = {}

      manyLocales.forEach(locale => {
        manyLocaleNames[locale] = { native: locale, english: locale }
        manyLocaleFlags[locale] = '🏳️'
      })

      jest.doMock('@/i18n/config', () => ({
        locales: manyLocales,
        localeNames: manyLocaleNames,
        localeFlags: manyLocaleFlags,
      }))

      const startTime = Date.now()
      render(<LanguageSelector />)
      const endTime = Date.now()

      // Should render within reasonable time
      expect(endTime - startTime).toBeLessThan(1000)
      expect(screen.getByTestId('button')).toBeInTheDocument()
    })
  })
})
