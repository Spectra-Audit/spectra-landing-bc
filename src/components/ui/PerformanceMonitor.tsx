'use client'

import React, { useEffect, useState } from 'react'
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

interface MetricData {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
}

interface PerformanceMonitorProps {
  enabled?: boolean
  onMetricUpdate?: (metric: MetricData) => void
  showInDevelopment?: boolean
}

/**
 * PerformanceMonitor component for tracking Core Web Vitals
 * Monitors LCP, FID, CLS, FCP, and TTFB metrics
 */
const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'production',
  onMetricUpdate,
  showInDevelopment = true,
}) => {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const handleMetric = (metric: any) => {
      const metricData: MetricData = {
        id: metric.id,
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      }

      setMetrics(prev => [...prev.filter(m => m.name !== metric.name), metricData])
      onMetricUpdate?.(metricData)

      // Send to analytics service in production
      if (process.env.NODE_ENV === 'production') {
        sendToAnalytics(metricData)
      }
    }

    // Measure Core Web Vitals
    onCLS(handleMetric)
    onINP(handleMetric)
    onFCP(handleMetric)
    onLCP(handleMetric)
    onTTFB(handleMetric)

    // Toggle visibility with keyboard shortcut (Ctrl/Cmd + Shift + P)
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [enabled, onMetricUpdate])

  const sendToAnalytics = (metric: MetricData) => {
    // Send to your analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
        custom_map: {
          metric_rating: metric.rating,
          metric_delta: metric.delta,
        },
      })
    }
  }

  const getMetricColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-400'
      case 'needs-improvement':
        return 'text-yellow-400'
      case 'poor':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getMetricThresholds = (name: string) => {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
      CLS: { good: 0.1, poor: 0.25 },
    }
    return thresholds[name as keyof typeof thresholds] || { good: 0, poor: 0 }
  }

  const formatMetricValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return value.toFixed(3)
    }
    return `${Math.round(value)}ms`
  }

  if (!showInDevelopment && process.env.NODE_ENV === 'development') {
    return null
  }

  return (
    <>
      {/* Development toggle button */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="fixed bottom-4 right-4 z-50 px-3 py-2 bg-neutral-800 text-white text-xs rounded-lg border border-neutral-700 hover:bg-neutral-700 transition-colors"
          title="Toggle Performance Monitor (Ctrl+Shift+P)"
        >
          🚀 {metrics.length} metrics
        </button>
      )}

      {/* Performance metrics panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl">
          <div className="p-4 border-b border-neutral-800">
            <h3 className="text-white font-medium flex items-center gap-2">
              🚀 Core Web Vitals
            </h3>
            <p className="text-neutral-400 text-xs mt-1">
              Real-time performance metrics
            </p>
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {metrics.length === 0 ? (
              <div className="text-neutral-400 text-sm">Loading metrics...</div>
            ) : (
              metrics.map(metric => {
                const thresholds = getMetricThresholds(metric.name)
                return (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium text-sm">{metric.name}</span>
                      <span className={`text-sm font-medium ${getMetricColor(metric.rating)}`}>
                        {formatMetricValue(metric.name, metric.value)}
                      </span>
                    </div>

                    <div className="w-full bg-neutral-800 rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 relative">
                        <div
                          className="absolute top-0 h-2 w-1 bg-white rounded-full"
                          style={{
                            left: `${Math.min((metric.value / thresholds.poor) * 100, 100)}%`,
                            transform: 'translateX(-50%)',
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Good: {formatMetricValue(metric.name, thresholds.good)}</span>
                      <span>Poor: {formatMetricValue(metric.name, thresholds.poor)}</span>
                    </div>

                    <div className="text-xs text-neutral-500">
                      Rating: {metric.rating} • Delta: {metric.delta.toFixed(2)}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="p-4 border-t border-neutral-800">
            <div className="text-xs text-neutral-400">
              <div>LCP: Largest Contentful Paint</div>
              <div>FID: First Input Delay</div>
              <div>CLS: Cumulative Layout Shift</div>
              <div>FCP: First Contentful Paint</div>
              <div>TTFB: Time to First Byte</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PerformanceMonitor