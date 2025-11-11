'use client'

import React, { useEffect, useState } from 'react'
import { TrendingUp, AlertTriangle, Shield } from 'lucide-react'
import Card from './Card'
import { cn } from '@/lib/utils'

interface StatItem {
  value: string
  label: string
  prefix?: string
  icon: React.ReactNode
  delay: number
}

interface StatsBannerProps {
  className?: string
}

export function StatsBanner({ className }: StatsBannerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const stats: StatItem[] = [
    {
      value: '4.88 million',
      label: 'Average cost of a single data breach',
      prefix: '$',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      delay: 0
    },
    {
      value: '10.5 trillion',
      label: 'Expected cybercrime cost in 2025',
      prefix: '$',
      icon: <TrendingUp className="w-5 h-5 text-red-400" />,
      delay: 200
    },
    {
      value: '15.63 trillion',
      label: 'Expected cybercrime cost in 2029',
      prefix: '$',
      icon: <TrendingUp className="w-5 h-5 text-security-red" />,
      delay: 400
    }
  ]

  return (
    <div className={cn(
      'bg-gradient-to-r from-red-900/20 to-orange-900/20 border-b border-red-800/30 relative overflow-hidden',
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.1),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              The Rising Cost of Cybercrime
            </h2>
          </div>
          <p className="text-neutral-300 max-w-3xl mx-auto">
            Security breaches are becoming more frequent and expensive. Protect your assets before it's too late.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <Card
              key={index}
              variant="glass"
              className={cn(
                "border-red-800/30 bg-red-950/20 backdrop-blur-sm",
                "transform transition-all duration-700",
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              )}
              style={{
                transitionDelay: `${stat.delay}ms`
              }}
            >
              <div className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-red-900/30 border border-red-800/50">
                    {stat.icon}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1">
                    {stat.prefix && (
                      <span className="text-2xl md:text-3xl font-bold text-red-400">
                        {stat.prefix}
                      </span>
                    )}
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Source Attribution */}
        <div className="text-center mt-8">
          <p className="text-xs text-neutral-500 italic">
            *Data collected from IBM's Data Breach Report 2025 & Statista's Annual cost of cybercrime worldwide 2018-2029
          </p>
        </div>
      </div>
    </div>
  )
}

export type { StatsBannerProps }