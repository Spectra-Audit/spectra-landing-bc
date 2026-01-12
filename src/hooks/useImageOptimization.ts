'use client'

import { useState, useCallback, useEffect } from 'react'

interface ImageMetrics {
  loadTime: number
  fileSize: number
  format: string
  dimensions: { width: number; height: number }
  devicePixelRatio: number
}

interface UseImageOptimizationOptions {
  enableMetrics?: boolean
  adaptiveQuality?: boolean
  networkAware?: boolean
}

interface UseImageOptimizationReturn {
  imageMetrics: Map<string, ImageMetrics>
  recordImageLoad: (src: string, metrics: Partial<ImageMetrics>) => void
  getOptimalQuality: (baseQuality: number) => number
  shouldUseWebP: boolean
  shouldUseAVIF: boolean
  getResponsiveSrc: (baseSrc: string, width: number, height?: number) => string
}

/**
 * Hook for optimizing image loading based on network conditions and device capabilities
 * Implements adaptive quality and format selection for optimal performance
 */
export const useImageOptimization = (options: UseImageOptimizationOptions = {}): UseImageOptimizationReturn => {
  const { enableMetrics = true, adaptiveQuality = true, networkAware = true } = options
  const [imageMetrics] = useState<Map<string, ImageMetrics>>(new Map())
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: '4g' as 'slow-2g' | '2g' | '3g' | '4g',
    downlink: 10,
    rtt: 100,
    saveData: false,
  })

  // Get network information for adaptive loading
  useEffect(() => {
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        const updateNetworkInfo = () => {
          setNetworkInfo({
            effectiveType: connection.effectiveType || '4g',
            downlink: connection.downlink || 10,
            rtt: connection.rtt || 100,
            saveData: connection.saveData || false,
          })
        }

        updateNetworkInfo()
        connection.addEventListener('change', updateNetworkInfo)

        return () => {
          connection.removeEventListener('change', updateNetworkInfo)
        }
      }
    }
  }, [])

  // Record image loading metrics
  const recordImageLoad = useCallback((src: string, metrics: Partial<ImageMetrics>) => {
    if (!enableMetrics) return

    const existingMetrics = imageMetrics.get(src) || {
      loadTime: 0,
      fileSize: 0,
      format: 'unknown',
      dimensions: { width: 0, height: 0 },
      devicePixelRatio: 1,
    }

    const updatedMetrics: ImageMetrics = {
      ...existingMetrics,
      ...metrics,
    }

    imageMetrics.set(src, updatedMetrics)

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Image loaded: ${src}`, updatedMetrics)
    }
  }, [enableMetrics, imageMetrics])

  // Get optimal quality based on network and device
  const getOptimalQuality = useCallback((baseQuality: number): number => {
    if (!adaptiveQuality) return baseQuality

    let quality = baseQuality

    // Adjust based on network conditions
    if (networkAware) {
      if (networkInfo.saveData) {
        quality = Math.min(quality, 50) // Very aggressive compression for data saver
      } else {
        switch (networkInfo.effectiveType) {
          case 'slow-2g':
          case '2g':
            quality = Math.min(quality, 60)
            break
          case '3g':
            quality = Math.min(quality, 75)
            break
          case '4g':
            // Use base quality for 4g
            break
        }
      }
    }

    // Adjust based on device pixel ratio
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    if (dpr > 2) {
      quality = Math.max(quality - 10, 50) // Slightly lower quality for high-DPI displays
    }

    return Math.max(quality, 30) // Minimum quality threshold
  }, [adaptiveQuality, networkAware, networkInfo])

  // Check WebP support
  const shouldUseWebP = useCallback((): boolean => {
    if (typeof window === 'undefined') return true // Assume support on server

    // Check for WebP support using canvas test
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }, [])

  // Check AVIF support
  const shouldUseAVIF = useCallback((): boolean => {
    if (typeof window === 'undefined') return false // Don't assume AVIF support

    // Check for AVIF support
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
  }, [])

  // Generate responsive src with format optimization
  const getResponsiveSrc = useCallback((baseSrc: string, width: number, height?: number): string => {
    // Add dimensions to src if it's a local image
    if (baseSrc.startsWith('/')) {
      const params = new URLSearchParams()
      params.set('w', width.toString())
      if (height) params.set('h', height.toString())
      params.set('q', getOptimalQuality(75).toString())

      // Add format parameter based on support
      if (shouldUseAVIF()) {
        params.set('fm', 'avif')
      } else if (shouldUseWebP()) {
        params.set('fm', 'webp')
      }

      const queryString = params.toString()
      return `${baseSrc}${baseSrc.includes('?') ? '&' : '?'}${queryString}`
    }

    return baseSrc
  }, [getOptimalQuality, shouldUseAVIF, shouldUseWebP])

  return {
    imageMetrics,
    recordImageLoad,
    getOptimalQuality,
    shouldUseWebP: shouldUseWebP(),
    shouldUseAVIF: shouldUseAVIF(),
    getResponsiveSrc,
  }
}