'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, ExternalLink, Rocket, FileText, DollarSign, Shield } from 'lucide-react'
import Button from './Button'
import LanguageSelector from './LanguageSelector'
import ThemeToggle from './ThemeToggle'
import { cn } from '@/lib/utils'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations()
  const locale = useLocale()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    {
      label: 'Documentation',
      href: 'https://docs.spectra.security',
      icon: <FileText className="w-4 h-4" />,
      external: true
    },
    {
      label: 'Whitepaper',
      href: '/whitepaper',
      icon: <FileText className="w-4 h-4" />,
      external: false
    },
    {
      label: 'Pricing',
      href: 'https://app.spectra.security/pricing',
      icon: <DollarSign className="w-4 h-4" />,
      external: true
    }
  ]

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800/50'
        : 'bg-transparent',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Spectra</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center space-x-1 text-neutral-300 hover:text-white transition-colors duration-200",
                  "text-sm font-medium"
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
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
                icon={<Rocket className="w-4 h-4" />}
                onClick={() => window.open('https://app.spectra.security', '_blank')}
              >
                Launch App
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageSelector variant="dropdown" size="sm" />
              <ThemeToggle variant="button" size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-neutral-300 hover:text-white transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800/50">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors duration-200",
                    "text-sm font-medium py-2"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                  {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.external && <ExternalLink className="w-3 h-3" />}
                </Link>
              ))}
              <div className="pt-3 border-t border-neutral-800">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
                  icon={<Rocket className="w-4 h-4" />}
                  onClick={() => window.open('https://app.spectra.security', '_blank')}
                >
                  Launch App
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export type { NavbarProps }