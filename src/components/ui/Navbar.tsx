'use client'

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, ExternalLink, ArrowUpRight, FileText, DollarSign, Github, Twitter, MessageCircle } from 'lucide-react'
import Button from './Button'
import LanguageSelector from './LanguageSelector'
import ThemeToggle from './ThemeToggle'
import { cn } from '@/lib/utils'

interface NavbarProps {
  className?: string
}

// Helper function to create locale-aware paths with 'as-needed' prefix
function localePath(locale: string, path: string = ''): string {
  // With 'as-needed' prefix, English (default) has no prefix
  if (locale === 'en') {
    return path ? `/${path}` : '/'
  }
  // Other locales have the prefix
  return path ? `/${locale}/${path}` : `/${locale}`
}

export function Navbar({ className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // useSyncExternalStore gives false on the server and true on the client,
  // preserving SSR/hydration parity without set-in-effect.
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const t = useTranslations()
  const locale = useLocale()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Memoize locale-aware paths
  const homePath = useMemo(() => localePath(locale), [locale])
  const whitepaperPath = useMemo(() => localePath(locale, 'whitepaper'), [locale])

  // Default fallback translations (English) for SSR
  const fallbackNavItems = [
    {
      label: 'Documentation',
      href: 'https://docs.spectra-audit.com',
      icon: <FileText className="w-5 h-5" />,
      external: true
    },
    {
      label: 'Whitepaper',
      href: whitepaperPath,
      icon: <FileText className="w-5 h-5" />,
      external: false
    },
    {
      label: 'Pricing',
      href: 'https://app.spectra-audit.com/pricing',
      icon: <DollarSign className="w-5 h-5" />,
      external: true
    }
  ]

  // Use translated navItems only after hydration
  const navItems = isHydrated ? [
    {
      label: t('nav.documentation'),
      href: 'https://docs.spectra-audit.com',
      icon: <FileText className="w-5 h-5" />,
      external: true
    },
    {
      label: t('nav.whitepaper'),
      href: whitepaperPath,
      icon: <FileText className="w-5 h-5" />,
      external: false
    },
    {
      label: t('nav.pricing'),
      href: 'https://app.spectra-audit.com/pricing',
      icon: <DollarSign className="w-5 h-5" />,
      external: true
    }
  ] : fallbackNavItems

  // Social links for mobile menu
  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/spectraaudit', color: 'text-blue-400' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/spectra', color: 'text-neutral-400' },
    { name: 'Discord', icon: MessageCircle, href: 'https://discord.gg/spectra', color: 'text-indigo-400' }
  ]

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-white/95 dark:bg-ink-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-white/5'
        : 'bg-transparent',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={homePath} className="flex items-center space-x-2">
              <Image
                src="/spectra-logo.png"
                alt="Spectra Audit"
                width={32}
                height={32}
                priority
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-neutral-900 dark:text-white">Spectra Audit</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative flex items-center space-x-1 text-neutral-600 dark:text-neutral-300 hover:text-spectra-blue-600 dark:hover:text-spectra-blue-400 transition-colors duration-200",
                  "text-sm font-medium",
                  "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-spectra-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                )}
                {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.external && <ExternalLink className="w-3 h-3 ml-1" />}
              </Link>
            ))}
          </div>

          {/* Theme & Language Controls */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector variant="dropdown" size="sm" />
              <ThemeToggle variant="button" size="sm" />
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                size="sm"
                className="bg-spectra-blue-500 hover:bg-spectra-blue-400 text-white font-semibold shadow-glow-spectra dark:shadow-neon"
                icon={<ArrowUpRight className="w-4 h-4" />}
                onClick={() => window.open('https://app.spectra-audit.com', '_blank')}
              >
                {t('nav.launchApp')}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-1">
              <LanguageSelector variant="dropdown" size="sm" />
              <ThemeToggle variant="button" size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ENHANCED Full-Screen Mobile Menu Overlay.
            Portaled to <body> so it escapes the navbar's stacking context: once
            scrolled, the nav gains `backdrop-blur`, which makes it the containing
            block for `position: fixed` descendants and would collapse this
            overlay to the 64px nav height (the menu then appears not to open).
            Rendering into <body> keeps it relative to the viewport at any scroll. */}
        {isMobileMenuOpen && createPortal(
          <div
            className={cn(
              "fixed inset-0 z-50 md:hidden",
              "bg-white/95 dark:bg-ink-950/95 backdrop-blur-lg",
              "transition-opacity duration-300 ease-in-out",
              isMobileMenuOpen ? "opacity-100" : "opacity-0"
            )}
            style={{ top: '64px' }}
          >
            <div className="h-full overflow-y-auto">
              <div className="min-h-full flex flex-col px-4 py-8">
                {/* Navigation Links - Large Touch Targets */}
                <div className="space-y-2 flex-1">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white",
                        "transition-all duration-200",
                        "text-lg font-semibold",
                        "py-4 px-6 rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/5",
                        "min-h-[64px] w-full",
                        "border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700/50",
                        // Stagger animation
                        "animate-slide-up"
                      )}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      <span className="flex-shrink-0 text-spectra-blue-500 dark:text-spectra-blue-400">{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.external && <ExternalLink className="w-4 h-4 flex-shrink-0 text-neutral-400 dark:text-neutral-500" />}
                    </Link>
                  ))}
                </div>

                {/* Language & Theme Controls in Mobile Menu */}
                <div className="py-6 border-t border-neutral-200 dark:border-neutral-800/50 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
                      <span className="text-xs uppercase tracking-wide">{t('navbar.mobileMenu.languageLabel')}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
                      <span className="text-xs uppercase tracking-wide">{t('navbar.mobileMenu.themeLabel')}</span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="py-6 border-t border-neutral-200 dark:border-neutral-800/50">
                  <p className="text-center text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wide mb-4">
                    {t('navbar.mobileMenu.connectWithUs')}
                  </p>
                  <div className="flex justify-center gap-4">
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon
                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center justify-center",
                            "w-14 h-14 rounded-xl",
                            "bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-800",
                            "border border-neutral-200 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600",
                            "transition-all duration-200",
                            "min-h-[56px] min-w-[56px]"
                          )}
                          aria-label={`Visit ${social.name}`}
                        >
                          <IconComponent className={cn("w-6 h-6", social.color)} />
                        </a>
                      )
                    })}
                  </div>
                </div>

                {/* CTA Button at Bottom */}
                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800/50 pb-safe">
                  <Button
                    size="xl"
                    variant="gradient"
                    className="w-full min-h-[64px] text-lg font-semibold"
                    icon={<ArrowUpRight className="w-5 h-5" />}
                    onClick={() => {
                      window.open('https://app.spectra-audit.com', '_blank')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    {t('nav.launchApp')}
                  </Button>
                  <p className="text-center text-neutral-400 dark:text-neutral-500 text-xs mt-4">
                    {t('navbar.mobileMenu.freeAnalysis')}
                  </p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </nav>
  )
}

export type { NavbarProps }