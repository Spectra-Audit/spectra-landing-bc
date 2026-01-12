'use client'

import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react'
import { ProtocolLogo } from '@/components/ui'

interface Protocol {
  name: string
  symbol: string
  price: number
  change24h: number
  tvl: string
  category: string
  securityGrade: 'A' | 'B' | 'C' | 'D'
  verified: boolean
}

const mockProtocols: Protocol[] = [
  {
    name: 'Uniswap',
    symbol: 'UNI',
    price: 8.47,
    change24h: 5.2,
    tvl: '$4.2B',
    category: 'DEX',
    securityGrade: 'A',
    verified: true
  },
  {
    name: 'Aave',
    symbol: 'AAVE',
    price: 95.23,
    change24h: -2.1,
    tvl: '$3.8B',
    category: 'Lending',
    securityGrade: 'A',
    verified: true
  },
  {
    name: 'Compound',
    symbol: 'COMP',
    price: 42.18,
    change24h: 1.8,
    tvl: '$1.9B',
    category: 'Lending',
    securityGrade: 'B',
    verified: true
  },
  {
    name: 'Curve',
    symbol: 'CRV',
    price: 0.87,
    change24h: -3.4,
    tvl: '$1.2B',
    category: 'DEX',
    securityGrade: 'A',
    verified: true
  },
  {
    name: 'SushiSwap',
    symbol: 'SUSHI',
    price: 1.23,
    change24h: 8.7,
    tvl: '$0.8B',
    category: 'DEX',
    securityGrade: 'B',
    verified: false
  },
  {
    name: 'Balancer',
    symbol: 'BAL',
    price: 5.67,
    change24h: 0.5,
    tvl: '$0.6B',
    category: 'DEX',
    securityGrade: 'A',
    verified: true
  }
]

export default function TrendingProtocols() {
  const [protocols, setProtocols] = useState<Protocol[]>(mockProtocols)
  const [isPaused, setIsPaused] = useState(false)

  // Simulate real-time price updates
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setProtocols(prev => prev.map(protocol => ({
        ...protocol,
        price: protocol.price * (1 + (Math.random() - 0.5) * 0.001), // Small random change
        change24h: protocol.change24h + (Math.random() - 0.5) * 0.1
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused])

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-400" />
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-400" />
    return <Minus className="w-3 h-3 text-gray-400" />
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'B': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'C': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'D': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  return (
    <div className="w-full py-3 px-4 bg-gradient-to-r from-neutral-900/90 via-neutral-800/90 to-neutral-900/90 backdrop-blur-md border-y border-neutral-700/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-medium text-white">Trending Protocols</h3>
            <span className="text-xs text-neutral-400">Real-time monitoring</span>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>

        {/* Scrolling Protocols */}
        <div className="relative overflow-hidden">
          <div
            className={`flex gap-4 overflow-x-auto scrollbar-hide ${isPaused ? '' : 'scroll-smooth'}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {protocols.map((protocol, index) => (
              <div
                key={`${protocol.symbol}-${index}`}
                className="flex-shrink-0 bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-3 hover:bg-neutral-800/70 transition-all duration-200 hover:border-neutral-600/50 min-w-[200px]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ProtocolLogo
                      name={protocol.name}
                      symbol={protocol.symbol}
                      size="sm"
                      verified={protocol.verified}
                    />
                    <div>
                      <div className="text-sm font-medium text-white">{protocol.name}</div>
                      <div className="text-xs text-neutral-400">{protocol.category}</div>
                    </div>
                  </div>
                  {protocol.verified && (
                    <div className="w-4 h-4 bg-green-400/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Price</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-white">${protocol.price.toFixed(2)}</span>
                      {getTrendIcon(protocol.change24h)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">24h</span>
                    <span className={`text-xs font-medium ${
                      protocol.change24h > 0 ? 'text-green-400' :
                      protocol.change24h < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {protocol.change24h > 0 ? '+' : ''}{protocol.change24h.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">TVL</span>
                    <span className="text-xs font-medium text-white">{protocol.tvl}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Security</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${getGradeColor(protocol.securityGrade)}`}>
                      {protocol.securityGrade}
                    </span>
                  </div>
                </div>

                <button className="mt-2 w-full flex items-center justify-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Audit Report
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-2">
          <div className="w-16 h-1 bg-neutral-700 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-blue-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}