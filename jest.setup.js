import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
  useLocale: () => 'en',
}))

// Mock Lucide React icons to avoid rendering complexity
jest.mock('lucide-react', () => ({
  Activity: () => <div data-testid="activity-icon" />,
  X: () => <div data-testid="x-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Search: () => <div data-testid="search-icon" />,
  BarChart3: () => <div data-testid="barchart-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  CheckCircle: () => <div data-testid="checkcircle-icon" />,
  TrendingUp: () => <div data-testid="trendingup-icon" />,
  TrendingDown: () => <div data-testid="trendingdown-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  Award: () => <div data-testid="award-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  Check: () => <div data-testid="check-icon" />,
  ExternalLink: () => <div data-testid="externallink-icon" />,
}))

// Global test utilities
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}