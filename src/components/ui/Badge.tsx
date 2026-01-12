import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'security' | 'warning' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  grade?: 'A' | 'B' | 'C' | 'D' | 'F'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', grade, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-mono font-semibold rounded-full transition-all duration-200'

    const variants = {
      default: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
      secondary: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300',
      security: 'bg-spectra-green-100 dark:bg-security-green/20 text-spectra-green-700 dark:text-security-green border border-spectra-green-300 dark:border-security-green/30',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      outline: 'border border-neutral-400 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 bg-transparent'
    }

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    }

    const gradeColors = {
      A: 'bg-spectra-green-100 dark:bg-security-green/20 text-spectra-green-700 dark:text-security-green border border-spectra-green-300 dark:border-security-green/30',
      B: 'bg-spectra-blue-100 dark:bg-blue-100/20 text-spectra-blue-700 dark:text-blue-400 border border-spectra-blue-300 dark:border-blue-400/30',
      C: 'bg-yellow-100 dark:bg-yellow-100/20 text-yellow-800 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-400/30',
      D: 'bg-orange-100 dark:bg-orange-100/20 text-orange-800 dark:text-orange-400 border border-orange-300 dark:border-orange-400/30',
      F: 'bg-red-100 dark:bg-red-100/20 text-red-800 dark:text-red-400 border border-red-300 dark:border-red-400/30'
    }

    const displayVariant = grade ? gradeColors[grade] : variants[variant]

    return (
      <span
        className={cn(
          baseClasses,
          displayVariant,
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {grade && (
          <span className="mr-1">
            {grade === 'A' && '✓'}
            {grade === 'B' && '○'}
            {grade === 'C' && '△'}
            {grade === 'D' && '⚠'}
            {grade === 'F' && '✗'}
          </span>
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge