'use client'

import React, { useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Card from './Card'
import Button from './Button'
import { type Locale } from '@/i18n/config'

// Debug: Define the locales directly to test
const allLocales = ['en', 'es', 'pt', 'fr', 'de', 'zh', 'ja', 'ko', 'ar', 'ru', 'tr', 'hi', 'bn', 'te', 'ta', 'mr'] as const
const allLocaleNames: Record<Locale, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  es: { native: 'Español', english: 'Spanish' },
  pt: { native: 'Português', english: 'Portuguese' },
  fr: { native: 'Français', english: 'French' },
  de: { native: 'Deutsch', english: 'German' },
  zh: { native: '简体中文', english: 'Chinese (Simplified)' },
  ja: { native: '日本語', english: 'Japanese' },
  ko: { native: '한국어', english: 'Korean' },
  ar: { native: 'العربية', english: 'Arabic' },
  ru: { native: 'Русский', english: 'Russian' },
  tr: { native: 'Türkçe', english: 'Turkish' },
  hi: { native: 'हिन्दी', english: 'Hindi' },
  bn: { native: 'বাংলা', english: 'Bengali' },
  te: { native: 'తెలుగు', english: 'Telugu' },
  ta: { native: 'தமிழ்', english: 'Tamil' },
  mr: { native: 'मराठी', english: 'Marathi' }
}
const allLocaleFlags: Record<Locale, string> = {
  en: '🇺🇸', es: '🇪🇸', pt: '🇧🇷', fr: '🇫🇷', de: '🇩🇪',
  zh: '🇨🇳', ja: '🇯🇵', ko: '🇰🇷', ar: '🇸🇦', ru: '🇷🇺',
  tr: '🇹🇷', hi: '🇮🇳', bn: '🇧🇩', te: '🇮🇳', ta: '🇱🇰', mr: '🇮🇳'
}

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
    // Get the current path without locale prefix
    const segments = pathname.split('/').filter(Boolean)

    // Remove the locale if it's the first segment
    if (segments.length > 0 && allLocales.includes(segments[0] as Locale)) {
      segments.shift()
    }

    // Construct the new path with the new locale
    const newPathname = segments.length > 0
      ? `/${newLocale}/${segments.join('/')}`
      : `/${newLocale}`

    router.push(newPathname)
    setIsOpen(false)
  }

  const currentLanguage = allLocaleNames[locale]
  const currentFlag = allLocaleFlags[locale]

  if (variant === 'modal') {
    return (
      <div className={className}>
        <Button
          variant="outline"
          size={size}
          onClick={() => setIsOpen(true)}
          icon={<span className="text-lg">{currentFlag}</span>}
          className="gap-2"
        >
          <span className="hidden sm:inline">{currentLanguage.native}</span>
          <span className="sm:hidden">{locale.toUpperCase()}</span>
        </Button>

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Select Language
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-white transition-colors p-2"
                    aria-label="Close language selector"
                  >
                    ×
                  </button>
                </div>

                <div className="grid gap-3">
                  {allLocales.map((lang) => {
                    const isSelected = lang === locale
                    const langInfo = allLocaleNames[lang]
                    const flag = allLocaleFlags[lang]

                    return (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-primary-500/10 border-primary-500 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-700/50 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{flag}</span>
                          <div className="text-left">
                            <div className="font-medium">{langInfo.native}</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">{langInfo.english}</div>
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
        icon={<span className="text-lg">{currentFlag}</span>}
        className="gap-2"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
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
          <Card variant="glass" className="absolute top-full right-0 mt-2 w-64 z-20 border border-neutral-200 dark:border-neutral-700 max-h-96 overflow-y-auto">
            <div className="p-2" role="listbox">
              {allLocales.map((lang) => {
                const isSelected = lang === locale
                const langInfo = allLocaleNames[lang]
                const flag = allLocaleFlags[lang]

                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-primary-500/10 text-white'
                        : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="text-lg">{flag}</span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{langInfo.native}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{langInfo.english}</div>
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