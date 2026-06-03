'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MobileOptimizedProps {
  children: React.ReactNode
  className?: string
  reducedMotion?: boolean
}

/**
 * MobileOptimized - A component that provides mobile-specific optimizations
 * including reduced motion, touch-friendly interactions, and performance monitoring
 */
export default function MobileOptimized({
  children,
  className,
  reducedMotion = true
}: MobileOptimizedProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768

      setIsMobile(mobile)

      // Check for low-end devices
      const connection = (navigator as any).connection ||
                        (navigator as any).mozConnection ||
                        (navigator as any).webkitConnection

      const lowEnd = mobile && (
        (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) ||
        navigator.hardwareConcurrency <= 4 ||
        (navigator as any).deviceMemory <= 2
      )

      setIsLowEndDevice(lowEnd)

      // Check for reduced motion preference
      if (window.matchMedia) {
        setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const optimizations = cn(
    // Touch optimizations
    isMobile && 'touch-pan-y touch-manipulation',

    // NOTE: never add `will-change-transform` / transform / filter to this
    // wrapper. It becomes the containing block for the fixed <Navbar>, which
    // then scrolls off-screen on low-end devices (the hamburger "disappears"
    // when you scroll). Keep this wrapper free of fixed-containing-block props.

    // Reduced motion support (only after client-side hydration)
    reducedMotion && (isLowEndDevice || prefersReducedMotion) && 'motion-reduce',

    className
  )

  return (
    <div className={optimizations}>
      {children}
    </div>
  )
}

/**
 * Hook for mobile-specific performance optimizations
 */
export function useMobileOptimizations() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const [connectionType, setConnectionType] = useState<string>('4g')

  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Check for low-end devices
      const connection = (navigator as any).connection ||
                        (navigator as any).mozConnection ||
                        (navigator as any).webkitConnection

      if (connection) {
        const effectiveType = connection.effectiveType || '4g'
        setConnectionType(effectiveType)

        const lowEnd = mobile && (
          effectiveType === 'slow-2g' ||
          effectiveType === '2g' ||
          navigator.hardwareConcurrency <= 4 ||
          (navigator as any).deviceMemory <= 2
        )

        setIsLowEndDevice(lowEnd)
      } else {
        // Fallback detection
        const lowEnd = mobile && navigator.hardwareConcurrency <= 4
        setIsLowEndDevice(lowEnd)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Listen for connection changes
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', checkMobile)
    }

    return () => {
      window.removeEventListener('resize', checkMobile)
      if (connection) {
        connection.removeEventListener('change', checkMobile)
      }
    }
  }, [])

  // Calculate reduced motion preference safely
  const getReducedMotion = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return isLowEndDevice // Fallback to low-end device detection
  }

  return {
    isMobile,
    isLowEndDevice,
    connectionType,
    shouldOptimize: isMobile || isLowEndDevice,
    shouldReduceMotion: isLowEndDevice || getReducedMotion(),
    shouldLazyLoad: connectionType === '2g' || connectionType === 'slow-2g' || isLowEndDevice
  }
}