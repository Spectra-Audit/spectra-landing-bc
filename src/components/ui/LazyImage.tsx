'use client'

import React, { useState, useRef, useEffect } from 'react'
import OptimizedImage from './OptimizedImage'

export interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  threshold?: number
  rootMargin?: string
  placeholder?: React.ReactNode
  onLoad?: () => void
  onError?: () => void
}

/**
 * LazyImage component with Intersection Observer for optimal lazy loading
 * Implements strategic lazy loading for below-the-fold images
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  threshold = 0.1,
  rootMargin = '50px',
  placeholder,
  onLoad,
  onError,
  ...props
}) => {
  const [isInView, setIsInView] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    const currentRef = imgRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin])

  const handleLoad = () => {
    setHasLoaded(true)
    onLoad?.()
  }

  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={className}
        style={{
          width: width || '100%',
          height: height || 'auto',
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
      >
        {placeholder || (
          <div className="w-full h-full bg-neutral-800 animate-pulse rounded-lg" />
        )}
      </div>
    )
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      onLoad={handleLoad}
      onError={onError}
      {...props}
    />
  )
}

export default LazyImage