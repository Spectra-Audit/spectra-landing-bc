'use client'

import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export interface DimensionsGridItem {
  id: number
  name: string
  description: string
  details: string[]
  weight: number
  color: string
  bgLight: string
  text: string
  border: string
  /** Pre-rendered by the server parent (e.g. `<Icon className="w-8 h-8 text-..." />`) —
   *  a component *type* like a lucide-react icon isn't serializable across the
   *  RSC boundary, but an already-rendered React element is. */
  icon: React.ReactNode
}

export interface DimensionsGridProps {
  dimensions: DimensionsGridItem[]
}

/**
 * The whitepaper's "5 Dimensions" card grid, with hover-to-highlight state
 * (border/scale/shadow change on `onMouseEnter`/`onMouseLeave`). This is the
 * one interactive piece of the whitepaper's dimensions section — extracted
 * as a single island (not per-card) so the rest of that section (score
 * display, connecting-lines visualization, weights summary bar) stays
 * server-rendered.
 */
export default function DimensionsGrid({ dimensions }: DimensionsGridProps) {
  const [hoveredDimension, setHoveredDimension] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dimensions.map((dimension) => {
        const isHovered = hoveredDimension === dimension.id

        return (
          <div
            key={dimension.id}
            className={`
              glass-spectra rounded-2xl p-6 border transition-all duration-300 relative
              dark:bg-neutral-800/80 bg-white/80
              ${isHovered
                ? `${dimension.border} scale-105 shadow-xl dark:shadow-${dimension.color}-500/20`
                : 'border-neutral-200 dark:border-neutral-700/50'
              }
            `}
            onMouseEnter={() => setHoveredDimension(dimension.id)}
            onMouseLeave={() => setHoveredDimension(null)}
          >
            {/* Header */}
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`
                  inline-flex p-4 rounded-xl transition-all duration-300
                  ${dimension.bgLight} dark:${dimension.bgLight}
                  ${isHovered ? 'scale-105' : ''}
                `}>
                  {dimension.icon}
                </div>
                <div className="text-right">
                  <div className={`
                    text-2xl font-bold transition-all duration-300
                    ${dimension.text}
                    ${isHovered ? 'scale-105' : ''}
                  `}>
                    {dimension.weight}%
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Weight</div>
                </div>
              </div>

              {/* Title */}
              <h3 className={`
                text-xl font-bold mb-3
                text-neutral-900 dark:text-white
                ${dimension.text}
              `}>
                {dimension.name}
              </h3>

              {/* Description */}
              <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4 leading-relaxed">
                {dimension.description}
              </p>

              {/* Metrics */}
              <div className="space-y-2">
                {dimension.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <CheckCircle className={`w-3.5 h-3.5 ${dimension.text} flex-shrink-0`} />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
