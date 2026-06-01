'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { TrendingUp, Shield, CheckCircle, Zap, Clock } from 'lucide-react'
import Card from './Card'
import { cn } from '@/lib/utils'

interface StatItem {
  value: string
  label: string
  description?: string
  prefix?: string
  suffix?: string
  icon: React.ReactNode
  delay: number
  trend?: 'up' | 'down'
  variant?: 'success' | 'info' | 'warning'
}

interface StatsBannerProps {
  className?: string
}

export function StatsBanner({ className }: StatsBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations('statsBanner')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Enhanced stats - solution-focused with Spectra brand colors
  const stats: StatItem[] = [
    {
      value: '20',
      suffix: 'min',
      label: 'Typical Audit Time',
      description: 'More than 2.4× faster than traditional manual audits',
      prefix: '≤',
      icon: <Zap className="w-5 h-5 text-spectra-green-500" />,
      delay: 0,
      trend: 'down',
      variant: 'success'
    },
    {
      value: '95',
      suffix: '%',
      label: 'Known Vulnerability Detection',
      description: 'AI-powered analysis of known exploit patterns',
      prefix: '',
      icon: <Shield className="w-5 h-5 text-spectra-blue-500" />,
      delay: 200,
      trend: 'up',
      variant: 'info'
    },
    {
      value: '5',
      suffix: '',
      label: 'Scoring Dimensions',
      description: 'Code, Distribution, Tokenomics, Liquidity, Sentiment',
      prefix: '',
      icon: <Clock className="w-5 h-5 text-spectra-purple-500" />,
      delay: 400,
      variant: 'info'
    }
  ]

  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case 'success':
        return {
          card: 'border-spectra-green-500/30 bg-spectra-green-500/5',
          iconBg: 'bg-spectra-green-500/20 border-spectra-green-500/40',
          value: 'text-spectra-green-500'
        }
      case 'info':
        return {
          card: 'border-spectra-blue-500/30 bg-spectra-blue-500/5',
          iconBg: 'bg-spectra-blue-500/20 border-spectra-blue-500/40',
          value: 'text-spectra-blue-500'
        }
      case 'warning':
        return {
          card: 'border-warning-primary/30 bg-warning-primary/5',
          iconBg: 'bg-warning-primary/20 border-warning-primary/40',
          value: 'text-warning-primary'
        }
      default:
        return {
          card: 'border-spectra-purple-500/30 bg-spectra-purple-500/5',
          iconBg: 'bg-spectra-purple-500/20 border-spectra-purple-500/40',
          value: 'text-spectra-purple-500'
        }
    }
  }

  return (
    <div className={cn(
      'bg-gradient-to-r from-spectra-blue-500/10 to-spectra-purple-500/10 border-b border-spectra-blue-500/20 relative overflow-hidden',
      className
    )}>
      {/* Background Pattern - Enhanced with Spectra gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.1),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header - Solution-focused messaging */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-spectra-green-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {t('header.title')}
            </h2>
          </div>
          <p className="text-neutral-300 max-w-3xl mx-auto text-base md:text-lg">
            {t('header.subtitle')}
          </p>
        </div>

        {/* Stats Grid - Enhanced design */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const variantClasses = getVariantClasses(stat.variant)

            return (
              <Card
                key={index}
                variant="stats"
                className={cn(
                  variantClasses.card,
                  "backdrop-blur-sm hover:shadow-lg hover:shadow-spectra-blue-500/10",
                  "transform transition-all duration-700",
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                )}
                style={{
                  transitionDelay: `${stat.delay}ms`
                }}
                hover={true}
              >
                <div className="text-center p-6">
                  <div className="flex justify-center mb-4">
                    <div className={cn(
                      "p-3 rounded-full border",
                      variantClasses.iconBg
                    )}>
                      {stat.icon}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-baseline justify-center gap-1">
                      {stat.prefix && (
                        <span className={cn(
                          "text-2xl md:text-3xl font-bold",
                          variantClasses.value
                        )}>
                          {stat.prefix}
                        </span>
                      )}
                      <span className={cn(
                        "text-2xl md:text-3xl font-bold text-white"
                      )}>
                        {stat.value}
                      </span>
                      {stat.suffix && (
                        <span className="text-lg md:text-xl font-semibold text-neutral-400">
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                    <p className="text-sm md:text-base font-medium text-white">
                      {stat.label}
                    </p>
                    {stat.description && (
                      <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                        {stat.description}
                      </p>
                    )}
                  </div>

                  {/* Trend indicator */}
                  {stat.trend && (
                    <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-neutral-700/50">
                      {stat.trend === 'down' ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-spectra-green-500 rotate-180" />
                          <span className="text-xs text-spectra-green-500 font-medium">Faster is better</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 text-spectra-green-500" />
                          <span className="text-xs text-spectra-green-500 font-medium">Industry leading</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Enhanced Source Attribution & CTA */}
        <div className="text-center mt-10 space-y-3">
          <p className="text-sm text-neutral-400">
            <span className="text-spectra-green-500 font-semibold">✓</span> Based on real audit data
            {' • '}
            <span className="text-spectra-blue-400 font-semibold">→</span> Ready to protect your smart contracts?
          </p>
          <p className="text-xs text-neutral-500">
            {t('footer')}
          </p>
        </div>
      </div>
    </div>
  )
}

export type { StatsBannerProps }
