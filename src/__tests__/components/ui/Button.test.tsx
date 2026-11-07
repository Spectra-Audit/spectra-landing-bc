import React from 'react'
import { render, screen } from '@testing-library/react'
import Button from '@/components/ui/Button'

/**
 * `href` is what makes every navigation CTA on the site a real link
 * (SPE-16). These cases pin the element choice, since rendering a
 * `<button>` here is exactly the defect that made the marketing site's
 * CTAs unreachable without JS.
 */
describe('Button', () => {
  it('renders a button when no href is given', () => {
    render(<Button>Press</Button>)

    expect(screen.getByRole('button', { name: 'Press' })).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders an anchor with the href when one is given', () => {
    render(<Button href="/whitepaper">Read</Button>)

    const link = screen.getByRole('link', { name: 'Read' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/whitepaper')
  })

  it('adds noopener noreferrer when opening a new tab', () => {
    render(
      <Button href="https://app.spectra-audit.com" target="_blank">
        Launch
      </Button>
    )

    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('leaves rel alone for same-tab links', () => {
    render(<Button href="/whitepaper">Read</Button>)

    expect(screen.getByRole('link')).not.toHaveAttribute('rel')
  })

  it('honours an explicit rel over the default', () => {
    render(
      <Button href="https://example.com" target="_blank" rel="nofollow">
        Out
      </Button>
    )

    expect(screen.getByRole('link')).toHaveAttribute('rel', 'nofollow')
  })

  it('keeps the same visual classes whether link or button', () => {
    const { container: asButton } = render(<Button variant="gradient" size="lg">X</Button>)
    const { container: asLink } = render(
      <Button variant="gradient" size="lg" href="/x">X</Button>
    )

    expect(asLink.firstElementChild?.className).toBe(asButton.firstElementChild?.className)
  })

  it('falls back to a button when a link would be disabled', () => {
    // An <a> has no disabled state, so a disabled link CTA must not render
    // as a followable link.
    render(<Button href="/x" disabled>Nope</Button>)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('falls back to a button while loading', () => {
    render(<Button href="/x" loading>Wait</Button>)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
