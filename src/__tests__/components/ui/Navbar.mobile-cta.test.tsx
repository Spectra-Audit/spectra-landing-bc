import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navbar } from '@/components/ui/Navbar'

// next-intl, next/navigation and the theme context are mocked at module scope,
// before Navbar is imported, so the statically-imported component sees them.
// `t` echoes its key to keep assertions independent of translation copy.
jest.mock('lucide-react', () => {
  const stub = (name: string) => {
    const Icon = () => React.createElement('div', { 'data-testid': `${name}-icon` })
    Icon.displayName = name
    return Icon
  }
  return {
    Menu: stub('menu'),
    X: stub('x'),
    ExternalLink: stub('external-link'),
    ArrowUpRight: stub('arrow-up-right'),
    FileText: stub('file-text'),
    DollarSign: stub('dollar-sign'),
    Github: stub('github'),
    Twitter: stub('twitter'),
    MessageCircle: stub('message-circle'),
    Globe: stub('globe'),
    Check: stub('check'),
    Sun: stub('sun'),
    Moon: stub('moon'),
    Monitor: stub('monitor'),
  }
})

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}))

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: jest.fn(),
    resolvedTheme: 'dark',
    toggleTheme: jest.fn(),
  }),
}))

const APP_URL = 'https://app.spectra-audit.com'

/** Every class on the CTA's ancestors, up to and including the <nav>. */
function ancestorClassesWithinNav(el: HTMLElement): string[] {
  const classes: string[] = []
  let node: HTMLElement | null = el
  while (node) {
    classes.push(...Array.from(node.classList))
    if (node.tagName === 'NAV') break
    node = node.parentElement
  }
  return classes
}

function headerCta() {
  return screen.getByRole('button', { name: /nav\.launchApp/ })
}

describe('Navbar: mobile Launch App CTA (SPE-22)', () => {
  beforeEach(() => {
    window.open = jest.fn()
  })

  it('renders the CTA in the header, with the menu still closed', () => {
    render(<Navbar />)

    // The menu overlay only mounts while open, so with "Open menu" still
    // showing, any CTA on screen is the header one.
    expect(screen.getByRole('button', { name: /Open menu/ })).toBeInTheDocument()
    expect(headerCta()).toBeInTheDocument()
  })

  it('does not gate that CTA behind the md breakpoint', () => {
    render(<Navbar />)

    const classes = ancestorClassesWithinNav(headerCta())

    // `hidden` plus a `md:` display utility is how the CTA used to be
    // desktop-only; either would hide it again at 375px.
    expect(classes).not.toContain('hidden')
    expect(classes).not.toContain('md:block')
    expect(classes).not.toContain('md:flex')
  })

  it('opens the app from the header CTA', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    await user.click(headerCta())

    expect(window.open).toHaveBeenCalledWith(APP_URL, '_blank')
  })

  it('serves language and theme from the mobile menu instead of the header', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    const languageTriggers = () => document.querySelectorAll('[aria-haspopup="listbox"]')
    const themeToggles = () =>
      document.querySelectorAll('[aria-label$="mode"], [aria-label="System theme"]')

    // Closed menu: only the md+ desktop pair is in the tree.
    expect(languageTriggers()).toHaveLength(1)
    expect(themeToggles()).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: /Open menu/ }))

    // Open menu: the mobile pair sits under the section's existing labels.
    expect(languageTriggers()).toHaveLength(2)
    expect(themeToggles()).toHaveLength(2)
    expect(screen.getByText('navbar.mobileMenu.languageLabel')).toBeInTheDocument()
    expect(screen.getByText('navbar.mobileMenu.themeLabel')).toBeInTheDocument()
  })
})
