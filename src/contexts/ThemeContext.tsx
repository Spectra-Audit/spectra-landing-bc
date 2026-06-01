'use client'

import React, { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'dark' | 'light'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ---------------------------------------------------------------------------
// Module-level store for the persisted theme preference
// ---------------------------------------------------------------------------

const themeListeners = new Set<() => void>()

function notifyThemeListeners() {
  themeListeners.forEach(cb => cb())
}

function subscribeTheme(cb: () => void): () => void {
  themeListeners.add(cb)
  // Also listen for cross-tab storage events
  window.addEventListener('storage', cb)
  return () => {
    themeListeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored && (['dark', 'light', 'system'] as string[]).includes(stored)) {
    return stored as Theme
  }
  return 'system'
}

function getServerTheme(): Theme {
  // SSR default — must match initial document class to avoid hydration mismatch
  return 'system'
}

// ---------------------------------------------------------------------------
// Module-level store for the OS colour-scheme preference
// ---------------------------------------------------------------------------

function subscribeSystem(cb: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getSystemSnapshot(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getServerSystem(): 'dark' | 'light' {
  // SSR default — must match the class applied by the server to avoid hydration mismatch
  return 'dark'
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getStoredTheme, getServerTheme)
  const systemResolvedTheme = useSyncExternalStore(subscribeSystem, getSystemSnapshot, getServerSystem)

  // Computed during render — no extra state needed
  const resolvedTheme: 'dark' | 'light' = theme === 'system' ? systemResolvedTheme : theme

  // VALUE form: consumers call setTheme('light') etc.
  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem('theme', next)
    notifyThemeListeners()
  }, [])

  // Preserve original cycle: dark → light → system → dark
  const toggleTheme = useCallback(() => {
    const next: Theme =
      theme === 'dark' ? 'light' :
      theme === 'light' ? 'system' :
      'dark'
    setTheme(next)
  }, [theme, setTheme])

  // Apply resolved class to document — client-only side effect, no setState
  // Apply the resolved theme class to <html>. Persistence is handled by setTheme
  // (the only place a user-chosen value is written); writing here would run with the
  // transient SSR snapshot during hydration and could clobber a saved preference.
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

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
