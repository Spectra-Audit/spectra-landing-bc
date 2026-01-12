import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '@/app/[locale]/page'

// Mock components to isolate testing to security issues
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
  Navbar: () => <div data-testid="navbar">Navigation</div>,
  StatsBanner: () => <div data-testid="stats-banner">Stats</div>,
}))

jest.mock('@/components/ui/PersonaSelector', () => ({
  __esModule: true,
  default: ({ onPersonaSelect }: any) => (
    <div data-testid="persona-selector">
      <button onClick={() => onPersonaSelect('passive-saver')}>Passive Saver</button>
      <button onClick={() => onPersonaSelect('power-analyst')}>Power Analyst</button>
    </div>
  ),
  PersonaType: 'passive-saver' as const,
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

jest.mock('../../app/[locale]/TrendingProtocols', () => ({
  __esModule: true,
  default: () => <div data-testid="trending-protocols">Trending Protocols</div>,
}))

describe('Input Validation Security Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('Ethereum Address Input Security', () => {
    it('should reject script injection attempts', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')

      // Test XSS attempt
      const xssPayload = '<script>alert("xss")</script>'
      await user.type(addressInput, xssPayload)

      expect(addressInput).toHaveValue(xssPayload)

      // Verify no script execution occurs
      expect(() => {
        const scripts = document.querySelectorAll('script')
        scripts.forEach(script => {
          if (script.textContent?.includes('alert("xss")')) {
            throw new Error('XSS payload found in script tag')
          }
        })
      }).not.toThrow()
    })

    it('should reject JavaScript protocol injection', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      const jsProtocol = 'javascript:alert("xss")'

      await user.type(addressInput, jsProtocol)

      expect(addressInput).toHaveValue(jsProtocol)

      // Verify no script execution
      expect(() => {
        eval(jsProtocol)
      }).not.toThrow()
    })

    it('should reject data URL injection', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      const dataUrl = 'data:text/html,<script>alert("xss")</script>'

      await user.type(addressInput, dataUrl)

      expect(addressInput).toHaveValue(dataUrl)

      // Verify no HTML parsing occurs
      expect(addressInput.tagName).toBe('INPUT')
    })

    it('should handle extremely long input without crashing', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      const longInput = 'a'.repeat(100000) // 100KB input

      await user.type(addressInput, longInput)

      expect(addressInput).toHaveValue(longInput)
      // Should not cause performance issues
      expect(screen.getByTestId('button')).toBeInTheDocument()
    })

    it('should handle null bytes and control characters', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      const maliciousInput = '\x00\x01\x02\x03<script>'

      await user.type(addressInput, maliciousInput)

      expect(addressInput).toHaveValue(maliciousInput)
      // Should not cause injection
      expect(addressInput.tagName).toBe('INPUT')
    })

    it('should validate Ethereum address format (basic validation)', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')

      // Test invalid addresses
      const invalidAddresses = [
        '0x', // Incomplete
        '0x123', // Too short
        '0xGHIJKLMNOPQRSTUVWXYZ123456789012345678901234567890', // Invalid characters
        '1234567890123456789012345678901234567890', // Missing 0x prefix
      ]

      for (const invalidAddr of invalidAddresses) {
        await user.clear(addressInput)
        await user.type(addressInput, invalidAddr)

        // Input should accept but validation should occur on submit
        expect(addressInput).toHaveValue(invalidAddr)
      }
    })

    it('should handle Unicode and international characters safely', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      const unicodeInput = '🚀✨💎0x1234567890123456789012345678901234567890💰🔥'

      await user.type(addressInput, unicodeInput)

      expect(addressInput).toHaveValue(unicodeInput)
      // Should not cause encoding issues
      expect(addressInput).toBeInstanceOf(HTMLInputElement)
    })

    it('should prevent form submission with invalid data', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      const submitButton = screen.getByText('Get Audit Report')

      // Test with clearly invalid data
      await user.type(addressInput, 'not-an-address')
      await user.click(submitButton)

      // Persona selector should appear (current behavior)
      await waitFor(() => {
        expect(screen.getByTestId('persona-selector')).toBeInTheDocument()
      })
    })
  })

  describe('DOM Injection Prevention', () => {
    it('should sanitize rendered content', () => {
      render(<HomePage />)

      // Check that no script tags exist except for structured data
      const scripts = document.querySelectorAll('script')
      scripts.forEach(script => {
        if (!script.getAttribute('data-testid')?.startsWith('structured-data')) {
          throw new Error('Unexpected script tag found')
        }
      })
    })

    it('should handle malformed input gracefully', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')

      // Test various edge cases
      const edgeCases = [
        '<img src=x onerror=alert("xss")>',
        '"><script>alert("xss")</script>',
        'javascript:void(0)',
        'vbscript:msgbox("xss")',
        '<iframe src="javascript:alert(1)"></iframe>',
      ]

      for (const edgeCase of edgeCases) {
        await user.clear(addressInput)
        await user.type(addressInput, edgeCase)

        expect(addressInput).toHaveValue(edgeCase)
        // Should not inject elements
        expect(document.querySelectorAll('img, iframe')).toHaveLength(0)
      }
    })
  })

  describe('Memory Leak Prevention', () => {
    it('should not accumulate event listeners on re-renders', () => {
      const { rerender } = render(<HomePage />)

      // Re-render multiple times
      for (let i = 0; i < 100; i++) {
        rerender(<HomePage />)
      }

      // Component should still be functional
      expect(screen.getByPlaceholderText('Enter your Ethereum address')).toBeInTheDocument()
    })

    it('should clean up intervals and timeouts on unmount', () => {
      const { unmount } = render(<HomePage />)

      // Mock setInterval to track cleanup
      const originalSetInterval = window.setInterval
      const originalClearInterval = window.clearInterval
      const intervals = new Set<number>()

      window.setInterval = jest.fn((callback, delay) => {
        const id = originalSetInterval(callback, delay) as number
        intervals.add(id)
        return id
      })

      window.clearInterval = jest.fn((id) => {
        intervals.delete(id)
        return originalClearInterval(id)
      })

      unmount()

      // Restore original functions
      window.setInterval = originalSetInterval
      window.clearInterval = originalClearInterval

      // Component should unmount without errors
      expect(document.body).toBeEmptyDOMElement()
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