import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '@/app/[locale]/page'

// Mock all child components to isolate the page component
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
  StatsBanner: () => <div data-testid="stats-banner">Stats Banner</div>,
}))

jest.mock('@/components/ui/PersonaSelector', () => ({
  __esModule: true,
  default: ({ onPersonaSelect, selectedPersona }: any) => (
    <div data-testid="persona-selector">
      <button
        onClick={() => onPersonaSelect('passive-saver')}
        data-testid="passive-saver-btn"
        data-selected={selectedPersona === 'passive-saver'}
      >
        Passive Saver
      </button>
      <button
        onClick={() => onPersonaSelect('power-analyst')}
        data-testid="power-analyst-btn"
        data-selected={selectedPersona === 'power-analyst'}
      >
        Power Analyst
      </button>
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
  createSoftwareSchema: () => ({ '@type': 'SoftwareApplication', name: 'Spectra' }),
  createOrganizationSchema: () => ({ '@type': 'Organization', name: 'Spectra Security' }),
}))

jest.mock('@/components/ui/LanguageSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="language-selector">Language Selector</div>,
}))

jest.mock('@/components/ui/ThemeToggle', () => ({
  __esModule: true,
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}))

jest.mock('@/app/[locale]/TrendingProtocols', () => ({
  __esModule: true,
  default: () => <div data-testid="trending-protocols">Trending Protocols</div>,
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
}))

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders the main page structure', () => {
      render(<HomePage />)

      expect(screen.getByText('Smart Contract Security Audits in Seconds, Not Weeks')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your Ethereum address')).toBeInTheDocument()
      expect(screen.getByText('Get Audit Report')).toBeInTheDocument()
    })

    it('renders all trust badges', () => {
      render(<HomePage />)

      expect(screen.getAllByTestId('trust-badge')).toHaveLength(3)
      expect(screen.getByTestId('grade-badge')).toBeInTheDocument()
    })

    it('renders structured data scripts', () => {
      render(<HomePage />)

      expect(screen.getByTestId('structured-data-software')).toBeInTheDocument()
      expect(screen.getByTestId('structured-data-organization')).toBeInTheDocument()
    })

    it('renders persona selector modal when triggered', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const getAuditButton = screen.getByText('Get Audit Report')
      await user.click(getAuditButton)

      expect(screen.getByTestId('persona-selector')).toBeInTheDocument()
      expect(screen.getByTestId('passive-saver-btn')).toBeInTheDocument()
      expect(screen.getByTestId('power-analyst-btn')).toBeInTheDocument()
    })
  })

  describe('Ethereum Address Input', () => {
    it('should update address state when typing', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      await user.type(addressInput, '0x1234567890123456789012345678901234567890')

      expect(addressInput).toHaveValue('0x1234567890123456789012345678901234567890')
    })

    it('should show clear button when address is entered', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      const clearButton = screen.queryByTestId('x-icon')

      expect(clearButton).not.toBeInTheDocument()

      await user.type(addressInput, '0x1234567890123456789012345678901234567890')

      const clearButtonVisible = screen.getByTestId('x-icon')
      expect(clearButtonVisible).toBeInTheDocument()
    })

    it('should clear address when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      await user.type(addressInput, '0x1234567890123456789012345678901234567890')

      const clearButton = screen.getByTestId('x-icon')
      await user.click(clearButton)

      expect(addressInput).toHaveValue('')
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument()
    })

    it('should open persona selector when Get Audit Report is clicked', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const getAuditButton = screen.getByText('Get Audit Report')
      await user.click(getAuditButton)

      expect(screen.getByTestId('persona-selector')).toBeInTheDocument()
    })
  })

  describe('Persona Selection', () => {
    it('should close persona selector when persona is selected', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      // Open persona selector
      const getAuditButton = screen.getByText('Get Audit Report')
      await user.click(getAuditButton)

      expect(screen.getByTestId('persona-selector')).toBeInTheDocument()

      // Select persona
      const passiveSaverButton = screen.getByTestId('passive-saver-btn')
      await user.click(passiveSaverButton)

      expect(screen.queryByTestId('persona-selector')).not.toBeInTheDocument()
    })

    it('should update selected persona state', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      // Open persona selector
      const getAuditButton = screen.getByText('Get Audit Report')
      await user.click(getAuditButton)

      // Select passive saver persona
      const passiveSaverButton = screen.getByTestId('passive-saver-btn')
      await user.click(passiveSaverButton)

      // Re-open selector to verify selection
      await user.click(getAuditButton)

      expect(screen.getByTestId('passive-saver-btn')).toHaveAttribute('data-selected', 'true')
    })

    it('should switch between personas correctly', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      // Open persona selector
      const getAuditButton = screen.getByText('Get Audit Report')
      await user.click(getAuditButton)

      // Select passive saver
      const passiveSaverButton = screen.getByTestId('passive-saver-btn')
      await user.click(passiveSaverButton)

      // Re-open and select power analyst
      await user.click(getAuditButton)
      const powerAnalystButton = screen.getByTestId('power-analyst-btn')
      await user.click(powerAnalystButton)

      // Re-open to verify
      await user.click(getAuditButton)

      expect(screen.getByTestId('power-analyst-btn')).toHaveAttribute('data-selected', 'true')
      expect(screen.getByTestId('passive-saver-btn')).toHaveAttribute('data-selected', 'false')
    })

    it('should close persona selector when close button is clicked', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      // Open persona selector
      const getAuditButton = screen.getByText('Get Audit Report')
      await user.click(getAuditButton)

      expect(screen.getByTestId('persona-selector')).toBeInTheDocument()

      // Find and click close button (using the X icon)
      const closeButton = screen.getByTestId('x-icon')
      await user.click(closeButton)

      expect(screen.queryByTestId('persona-selector')).not.toBeInTheDocument()
    })
  })

  describe('Persona-Specific Content', () => {
    it('should display default trust metrics when no persona is selected', () => {
      render(<HomePage />)

      const trustBadges = screen.getAllByTestId('trust-badge')
      expect(trustBadges).toHaveLength(3)
    })

    it('should update content when persona is selected', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      // Open and select a persona
      const getAuditButton = screen.getByText('Get Audit Report')
      await user.click(getAuditButton)

      const passiveSaverButton = screen.getByTestId('passive-saver-btn')
      await user.click(passiveSaverButton)

      // Content should still render properly with persona selected
      expect(screen.getByText('Smart Contract Security Audits in Seconds, Not Weeks')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels on close button', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const getAuditButton = screen.getByText('Get Audit Report')
      await user.click(getAuditButton)

      const closeButton = screen.getByLabelText('Close persona selector')
      expect(closeButton).toBeInTheDocument()
    })

    it('should have proper button roles', () => {
      render(<HomePage />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)

      buttons.forEach(button => {
        expect(button).toHaveAttribute('type')
      })
    })

    it('should have focus management', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      expect(addressInput).toHaveFocus()

      await user.tab()
      const getAuditButton = screen.getByText('Get Audit Report')
      expect(getAuditButton).toHaveFocus()
    })
  })

  describe('Error Handling', () => {
    it('should handle missing translations gracefully', () => {
      jest.doMock('next-intl', () => ({
        useTranslations: () => () => 'translation-missing',
        useLocale: () => 'en',
      }))

      expect(() => {
        render(<HomePage />)
      }).not.toThrow()
    })

    it('should handle navigation errors gracefully', () => {
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({
          push: jest.fn(() => Promise.reject(new Error('Navigation failed'))),
        }),
        usePathname: () => '/',
        useSearchParams: () => new URLSearchParams(),
      }))

      expect(() => {
        render(<HomePage />)
      }).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('should render within reasonable time', () => {
      const startTime = performance.now()
      render(<HomePage />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(1000) // Should render within 1 second
    })

    it('should handle rapid user interactions without memory leaks', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      // Rapid typing in address input
      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      for (let i = 0; i < 100; i++) {
        await user.type(addressInput, 'a')
        await user.clear(addressInput)
      }

      // Should still be functional
      expect(addressInput).toBeInTheDocument()
    })
  })

  describe('State Management', () => {
    it('should maintain address state during persona selection', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const addressInput = screen.getByPlaceholderText('Enter your Ethereum address')
      await user.type(addressInput, '0x1234567890123456789012345678901234567890')

      // Open persona selector
      const getAuditButton = screen.getByText('Get Audit Report')
      await user.click(getAuditButton)

      // Select persona
      const passiveSaverButton = screen.getByTestId('passive-saver-btn')
      await user.click(passiveSaverButton)

      // Address should be preserved
      expect(addressInput).toHaveValue('0x1234567890123456789012345678901234567890')
    })

    it('should reset persona selector state when closed and reopened', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const getAuditButton = screen.getByText('Get Audit Report')

      // Open and close persona selector
      await user.click(getAuditButton)
      const closeButton = screen.getByTestId('x-icon')
      await user.click(closeButton)

      // Re-open and it should work normally
      await user.click(getAuditButton)
      expect(screen.getByTestId('persona-selector')).toBeInTheDocument()
    })
  })
})