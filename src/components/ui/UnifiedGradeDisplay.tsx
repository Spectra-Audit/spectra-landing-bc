import React from 'react'
import { getTranslations } from 'next-intl/server'
import { Shield, ShieldCheck, ShieldAlert, ShieldX, ShieldMinus, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UnifiedGradeDisplayProps {
  score: number // Security Score, 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  showLabel?: boolean
  showDescription?: boolean
  className?: string
  variant?: 'default' | 'compact'
}

/**
 * UnifiedGradeDisplay - the Security Score readout: the 0-100 number and the
 * colour band it falls in.
 *
 * It used to render an A-F letter alongside the number ("Grade A - Excellent",
 * plus an A+/A/B breakdown row under the `detailed` variant). Nothing produces
 * a letter: the backend stores `score_general` as an integer 0-100 and the app
 * renders that number against a colour band. The letters were invented here,
 * so they are gone along with the `detailed` variant, whose entire content was
 * the second letter.
 *
 * The band thresholds now match the app's `src/utils/scoreColor.ts`
 * (85 / 70 / 55 / 40). They were 90 / 75 / 60 / 40, which disagreed both with
 * the app and with this site's own "Overall Security Score" card, which has
 * always published 85+ as Excellent.
 *
 * Server Component — only ever needed `useTranslations` (no hooks, no
 * browser APIs), so it renders on the server via `getTranslations`. Declared
 * as a plain async function (not `React.FC`, whose type doesn't model an
 * async/Promise-returning Server Component).
 */
async function UnifiedGradeDisplay({
  score,
  size = 'lg',
  animated = false,
  showLabel = true,
  showDescription = true,
  className,
  variant = 'default'
}: UnifiedGradeDisplayProps) {
  const t = await getTranslations('grades')
  // Normalize score to 0-100 range
  const normalizedScore = Math.max(0, Math.min(100, score))

  const sizeConfig = {
    sm: { shieldSize: 100, fontSize: 'text-2xl', iconSize: 20 },
    md: { shieldSize: 140, fontSize: 'text-3xl', iconSize: 24 },
    lg: { shieldSize: 180, fontSize: 'text-4xl', iconSize: 32 },
    xl: { shieldSize: 220, fontSize: 'text-5xl', iconSize: 40 }
  }

  const { shieldSize, fontSize, iconSize } = sizeConfig[size]

  const getGradeConfig = (score: number) => {
    if (score >= 85) {
      return {
        icon: ShieldCheck,
        tier: 'excellent' as const,
        color: 'text-spectra-green-700 dark:text-spectra-green-500',
        bgGradient: 'from-spectra-green-500 to-spectra-green-600',
        borderColor: 'border-spectra-green-500/50',
        glowColor: 'rgba(0, 208, 132, 0.4)',
        shadowColor: 'shadow-glow-green'
      }
    } else if (score >= 70) {
      return {
        icon: Shield,
        tier: 'good' as const,
        color: 'text-spectra-blue-700 dark:text-spectra-blue-500',
        bgGradient: 'from-spectra-blue-500 to-spectra-blue-600',
        borderColor: 'border-spectra-blue-500/50',
        glowColor: 'rgba(0, 102, 255, 0.4)',
        shadowColor: 'shadow-glow-spectra'
      }
    } else if (score >= 55) {
      return {
        icon: ShieldAlert,
        tier: 'fair' as const,
        color: 'text-yellow-700 dark:text-warning-primary',
        bgGradient: 'from-warning-primary to-warning-secondary',
        borderColor: 'border-warning-primary/50',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        shadowColor: 'shadow-lg'
      }
    } else if (score >= 40) {
      return {
        icon: ShieldMinus,
        tier: 'poor' as const,
        color: 'text-orange-700 dark:text-orange-400',
        bgGradient: 'from-orange-500 to-red-500',
        borderColor: 'border-orange-500/50 dark:border-orange-400/50',
        glowColor: 'rgba(249, 115, 22, 0.4)',
        shadowColor: 'shadow-lg'
      }
    } else {
      return {
        icon: ShieldX,
        tier: 'critical' as const,
        color: 'text-red-700 dark:text-error-primary',
        bgGradient: 'from-error-primary to-error-secondary',
        borderColor: 'border-error-primary/50',
        glowColor: 'rgba(239, 68, 68, 0.4)',
        shadowColor: 'shadow-lg'
      }
    }
  }

  const config = getGradeConfig(normalizedScore)
  const Icon = config.icon
  const label = t(config.tier)
  const description = t(`descriptions.${config.tier}`)

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className={cn(
          'relative flex items-center justify-center',
          'rounded-xl border-2 bg-neutral-100 dark:bg-neutral-900/50 backdrop-blur-sm',
          config.borderColor,
          animated && 'animate-pulse-glow'
        )}
        style={{ width: iconSize * 2, height: iconSize * 2 }}>
          <Icon className={cn(config.color)} style={{ width: iconSize, height: iconSize }} />
        </div>
        <div className="flex flex-col">
          <span className={cn('font-mono font-bold text-neutral-900 dark:text-white', fontSize)}>
            {normalizedScore}/100
          </span>
          {showLabel && (
            <span className={cn('text-sm font-medium', config.color)}>
              {label}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Shield Container with Glow */}
      <div className="relative mb-6">
        {/* Animated Glow Ring */}
        {animated && normalizedScore >= 85 && (
          <div
            className="absolute inset-0 rounded-full animate-pulse-glow"
            style={{
              background: `radial-gradient(circle, ${config.glowColor}, transparent 70%)`,
              transform: 'scale(1.2)',
              filter: 'blur(8px)'
            }}
          />
        )}

        {/* Score Shape — holographic surface; the score glows in its grade
            colour (audit-fever look) instead of a flat coloured block */}
        <div
          className={cn(
            'relative flex items-center justify-center rounded-3xl',
            'holographic-card border-2 backdrop-blur-sm',
            config.borderColor,
            animated && 'animate-pulse-glow',
            config.shadowColor
          )}
          style={{
            width: shieldSize,
            height: shieldSize,
            boxShadow: `0 8px 40px ${config.glowColor}`
          }}
        >
          {/* Score Number */}
          <div className="text-center leading-none">
            <div
              className={cn('font-mono font-extrabold drop-shadow-glow', config.color)}
              style={{ fontSize: shieldSize * 0.4 }}
            >
              {normalizedScore}
            </div>
            <div className={cn('mt-1 text-sm font-semibold opacity-70', config.color)}>/100</div>
          </div>
        </div>

        {/* Verification Badge */}
        {normalizedScore >= 85 && (
          <div className="absolute -bottom-2 -right-2 bg-spectra-green-500 rounded-full p-2 shadow-lg">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Score band */}
      {showLabel && (
        <div className="text-center space-y-2">
          <div className={cn('font-display font-extrabold', fontSize, config.color, 'text-gradient-spectra')}>
            {label}
          </div>

          {/* Description */}
          {showDescription && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-[250px] leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default UnifiedGradeDisplay
