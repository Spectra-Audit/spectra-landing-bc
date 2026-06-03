'use client'

import React, { useSyncExternalStore } from 'react'
import { Code2, Users, Coins, Droplets, MessageSquare, Target } from 'lucide-react'

export interface MethodologyDiagramProps {
  className?: string
  ariaLabel?: string
}

/**
 * Animated SVG of the parallel audit pipeline:
 * 5 lanes (Code, Distribution, Tokenomics, Liquidity, Sentiment) converge
 * into a single "Composite Score" node. Each lane has pulsing dots flowing
 * left-to-right to convey parallel processing.
 *
 * Animation respects `prefers-reduced-motion`:
 * - CSS opacity pulse: handled globally in globals.css (animation-duration override).
 * - SVG SMIL <animateMotion>: NOT affected by CSS overrides, so we conditionally
 *   skip rendering the dots via the useSyncExternalStore hook below.
 */

// ---------------------------------------------------------------------------
// Module-level store for prefers-reduced-motion
// ---------------------------------------------------------------------------

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  // Modern browsers
  if (mq.addEventListener) {
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }
  // Legacy fallback
  mq.addListener(cb)
  return () => mq.removeListener(cb)
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getServerSnapshot(): boolean {
  return false
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MethodologyDiagram({
  className = '',
  ariaLabel = 'Parallel audit pipeline: five independent analyzers — Code, Distribution, Tokenomics, Liquidity, and Sentiment — run concurrently and converge into a single composite security score.'
}: MethodologyDiagramProps) {
  // Hydration-safe: server renders false, client adopts real matchMedia value after hydration.
  const prefersReducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const width = 520
  const height = 360
  const startX = 20
  const boxWidth = 132 // wide enough for the longest label ("Distribution")
  const laneStartX = startX + boxWidth // where the lane connector lines begin
  const laneHeight = 56
  const lanesTop = 30

  const lanes = [
    {
      key: 'code',
      label: 'Code',
      Icon: Code2,
      color: 'rgb(34, 197, 94)', // green
      colorClass: 'text-spectra-green-500',
      iconBg: 'bg-spectra-green-500/15'
    },
    {
      key: 'distribution',
      label: 'Distribution',
      Icon: Users,
      color: 'rgb(234, 179, 8)', // yellow
      colorClass: 'text-spectra-yellow-500',
      iconBg: 'bg-spectra-yellow-500/15'
    },
    {
      key: 'tokenomics',
      label: 'Tokenomics',
      Icon: Coins,
      color: 'rgb(0, 102, 255)', // blue
      colorClass: 'text-spectra-blue-500',
      iconBg: 'bg-spectra-blue-500/15'
    },
    {
      key: 'liquidity',
      label: 'Liquidity',
      Icon: Droplets,
      color: 'rgb(168, 85, 247)', // purple
      colorClass: 'text-spectra-purple-500',
      iconBg: 'bg-spectra-purple-500/15'
    },
    {
      key: 'sentiment',
      label: 'Sentiment',
      Icon: MessageSquare,
      color: 'rgb(6, 182, 212)', // cyan
      colorClass: 'text-spectra-cyan-500',
      iconBg: 'bg-spectra-cyan-500/15'
    }
  ]

  const convergeY = lanesTop + (lanes.length * laneHeight) / 2
  const finalNodeX = width - 68 // keep the node + its 50px glow inside the viewBox
  const finalNodeY = convergeY
  const convergeX = finalNodeX - 34 // lanes meet the left edge of the composite node

  return (
    <div className={`relative w-full max-w-[500px] mx-auto ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={ariaLabel}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="method-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id="composite-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(0, 102, 255)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(0, 102, 255)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Lanes */}
        {lanes.map((lane, i) => {
          const y = lanesTop + i * laneHeight + laneHeight / 2
          const LaneIcon = lane.Icon
          const lanePath = `M ${laneStartX} ${y} L ${convergeX - 40} ${y} Q ${convergeX - 12} ${y}, ${convergeX} ${convergeY}`
          return (
            <g key={lane.key}>
              {/* Lane connector to converge point — curve */}
              <path
                d={lanePath}
                fill="none"
                stroke={lane.color}
                strokeOpacity="0.4"
                strokeWidth="2"
              />

              {/* Pulsing dot animation along the lane — skipped when reduced motion is preferred */}
              {!prefersReducedMotion && (
                <circle
                  r="4"
                  fill={lane.color}
                  style={{
                    animation: `methodology-pulse-${i} 3s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`
                  }}
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${i * 0.4}s`}
                    path={lanePath}
                  />
                </circle>
              )}

              {/* Lane label node (left side) */}
              <g>
                <rect
                  x={startX}
                  y={y - 18}
                  width={boxWidth}
                  height="36"
                  rx="10"
                  fill={lane.color}
                  fillOpacity="0.12"
                  stroke={lane.color}
                  strokeOpacity="0.4"
                  strokeWidth="1.5"
                />
                <foreignObject
                  x={startX + 8}
                  y={y - 12}
                  width="24"
                  height="24"
                  style={{ pointerEvents: 'none' }}
                >
                  <div className={`flex items-center justify-center w-full h-full ${lane.colorClass}`}>
                    <LaneIcon className="w-5 h-5" strokeWidth={2} />
                  </div>
                </foreignObject>
                <text
                  x={startX + 38}
                  y={y + 4}
                  className="fill-neutral-700 dark:fill-neutral-200 text-[12px] font-semibold"
                  style={{ fontFamily: 'inherit' }}
                >
                  {lane.label}
                </text>
              </g>
            </g>
          )
        })}

        {/* Composite Score final node */}
        <g>
          {/* Glow */}
          <circle cx={finalNodeX} cy={finalNodeY} r="50" fill="url(#composite-glow)" />
          {/* Node */}
          <circle
            cx={finalNodeX}
            cy={finalNodeY}
            r="34"
            fill="rgb(0, 102, 255)"
            fillOpacity="0.15"
            stroke="rgb(0, 102, 255)"
            strokeOpacity="0.6"
            strokeWidth="2"
          />
          <foreignObject
            x={finalNodeX - 14}
            y={finalNodeY - 14}
            width="28"
            height="28"
            style={{ pointerEvents: 'none' }}
          >
            <div className="flex items-center justify-center w-full h-full text-spectra-blue-500">
              <Target className="w-6 h-6" strokeWidth={2} />
            </div>
          </foreignObject>
          {/* Label */}
          <text
            x={finalNodeX}
            y={finalNodeY + 58}
            textAnchor="middle"
            className="fill-neutral-900 dark:fill-white text-[12px] font-bold"
            style={{ fontFamily: 'inherit' }}
          >
            Composite
          </text>
          <text
            x={finalNodeX}
            y={finalNodeY + 72}
            textAnchor="middle"
            className="fill-neutral-500 dark:fill-neutral-400 text-[11px]"
            style={{ fontFamily: 'inherit' }}
          >
            Score
          </text>
        </g>

        {/* Subtitle text at bottom */}
        <text
          x={width / 2}
          y={height - 6}
          textAnchor="middle"
          className="fill-neutral-500 dark:fill-neutral-400 text-[10px] italic"
          style={{ fontFamily: 'inherit' }}
        >
          5 analyzers running in parallel → weighted composite
        </text>
      </svg>

      <style jsx>{`
        @keyframes methodology-pulse-0 {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes methodology-pulse-1 {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes methodology-pulse-2 {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes methodology-pulse-3 {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes methodology-pulse-4 {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
