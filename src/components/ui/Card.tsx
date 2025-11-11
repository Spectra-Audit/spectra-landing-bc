import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'security' | 'warning' | 'danger'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl p-6 transition-all duration-300'

    const variants = {
      default: 'bg-neutral-800/50 border border-neutral-700/50 backdrop-blur-sm',
      glass: 'glass-dark',
      security: 'bg-security-green/10 border border-security-green/20 backdrop-blur-sm',
      warning: 'bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm',
      danger: 'bg-red-500/10 border border-red-500/20 backdrop-blur-sm'
    }

    const hoverClasses = hover ? 'hover:shadow-lg hover:shadow-primary-500/10 hover:border-primary-500/20 hover-lift' : ''

    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
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