import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics 4
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      })
    }

    // Custom analytics endpoint (if needed)
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          id: metric.id,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      }).catch((error) => {
        console.warn('Failed to send vitals to analytics:', error)
      })
    }

    // Console logging for development
    console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric)
  }
}

// Track Core Web Vitals
export function reportWebVitals() {
  onCLS(sendToAnalytics)
  onINP(sendToAnalytics)
  onFCP(sendToAnalytics)
  onLCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
}

// Performance budget thresholds
export const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint (2.5s)
  INP: 200,  // Interaction to Next Paint (200ms)
  CLS: 0.1,  // Cumulative Layout Shift (0.1)
  FCP: 1800, // First Contentful Paint (1.8s)
  TTFB: 800, // Time to First Byte (800ms)
}

// Check if metrics are within thresholds
export function checkPerformanceThresholds(metric: any): boolean {
  const threshold = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS]
  if (!threshold) return true

  const value = metric.name === 'CLS' ? metric.value : metric.value
  return value <= threshold
}

// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name) || []
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
  }

  getPercentileMetric(name: string, percentile: number = 95): number {
    const values = this.metrics.get(name) || []
    if (values.length === 0) return 0

    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[Math.max(0, index)]
  }

  getAllMetrics(): Record<string, { avg: number; p95: number; count: number }> {
    const result: Record<string, { avg: number; p95: number; count: number }> = {}

    this.metrics.forEach((values, name) => {
      result[name] = {
        avg: this.getAverageMetric(name),
        p95: this.getPercentileMetric(name, 95),
        count: values.length,
      }
    })

    return result
  }
}

// Custom performance marks
export function markPerformanceEvent(name: string) {
  if (typeof window !== 'undefined' && window.performance) {
    window.performance.mark(name)
  }
}

// Measure performance between marks
export function measurePerformanceEvent(name: string, startMark: string, endMark?: string) {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      window.performance.measure(name, startMark, endMark)
      const measure = window.performance.getEntriesByName(name, 'measure')[0]
      if (measure) {
        const monitor = PerformanceMonitor.getInstance()
        monitor.recordMetric(name, measure.duration)
        return measure.duration
      }
    } catch (error) {
      console.warn(`Failed to measure ${name}:`, error)
    }
  }
  return 0
}

// Observe element render performance
export function observeElementPerformance(element: Element, name: string) {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const startTime = performance.now()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const renderTime = performance.now() - startTime
            const monitor = PerformanceMonitor.getInstance()
            monitor.recordMetric(`${name}-render`, renderTime)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return observer
  }
  return null
}

// Export default for Next.js app
export default function setupWebVitals() {
  if (typeof window !== 'undefined') {
    reportWebVitals()
  }
}