'use client'

import React, { useState, useEffect, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  lazy?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  onLoad?: () => void
  onError?: () => void
  style?: React.CSSProperties
  unoptimized?: boolean
  // Enhanced props for better UX
  loadingText?: string
  errorText?: string
  showSkeleton?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  // SEO enhancement props
  title?: string
  caption?: string
  'data-testid'?: string
}

/**
 * OptimizedImage component with comprehensive performance optimizations
 *
 * Features:
 * - Automatic format selection (WebP/AVIF with fallbacks)
 * - Blur-up placeholders and skeleton loaders
 * - Strategic lazy loading
 * - Error handling and fallback states
 * - SEO optimization with proper alt text and structured data
 * - Responsive images with srcsets
 * - Core Web Vitals optimization
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  lazy = true,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  onLoad,
  onError,
  style,
  unoptimized = false,
  loadingText = 'Loading...',
  errorText = 'Failed to load image',
  showSkeleton = true,
  objectFit = 'cover',
  title,
  caption,
  'data-testid': testId,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)
  // useSyncExternalStore gives false on the server and true on the client,
  // preventing hydration mismatch without set-in-effect.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  // Generate blur placeholder if not provided (client-side only)
  const generateBlurDataURL = (w: number, h: number): string => {
    if (!mounted) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4='

    const canvas = document.createElement('canvas')
    if (!canvas) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4='

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4='

    // Create gradient placeholder
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, '#1e293b')
    gradient.addColorStop(1, '#334155')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    return canvas.toDataURL()
  }

  // Default blur data URL for better UX (static SVG for SSR, dynamic canvas for client)
  const defaultBlurDataURL = blurDataURL || (mounted && width && height ? generateBlurDataURL(width, height) : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=')

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Retry mechanism for failed images
  const retryLoad = () => {
    setHasError(false)
    setIsLoading(true)
    setImageSrc(src) // Reset to original src
  }

  // Generate responsive sizes if not provided
  const defaultSizes = sizes || (fill ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw')

  // Combine styles with objectFit to ensure consistency
  const combinedStyle = {
    ...style,
    objectFit,
  }

  return (
    <div className={cn('relative overflow-hidden', className)} data-testid={testId}>
      {/* Skeleton loader */}
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-800 animate-pulse">
          <div className="absolute inset-0 bg-[linear-gradient(110deg,#000_0%,transparent_50%,#000_100%)] animate-shimmer" />
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && showSkeleton && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-neutral-400 text-sm">{loadingText}</div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-800/50 border border-neutral-700/50 rounded-lg">
          <div className="text-red-400 text-sm mb-2">{errorText}</div>
          <button
            onClick={retryLoad}
            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Optimized Next.js Image */}
      {!hasError && (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={defaultBlurDataURL}
          sizes={defaultSizes}
          onLoad={handleLoad}
          onError={handleError}
          style={combinedStyle}
          unoptimized={unoptimized}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          title={title || alt}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
        />
      )}

      {/* Caption for SEO and accessibility */}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-xs text-center">{caption}</p>
        </div>
      )}
    </div>
  )
}

export default OptimizedImage