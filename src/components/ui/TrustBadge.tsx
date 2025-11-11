import { Shield, CheckCircle, Award, Users, Eye, Zap, Clock, TrendingUp } from 'lucide-react'
import Badge from './Badge'

export interface TrustBadgeProps {
  type: 'verified' | 'secure' | 'users' | 'accuracy' | 'speed' | 'transparent' | 'uptime' | 'threats' | 'value'
  value?: string | number
  label: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  animated?: boolean
  trend?: 'up' | 'down' | 'neutral'
}

const TrustBadge = ({
  type,
  value,
  label,
  description,
  size = 'md',
  showIcon = true,
  animated = false,
  trend = 'neutral'
}: TrustBadgeProps) => {
  const icons = {
    verified: <CheckCircle className="w-4 h-4" />,
    secure: <Shield className="w-4 h-4" />,
    users: <Users className="w-4 h-4" />,
    accuracy: <Award className="w-4 h-4" />,
    speed: <Zap className="w-4 h-4" />,
    transparent: <Eye className="w-4 h-4" />,
    uptime: <Clock className="w-4 h-4" />,
    threats: <TrendingUp className="w-4 h-4" />,
    value: <Award className="w-4 h-4" />
  }

  const variants = {
    verified: 'security' as const,
    secure: 'security' as const,
    users: 'default' as const,
    accuracy: 'security' as const,
    speed: 'warning' as const,
    transparent: 'default' as const,
    uptime: 'security' as const,
    threats: 'warning' as const,
    value: 'default' as const
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

  const getTooltip = () => {
    if (description) return description

    switch (type) {
      case 'users':
        return 'Active users trusting Spectra with their security'
      case 'accuracy':
        return 'Detection accuracy across all vulnerability categories'
      case 'speed':
        return 'Average time to complete a full security scan'
      case 'uptime':
        return 'System availability for continuous monitoring'
      case 'threats':
        return 'Security threats detected and prevented this month'
      case 'value':
        return 'Total value of assets protected by Spectra'
      default:
        return ''
    }
  }

  return (
    <div className="group relative">
      <Badge
        variant={variants[type]}
        size={size}
        className={`gap-2 ${animated ? 'animate-pulse' : ''} transition-all duration-200 hover:scale-105`}
        role="status"
        aria-label={`${label}: ${getDisplayValue()}`}
        aria-describedby={`badge-tooltip-${type}`}
      >
        {showIcon && (
          <span className={`transition-transform duration-200 ${animated ? 'animate-spin-slow' : ''}`}>
            {icons[type]}
          </span>
        )}

        <div className="flex items-center gap-1">
          {value && <span className="font-bold">{getDisplayValue()}</span>}
          <span>{label}</span>

          {trend !== 'neutral' && (
            <TrendingUp
              className={`w-3 h-3 ${
                trend === 'up' ? 'text-security-green' : 'text-red-400'
              } ${trend === 'down' ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      </Badge>

      {/* Tooltip for accessibility and additional context */}
      <div
        id={`badge-tooltip-${type}`}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
        role="tooltip"
      >
        {getTooltip()}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-neutral-800"></div>
        </div>
      </div>
    </div>
  )
}

export default TrustBadge