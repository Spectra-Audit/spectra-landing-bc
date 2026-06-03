import { Shield, CheckCircle, Award, Users, Eye, Zap, Clock, TrendingUp, Lock, FileCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TrustBadgeProps {
  type: 'verified' | 'secure' | 'users' | 'accuracy' | 'speed' | 'transparent' | 'uptime' | 'threats' | 'value' | 'compliance'
  value?: string | number
  label: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  animated?: boolean
  trend?: 'up' | 'down' | 'neutral'
  variant?: 'default' | 'metric' | 'authority'
}

const TrustBadge: React.FC<TrustBadgeProps> = ({
  type,
  value,
  label,
  description,
  size = 'md',
  showIcon = true,
  animated = false,
  trend = 'neutral',
  variant = 'default'
}) => {
  const icons = {
    verified: <CheckCircle className="w-4 h-4" />,
    secure: <Shield className="w-4 h-4" />,
    users: <Users className="w-4 h-4" />,
    accuracy: <Award className="w-4 h-4" />,
    speed: <Zap className="w-4 h-4" />,
    transparent: <Eye className="w-4 h-4" />,
    uptime: <Clock className="w-4 h-4" />,
    threats: <TrendingUp className="w-4 h-4" />,
    value: <Award className="w-4 h-4" />,
    compliance: <FileCheck className="w-4 h-4" />
  }

  const getDisplayValue = () => {
    if (type === 'users' && typeof value === 'number') {
      return value >= 1000 ? `${(value / 1000).toFixed(1)}K+` : `${value.toLocaleString()}+`
    }
    if (type === 'accuracy' && typeof value === 'number') {
      return `${value}%`
    }
    if (type === 'value' && typeof value === 'string') {
      return value
    }
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    return value
  }

  // Authority badge variant (ISO, SOC 2, compliance, etc.)
  if (variant === 'authority') {
    return (
      <div className="group relative">
        <div className={cn(
          'flex items-center gap-3 px-5 py-3 rounded-xl',
          'bg-success-bg border border-success-border',
          'hover:bg-success-bg hover:border-success-primary',
          'transition-all duration-300 hover:scale-105',
          animated && 'animate-pulse-glow'
        )}>
          {showIcon && (
            <div className="text-spectra-green-700 dark:text-spectra-green-400">
              {icons[type]}
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-spectra-green-700 dark:text-spectra-green-400">
              {label}
            </span>
            {description && (
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                {description}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Metric badge variant (numbers with labels)
  if (variant === 'metric') {
    return (
      <div className="group relative">
        <div className={cn(
          'flex items-center gap-3 px-6 py-4 rounded-2xl',
          'bg-spectra-blue-500/15 border border-spectra-blue-500/30',
          'hover:bg-spectra-blue-500/20 hover:border-spectra-blue-500/50',
          'transition-all duration-300 hover:scale-105',
          animated && 'animate-pulse-glow'
        )}>
          {showIcon && (
            <div className="text-spectra-blue-500">
              {icons[type]}
            </div>
          )}

          <div className="flex items-baseline gap-2">
            {value && (
              <span className="text-2xl md:text-3xl font-bold text-spectra-blue-700 dark:text-spectra-blue-500 font-mono">
                {getDisplayValue()}
              </span>
            )}
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
              {label}
            </span>
          </div>

          {trend !== 'neutral' && (
            <TrendingUp
              className={cn(
                'w-4 h-4 ml-2',
                trend === 'up' ? 'text-success-primary' : 'text-error-primary',
                trend === 'down' && 'rotate-180'
              )}
            />
          )}
        </div>

        {/* Tooltip */}
        {description && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-neutral-800 dark:bg-neutral-900 border border-neutral-700 dark:border-neutral-600 rounded-lg text-xs text-neutral-300 dark:text-neutral-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            {description}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-neutral-800 dark:border-t-neutral-700" />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default badge variant (original style for backward compatibility)
  return (
    <div className="group relative">
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          'bg-white dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700/50',
          'hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:border-neutral-400 dark:hover:border-neutral-600',
          'transition-all duration-200',
          animated && 'animate-pulse'
        )}
        role="status"
        aria-label={`${label}: ${getDisplayValue()}`}
        aria-describedby={`badge-tooltip-${type}`}
      >
        {showIcon && icons[type]}
        <div className="flex items-center gap-1">
          {value && <span className="font-bold text-neutral-900 dark:text-white">{getDisplayValue()}</span>}
          <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
          {trend !== 'neutral' && (
            <TrendingUp
              className={cn(
                'w-3 h-3',
                trend === 'up' ? 'text-spectra-green-700 dark:text-security-green' : 'text-red-600 dark:text-red-400',
                trend === 'down' && 'rotate-180'
              )}
            />
          )}
        </div>
      </div>

      {/* Tooltip for accessibility and additional context */}
      <div
        id={`badge-tooltip-${type}`}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 dark:bg-neutral-900 border border-neutral-700 dark:border-neutral-600 rounded-lg text-xs text-neutral-300 dark:text-neutral-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
        role="tooltip"
      >
        {description || (() => {
          switch (type) {
            case 'users':
              return 'Active users trusting Spectra Audit with their security'
            case 'accuracy':
              return 'Detection accuracy across all vulnerability categories'
            case 'speed':
              return 'Average time to complete a full security scan'
            case 'uptime':
              return 'High availability infrastructure'
            case 'threats':
              return 'Security threats detected and prevented this month'
            case 'value':
              return 'Total value of assets protected by Spectra Audit'
            default:
              return ''
          }
        })()}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-neutral-800 dark:border-t-neutral-700"></div>
        </div>
      </div>
    </div>
  )
}

export default TrustBadge
