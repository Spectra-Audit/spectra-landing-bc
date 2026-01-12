import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'security' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  success?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      success = false,
      icon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      // Primary Button - Main CTA with enhanced gradient
      primary: cn(
        'bg-gradient-cta text-white shadow-cta-primary',
        'hover:shadow-cta-primary-hover hover:-translate-y-0.5 active:translate-y-0',
        'hover:scale-[1.02] active:scale-[0.98]'
      ),

      // Secondary Button - Supporting actions
      secondary: cn(
        'bg-neutral-200 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100',
        'border-2 border-neutral-300 dark:border-neutral-700/50 hover:border-neutral-400 dark:hover:border-neutral-600',
        'hover:bg-neutral-300 dark:hover:bg-neutral-700/80 hover:-translate-y-0.5 active:translate-y-0'
      ),

      // Outline Button - Alternative actions
      outline: cn(
        'border-2 border-spectra-blue-500/50 text-spectra-blue-700 dark:text-spectra-blue-400 bg-transparent',
        'hover:bg-spectra-blue-50 dark:hover:bg-spectra-blue-500/10 hover:border-spectra-blue-600 dark:hover:border-spectra-blue-500',
        'hover:text-spectra-blue-800 dark:hover:text-spectra-blue-300',
        'hover:-translate-y-0.5 active:translate-y-0'
      ),

      // Ghost Button - Minimal actions
      ghost: cn(
        'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white',
        'hover:bg-neutral-100 dark:hover:bg-white/10',
        'hover:-translate-y-0.5 active:translate-y-0'
      ),

      // Security Button - Trust-focused actions with Spectra green
      security: cn(
        'bg-success-bg border border-success-border text-success-primary',
        'hover:bg-success-bg hover:border-success-primary hover:scale-[1.02]',
        'hover:shadow-glow-green active:scale-[0.98]'
      ),

      // Gradient Button - Special emphasis with full Spectra gradient
      gradient: cn(
        'bg-gradient-spectra text-white shadow-glow-spectra',
        'hover:shadow-glow-spectra-lg hover:-translate-y-1 hover:scale-[1.03]',
        'active:translate-y-0 active:scale-[0.98]'
      ),
    }

    const sizes = {
      sm: 'px-4 py-2.5 text-sm min-h-[40px]',       /* Compact */
      md: 'px-6 py-3 text-base min-h-[48px]',        /* Standard */
      lg: 'px-8 py-4 text-lg min-h-[56px]',          /* Large */
      xl: 'px-10 py-5 text-xl min-h-[64px]'          /* Extra large */
    }

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          success && 'animate-success-pulse bg-gradient-shield-green',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {success && (
          <svg
            className="w-5 h-5 mr-2 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {icon && !loading && !success && (
          <span className="mr-2 flex-shrink-0">{icon}</span>
        )}
        <span className={cn('truncate', loading && 'opacity-70')}>
          {children}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
