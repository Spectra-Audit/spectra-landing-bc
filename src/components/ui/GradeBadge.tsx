import { Shield, ShieldCheck, ShieldAlert, ShieldX, ShieldMinus } from 'lucide-react'
import Badge from './Badge'
import { cn } from '@/lib/utils'

export interface GradeBadgeProps {
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const GradeBadge = ({ grade, showLabel = true, size = 'md', animated = false, className }: GradeBadgeProps) => {
  const icons = {
    A: <ShieldCheck className="w-5 h-5" />,
    B: <Shield className="w-5 h-5" />,
    C: <ShieldAlert className="w-5 h-5" />,
    D: <ShieldMinus className="w-5 h-5" />,
    F: <ShieldX className="w-5 h-5" />
  }

  const labels = {
    A: 'Low Risk',
    B: 'Moderate Risk',
    C: 'High Risk',
    D: 'Critical Risk',
    F: 'Danger'
  }

  const animations = {
    A: 'animate-pulse-slow',
    B: 'animate-pulse',
    C: 'animate-pulse',
    D: 'animate-pulse',
    F: 'animate-pulse'
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'grade-a'
      case 'B': return 'text-blue-400'
      case 'C': return 'text-yellow-400'
      case 'D': return 'text-orange-400'
      case 'F': return 'text-red-400'
      default: return 'text-neutral-400'
    }
  }

  return (
    <div className={cn(
      'flex items-center gap-2',
      animated && animations[grade],
      className
    )}>
      <div className={cn(
        'inline-flex items-center justify-center p-2 rounded-full border-2 bg-neutral-900/50 backdrop-blur-sm',
        getGradeColor(grade),
        {
          'border-security-green/50': grade === 'A',
          'border-blue-400/50': grade === 'B',
          'border-yellow-400/50': grade === 'C',
          'border-orange-400/50': grade === 'D',
          'border-red-400/50': grade === 'F'
        }
      )}>
        {icons[grade]}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-mono font-bold text-white">
          Grade {grade}
        </span>
        {showLabel && (
          <span className={cn(
            'text-sm font-medium',
            getGradeColor(grade)
          )}>
            {labels[grade]}
          </span>
        )}
      </div>
    </div>
  )
}

export default GradeBadge