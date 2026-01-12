'use client'

import React from 'react'
import OptimizedImage from './OptimizedImage'
import { Shield, Lock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SecurityIllustrationProps {
  grade: number | string // 0-100 percentage score or A-F letter grade
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  showLabel?: boolean
  className?: string
}

/**
 * SecurityIllustration component for displaying security grades
 * with appropriate visual indicators and animations
 *
 * This component is SSR-safe and handles both numeric (0-100) and letter (A-F) grades.
 */
const SecurityIllustration: React.FC<SecurityIllustrationProps> = ({
  grade,
  size = 'md',
  animated = false,
  showLabel = true,
  className,
}) => {
  // Normalize grade to consistent numeric value for both SSR and client
  // This eliminates hydration mismatches by ensuring deterministic output
  const normalizedGrade = React.useMemo(() => {
    // Handle string letter grades
    if (typeof grade === 'string') {
      const gradeUpper = grade.trim().toUpperCase()
      switch (gradeUpper) {
        case 'A': return 95
        case 'B': return 80
        case 'C': return 65
        case 'D': return 45
        case 'F': return 25
        default:
          // Try to parse as number, fallback to 95
          const parsed = parseInt(grade, 10)
          return isNaN(parsed) ? 95 : Math.max(0, Math.min(100, parsed))
      }
    }

    // Handle numeric grades
    const numGrade = Number(grade)
    if (isNaN(numGrade)) return 95
    return Math.max(0, Math.min(100, numGrade))
  }, [grade])
  const sizeMap = {
    sm: { width: 80, height: 80, iconSize: 16 },
    md: { width: 120, height: 120, iconSize: 24 },
    lg: { width: 160, height: 160, iconSize: 32 },
    xl: { width: 200, height: 200, iconSize: 40 },
  }

  const { width, height, iconSize } = sizeMap[size]

  const getGradeConfig = (score: number) => {
    if (score >= 90) {
      return {
        color: 'text-green-400',
        bgGradient: 'from-green-500/20 to-emerald-600/20',
        borderColor: 'border-green-400/30',
        icon: CheckCircle,
        label: 'Excellent',
        description: 'No critical vulnerabilities found',
        gradeLetter: 'A',
        colorHex: ['#10b981', '#059669']
      }
    } else if (score >= 75) {
      return {
        color: 'text-blue-400',
        bgGradient: 'from-blue-500/20 to-cyan-600/20',
        borderColor: 'border-blue-400/30',
        icon: Shield,
        label: 'Good',
        description: 'Minor issues identified',
        gradeLetter: 'B',
        colorHex: ['#3b82f6', '#0ea5e9']
      }
    } else if (score >= 60) {
      return {
        color: 'text-yellow-400',
        bgGradient: 'from-yellow-500/20 to-orange-600/20',
        borderColor: 'border-yellow-400/30',
        icon: AlertTriangle,
        label: 'Fair',
        description: 'Moderate security risks',
        gradeLetter: 'C',
        colorHex: ['#f59e0b', '#f97316']
      }
    } else if (score >= 40) {
      return {
        color: 'text-orange-400',
        bgGradient: 'from-orange-500/20 to-red-600/20',
        borderColor: 'border-orange-400/30',
        icon: AlertTriangle,
        label: 'Poor',
        description: 'Significant security concerns',
        gradeLetter: 'D',
        colorHex: ['#fb923c', '#ef4444']
      }
    } else {
      return {
        color: 'text-red-400',
        bgGradient: 'from-red-500/20 to-rose-600/20',
        borderColor: 'border-red-400/30',
        icon: XCircle,
        label: 'Critical',
        description: 'Multiple critical vulnerabilities',
        gradeLetter: 'F',
        colorHex: ['#ef4444', '#dc2626']
      }
    }
  }

  const config = getGradeConfig(normalizedGrade)
  const Icon = config.icon
  const gradeLetter = config.gradeLetter

  // Generate SVG illustration for the security grade
  const generateSecuritySVG = () => {
    const [color1, color2] = config.colorHex

    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="securityGrad${normalizedGrade}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Background circle with gradient -->
        <circle cx="${width/2}" cy="${height/2}" r="${width/2-2}" fill="url(#securityGrad${normalizedGrade})" opacity="0.1"/>

        <!-- Shield shape -->
        <path d="M ${width/2} ${height*0.2}
                L ${width*0.8} ${height*0.3}
                L ${width*0.8} ${height*0.7}
                Q ${width/2} ${height*0.9} ${width*0.2} ${height*0.7}
                L ${width*0.2} ${height*0.3}
                Z"
              fill="url(#securityGrad${normalizedGrade})"
              opacity="0.8"
              filter="url(#glow)"/>

        <!-- Grade text -->
        <text x="${width/2}" y="${height*0.6}"
              font-family="Arial, sans-serif"
              font-size="${width*0.4}"
              font-weight="bold"
              fill="white"
              text-anchor="middle"
              filter="url(#glow)">
          ${normalizedGrade}%
        </text>

        ${animated ? `
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="scale"
          values="1;1.05;1"
          dur="2s"
          repeatCount="indefinite"
          additive="sum"/>
        ` : ''}
      </svg>
    `)}`
  }

  // Generate consistent alt text for accessibility
  const altText = `Security score ${normalizedGrade}% - ${config.label}`

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <div className="relative">
        <OptimizedImage
          src={generateSecuritySVG()}
          alt={altText}
          width={width}
          height={height}
          quality={95}
          priority={true}
          className={cn(
            'rounded-full transition-all duration-300',
            animated && 'animate-pulse',
            `bg-gradient-to-br ${config.bgGradient} ${config.borderColor} border-2`
          )}
        />

        {/* Animated glow effect for excellent grades */}
        {normalizedGrade >= 90 && animated && (
          <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
        )}
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <div className={cn('font-bold text-lg', config.color)}>
            {normalizedGrade}%
          </div>
          <div className="text-sm text-neutral-300">{config.label}</div>
          <div className="text-xs text-neutral-400 mt-1 max-w-[200px]">
            {config.description}
          </div>
        </div>
      )}
    </div>
  )
}

export default SecurityIllustration