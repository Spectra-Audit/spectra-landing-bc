import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'spectra' | 'hero' | 'stats' | 'security' | 'warning' | 'danger'
  hover?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      hover = false,
      size = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'transition-all duration-300'

    const variants = {
      // Default card - Standard
      default: cn(
        'bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50 backdrop-blur-sm',
        'rounded-2xl'
      ),

      // Glass card - Subtle
      glass: cn(
        'glass dark:glass-dark rounded-2xl'
      ),

      // Spectra card - Branded with gradient
      spectra: cn(
        'bg-gradient-card dark:bg-gradient-to-br from-spectra-blue-500/10 to-spectra-purple-500/5 border border-white/10 dark:border-white/5 backdrop-blur-md',
        'rounded-2xl shadow-lg',
        'hover:border-spectra-blue-500/30'
      ),

      // Hero card - Prominent with glow
      hero: cn(
        'bg-gradient-to-br from-spectra-blue-500/15 to-spectra-purple-500/10',
        'border-2 border-spectra-blue-500/30 rounded-2xl',
        'shadow-glow-spectra-lg',
        'hover:border-spectra-blue-500/50 hover:shadow-glow-spectra'
      ),

      // Stats card - Data focused
      stats: cn(
        'bg-white dark:bg-neutral-800/30 border border-neutral-200 dark:border-neutral-700/30 backdrop-blur-sm',
        'rounded-xl',
        'hover:border-spectra-blue-500/20'
      ),

      // Security card - Success state
      security: cn(
        'bg-success-bg border border-success-border backdrop-blur-sm',
        'rounded-2xl'
      ),

      // Warning card - Caution state
      warning: cn(
        'bg-warning-bg border border-warning-border backdrop-blur-sm',
        'rounded-2xl'
      ),

      // Danger card - Critical state
      danger: cn(
        'bg-error-bg border border-error-border backdrop-blur-sm',
        'rounded-2xl'
      ),
    }

    const sizes = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }

    const hoverClasses = hover
      ? 'hover:shadow-card-hover hover:-translate-y-1 hover-lift'
      : ''

    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          hoverClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
