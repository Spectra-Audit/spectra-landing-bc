'use client'

import React, { useState } from 'react'
import OptimizedImage from './OptimizedImage'
import { cn } from '@/lib/utils'

export interface ProtocolLogoProps {
  name: string
  symbol: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fallback?: boolean
  verified?: boolean
  onClick?: () => void
}

/**
 * ProtocolLogo component for displaying DeFi protocol logos
 * with built-in fallback to gradient-based initials
 */
const ProtocolLogo: React.FC<ProtocolLogoProps> = ({
  name,
  symbol,
  size = 'md',
  className,
  fallback = true,
  verified = false,
  onClick,
}) => {
  const [hasError, setHasError] = useState(false)
  const sizeMap = {
    sm: { width: 24, height: 24, className: 'text-xs' },
    md: { width: 32, height: 32, className: 'text-sm' },
    lg: { width: 48, height: 48, className: 'text-base' },
    xl: { width: 64, height: 64, className: 'text-lg' },
  }

  const sizeConfig = sizeMap[size]
  const { width, height, className: textClass } = sizeConfig
  const logoPath = `/images/protocols/${symbol.toLowerCase()}.png`
  const gradientMap: { [key: string]: string } = {
    UNI: 'from-pink-500 to-purple-600',
    AAVE: 'from-red-500 to-pink-600',
    COMP: 'from-green-500 to-emerald-600',
    CRV: 'from-blue-500 to-cyan-600',
    SUSHI: 'from-orange-500 to-red-600',
    BAL: 'from-indigo-500 to-purple-600',
  }

  const gradient = gradientMap[symbol] || 'from-blue-500 to-purple-600'

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <div
        className={cn('rounded-full transition-transform hover:scale-105', {
          'cursor-pointer': onClick,
        })}
        onClick={onClick}
      >
        {!hasError ? (
        <OptimizedImage
          src={logoPath}
          alt={`${name} (${symbol}) logo`}
          width={width}
          height={height}
          quality={90}
          priority={size !== 'xl'} // Prioritize smaller logos
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${btoa(
            `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" /><stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)" /></svg>`
          )}`}
          onError={() => setHasError(true)}
        />
      ) : fallback ? (
        <div
          className={cn(
            'w-full h-full bg-gradient-to-br rounded-full flex items-center justify-center text-white font-bold',
            gradient,
            textClass
          )}
        >
          {symbol.charAt(0)}
        </div>
      ) : null}
      </div>

      {/* Verification badge */}
      {verified && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-neutral-900" />
      )}
    </div>
  )
}

export default ProtocolLogo