'use client'

import React, { useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Card from './Card'
import Button from './Button'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config'

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'modal'
  size?: 'sm' | 'md' | 'lg'
  showFlag?: boolean
  className?: string
}

export default function LanguageSelector({
  variant = 'dropdown',
  size = 'md',
  showFlag = true,
  className = ''
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: Locale) => {
    // Remove current locale from pathname if it exists
    const pathnameWithoutLocale = pathname.replace(/^\/(es|fr|de|ja|zh|ko)/, '') || '/'

    // Add new locale to pathname
    const newPathname = newLocale === 'en'
      ? pathnameWithoutLocale
      : `/${newLocale}${pathnameWithoutLocale}`

    router.push(newPathname)
    setIsOpen(false)
  }

  const currentLanguage = localeNames[locale]
  const currentFlag = localeFlags[locale]

  if (variant === 'modal') {
    return (
      <div className={className}>
        <Button
          variant="outline"
          size={size}
          onClick={() => setIsOpen(true)}
          icon={<Globe className="w-4 h-4" />}
          className="gap-2"
        >
          {showFlag && <span>{currentFlag}</span>}
          <span className="hidden sm:inline">{currentLanguage.native}</span>
          <span className="sm:hidden">{locale.toUpperCase()}</span>
        </Button>

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Select Language
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-400 hover:text-white transition-colors p-2"
                    aria-label="Close language selector"
                  >
                    ×
                  </button>
                </div>

                <div className="grid gap-3">
                  {locales.map((lang) => {
                    const isSelected = lang === locale
                    const langInfo = localeNames[lang]
                    const flag = localeFlags[lang]

                    return (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-primary-500/10 border-primary-500 text-white'
                            : 'bg-neutral-700/50 border-neutral-600 text-neutral-200 hover:border-neutral-500 hover:bg-neutral-700'
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{flag}</span>
                          <div className="text-left">
                            <div className="font-medium">{langInfo.native}</div>
                            <div className="text-sm text-neutral-400">{langInfo.english}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-primary-400" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        icon={<Globe className="w-4 h-4" />}
        className="gap-2"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {showFlag && <span>{currentFlag}</span>}
        <span className="hidden sm:inline">{currentLanguage.native}</span>
        <span className="sm:hidden">{locale.toUpperCase()}</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <Card variant="glass" className="absolute top-full right-0 mt-2 w-64 z-20 border border-neutral-700">
            <div className="p-2" role="listbox">
              {locales.map((lang) => {
                const isSelected = lang === locale
                const langInfo = localeNames[lang]
                const flag = localeFlags[lang]

                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-primary-500/10 text-white'
                        : 'text-neutral-200 hover:bg-neutral-700/50'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="text-lg">{flag}</span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{langInfo.native}</div>
                      <div className="text-xs text-neutral-400">{langInfo.english}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary-400" />}
                  </button>
                )
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}