'use client'

import React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import Button from './Button'

interface ThemeToggleProps {
  variant?: 'button' | 'toggle'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export default function ThemeToggle({
  variant = 'button',
  size = 'md',
  showLabel = false,
  className = ''
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme()

  if (variant === 'toggle') {
    return (
      <div className={`flex items-center bg-neutral-700/50 rounded-lg p-1 ${className}`}>
        <button
          onClick={() => setTheme('light')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
            theme === 'light'
              ? 'bg-white text-neutral-900'
              : 'text-neutral-400 hover:text-white'
          }`}
          aria-label="Light mode"
          title="Light mode"
        >
          <Sun className="w-4 h-4" />
          {showLabel && <span className="text-sm">Light</span>}
        </button>

        <button
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
            theme === 'dark'
              ? 'bg-white text-neutral-900'
              : 'text-neutral-400 hover:text-white'
          }`}
          aria-label="Dark mode"
          title="Dark mode"
        >
          <Moon className="w-4 h-4" />
          {showLabel && <span className="text-sm">Dark</span>}
        </button>

        <button
          onClick={() => setTheme('system')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
            theme === 'system'
              ? 'bg-white text-neutral-900'
              : 'text-neutral-400 hover:text-white'
          }`}
          aria-label="System theme"
          title="System theme"
        >
          <Monitor className="w-4 h-4" />
          {showLabel && <span className="text-sm">System</span>}
        </button>
      </div>
    )
  }

  // Button variant
  const getIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4" />
    if (theme === 'dark') return <Moon className="w-4 h-4" />
    return <Monitor className="w-4 h-4" />
  }

  const getLabel = () => {
    if (theme === 'light') return 'Light mode'
    if (theme === 'dark') return 'Dark mode'
    return 'System theme'
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={toggleTheme}
      icon={getIcon()}
      className={className}
      aria-label={getLabel()}
      title={getLabel()}
    >
      {showLabel && <span>{getLabel()}</span>}
    </Button>
  )
}