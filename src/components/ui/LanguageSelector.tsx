'use client'

import React, { useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Card from './Card'
import Button from './Button'
import { type Locale, locales } from '@/i18n/config'

// Locale data directly defined for reliability
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
    // The locale root is always a safe destination. Anything we can't fully
    // validate below collapses to it rather than being forwarded into
    // router.push() unchecked.
    const localeRoot = `/${newLocale}`

    // Defensive: only navigate to a locale we actually ship. newLocale is typed
    // as Locale, but the click handlers ultimately read from runtime config.
    if (!locales.includes(newLocale)) {
      router.push('/')
      setIsOpen(false)
      return
    }

    // Split the current path and drop a leading known-locale segment so we can
    // swap in the new one.
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
      segments.shift()
    }

    // A remaining segment is only safe if it's a plain in-app route token:
    // ASCII alphanumerics plus a few separators, with dots allowed ONLY between
    // tokens (never a standalone "." / ".." or a leading/trailing dot). Because
    // nothing outside this allow-list is permitted, a single test rejects every
    // class called out in the bug report at once:
    //   - path traversal: "." / ".." and their encoded forms (%2e / %2E) — the
    //     standalone dots and the "%" are both outside the allow-list
    //   - encoded separators: "%2f" / "%5c" — the "%" is rejected
    //   - null bytes & control chars (\x00, \x01–\x1f, \x7f) — not allow-listed
    //   - Unicode bidi/override & zero-width chars (e.g. ‮) — not allow-listed
    //   - URI schemes ("javascript:", "data:") — the ":" is rejected
    //   - HTML/XSS metacharacters ("<", ">", quotes) — not allow-listed
    // The pattern uses a single character class (no overlapping alternation), so
    // it runs in linear time and is not vulnerable to ReDoS on adversarial input.
    const SAFE_SEGMENT = /^[A-Za-z0-9_~-]+(?:\.[A-Za-z0-9_~-]+)*$/
    const segmentsAreSafe = segments.every((segment) => SAFE_SEGMENT.test(segment))

    // On ANY suspicious segment, discard the whole tail and fall back to the
    // locale root — we never reconstruct an attacker-influenced path.
    const target =
      segmentsAreSafe && segments.length > 0
        ? `${localeRoot}/${segments.join('/')}`
        : localeRoot

    // Belt-and-suspenders: the assembled target must be a clean, root-anchored,
    // in-app path — no protocol-relative "//", no traversal "..", nothing but
    // allow-listed characters. If it isn't, fall back to the locale root.
    const SAFE_PATH = /^\/[A-Za-z0-9/._~-]*$/
    const safeTarget =
      SAFE_PATH.test(target) && !target.includes('..') && !target.startsWith('//')
        ? target
        : localeRoot

    // Navigate only to the validated, '/'-anchored in-app route.
    router.push(safeTarget)
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
                  {locales.map((lang) => {
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
              {locales.map((lang) => {
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