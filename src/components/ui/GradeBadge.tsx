import { Shield, ShieldCheck, ShieldAlert, ShieldX, ShieldMinus } from 'lucide-react'
import Badge from './Badge'
import { cn } from '@/lib/utils'

export interface GradeBadgeProps {
  score: number // 0-100 percentage score
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const GradeBadge = ({ score, showLabel = true, size = 'md', animated = false, className }: GradeBadgeProps) => {
  // Ensure score is within 0-100 range
  const normalizedScore = Math.max(0, Math.min(100, score))
  
  const getIconAndLabel = (score: number) => {
    if (score >= 90) {
      return {
        icon: <ShieldCheck className="w-5 h-5" />,
        label: 'Excellent',
        animation: 'animate-pulse-slow'
      }
    } else if (score >= 75) {
      return {
        icon: <Shield className="w-5 h-5" />,
        label: 'Good',
        animation: 'animate-pulse'
      }
    } else if (score >= 60) {
      return {
        icon: <ShieldAlert className="w-5 h-5" />,
        label: 'Fair',
        animation: 'animate-pulse'
      }
    } else if (score >= 40) {
      return {
        icon: <ShieldMinus className="w-5 h-5" />,
        label: 'Poor',
        animation: 'animate-pulse'
      }
    } else {
      return {
        icon: <ShieldX className="w-5 h-5" />,
        label: 'Critical',
        animation: 'animate-pulse'
      }
    }
  }
  
  const { icon, label, animation } = getIconAndLabel(normalizedScore)

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'grade-a' // Green
    if (score >= 75) return 'text-blue-600 dark:text-blue-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    if (score >= 40) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getBorderColor = (score: number) => {
    if (score >= 90) return 'border-spectra-green-600/50 dark:border-security-green/50'
    if (score >= 75) return 'border-blue-600/50 dark:border-blue-400/50'
    if (score >= 60) return 'border-yellow-600/50 dark:border-yellow-400/50'
    if (score >= 40) return 'border-orange-600/50 dark:border-orange-400/50'
    return 'border-red-600/50 dark:border-red-400/50'
  }

  const scoreColor = getScoreColor(normalizedScore)
  const borderColor = getBorderColor(normalizedScore)
  
  return (
    <div className={cn(
      'flex items-center gap-2',
      animated && animation,
      className
    )}>
      <div className={cn(
        'inline-flex items-center justify-center p-2 rounded-full border-2 bg-neutral-100 dark:bg-neutral-900/50 backdrop-blur-sm',
        scoreColor,
        borderColor
      )}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-mono font-bold text-neutral-900 dark:text-white">
          {normalizedScore}%
        </span>
        {showLabel && (
          <span className={cn(
            'text-sm font-medium',
            scoreColor
          )}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

export default GradeBadge