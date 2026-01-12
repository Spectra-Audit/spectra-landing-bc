'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'dark' | 'light'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark')

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored && ['dark', 'light', 'system'].includes(stored)) {
      setTheme(stored)
    } else {
      // Set default theme to system
      setTheme('system')
    }
  }, [])

  // Apply theme to document and resolve system theme
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    let resolved: 'dark' | 'light'
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolved = theme
    }

    root.classList.add(resolved)
    setResolvedTheme(resolved)
    localStorage.setItem('theme', theme)

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        const newResolved = mediaQuery.matches ? 'dark' : 'light'
        root.classList.remove('light', 'dark')
        root.classList.add(newResolved)
        setResolvedTheme(newResolved)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'dark') return 'light'
      if (current === 'light') return 'system'
      return 'dark'
    })
  }

  const value = {
    theme,
    setTheme,
    resolvedTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Utility for conditional classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Theme-aware class generator
export function themeClasses(baseClasses: string, darkClasses?: string, lightClasses?: string) {
  return `${baseClasses} ${darkClasses || ''} ${lightClasses || ''}`
}

// Hook for theme-aware classes
export function useThemeClasses() {
  const { resolvedTheme } = useTheme()

  return {
    bg: resolvedTheme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50',
    text: resolvedTheme === 'dark' ? 'text-white' : 'text-neutral-900',
    textSecondary: resolvedTheme === 'dark' ? 'text-neutral-300' : 'text-neutral-600',
    border: resolvedTheme === 'dark' ? 'border-neutral-700' : 'border-neutral-200',
    card: resolvedTheme === 'dark' ? 'bg-neutral-800' : 'bg-white',
    input: resolvedTheme === 'dark' ? 'bg-neutral-800/50' : 'bg-neutral-100/50',
    gradient: resolvedTheme === 'dark'
      ? 'from-neutral-900 via-neutral-800 to-neutral-900'
      : 'from-neutral-50 via-white to-neutral-50'
  }
}