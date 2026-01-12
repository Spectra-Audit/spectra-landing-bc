'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Award, Shield, TrendingUp, BarChart3, Zap, Globe, DollarSign, Code2, Layers, Hexagon } from 'lucide-react'

export interface CustomerLogosProps {
  title?: string
  className?: string
}

// Placeholder logo configurations - in production, replace with actual logo images
const customerLogos = [
  { name: 'Uniswap', icon: Award, color: 'text-pink-500' },
  { name: 'Aave', icon: Shield, color: 'text-spectra-purple-500' },
  { name: 'Curve', icon: TrendingUp, color: 'text-spectra-blue-500' },
  { name: 'Compound', icon: BarChart3, color: 'text-spectra-green-500' },
  { name: 'SushiSwap', icon: Zap, color: 'text-yellow-400' },
  { name: 'MakerDAO', icon: Globe, color: 'text-cyan-400' },
  { name: 'Yearn', icon: DollarSign, color: 'text-blue-400' },
  { name: 'Lido', icon: Layers, color: 'text-spectra-purple-400' },
  { name: 'Balancer', icon: Hexagon, color: 'text-white' },
  { name: '1inch', icon: Code2, color: 'text-spectra-blue-400' }
]

export function CustomerLogos({ title, className = "" }: CustomerLogosProps) {
  const t = useTranslations()

  return (
    <div className={`w-full py-12 sm:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm uppercase tracking-wider font-medium mb-8 sm:mb-12">
          {title || t('customerLogos.title')}
        </p>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          {customerLogos.map((customer) => {
            const IconComponent = customer.icon
            return (
              <div
                key={customer.name}
                className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl bg-white dark:bg-neutral-800/30 border border-neutral-200 dark:border-neutral-700/50 hover:border-spectra-blue-300 dark:hover:border-neutral-600 hover:bg-spectra-blue-50 dark:hover:bg-neutral-800/50 transition-all duration-300 group cursor-pointer"
              >
                <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${customer.color} group-hover:scale-110 transition-transform duration-300`} />
                <span className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-400 group-hover:text-spectra-blue-700 dark:group-hover:text-white transition-colors">
                  {customer.name}
                </span>
              </div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10 sm:mt-12">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-500">
            <div className="w-2 h-2 bg-spectra-green-500 rounded-full animate-pulse" />
            <span>{t('customerLogos.liveAudits')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-500">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-spectra-blue-500" />
            <span>{t('customerLogos.enterpriseSecurity')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-500">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-spectra-purple-500" />
            <span>{t('customerLogos.protected')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
