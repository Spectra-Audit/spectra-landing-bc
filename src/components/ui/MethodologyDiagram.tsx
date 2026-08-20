import React from 'react'
import { getTranslations } from 'next-intl/server'
import { Code2, Users, Coins, Droplets, MessageSquare, Target } from 'lucide-react'
import MotionGate from './MotionGate'

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
 * Server Component: the translated labels are read via `getTranslations`.
 * The one genuinely client-only piece — skipping the SVG SMIL
 * <animateMotion> pulse under `prefers-reduced-motion` (a real `matchMedia`
 * read, unlike the CSS opacity pulse handled globally in globals.css) — is
 * extracted into the tiny `MotionGate` client island below, so this
 * component itself needs no browser APIs.
 */

export default async function MethodologyDiagram({
  className = '',
  ariaLabel
}: MethodologyDiagramProps) {
  const t = await getTranslations('methodology.diagram')
  // Prop overrides the translated label when provided (e.g. for a custom description).
  const resolvedAriaLabel = ariaLabel ?? t('ariaLabel')

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
      label: t('lanes.code'),
      Icon: Code2,
      color: 'rgb(0, 208, 132)', // spectra-green-500 #00D084
      colorClass: 'text-spectra-green-500',
      iconBg: 'bg-spectra-green-500/15'
    },
    {
      key: 'distribution',
      label: t('lanes.distribution'),
      Icon: Users,
      color: 'rgb(245, 158, 11)', // spectra-yellow-500 #F59E0B
      colorClass: 'text-spectra-yellow-500',
      iconBg: 'bg-spectra-yellow-500/15'
    },
    {
      key: 'tokenomics',
      label: t('lanes.tokenomics'),
      Icon: Coins,
      color: 'rgb(0, 153, 255)', // spectra azure #0099FF
      colorClass: 'text-spectra-blue-500',
      iconBg: 'bg-spectra-blue-500/15'
    },
    {
      key: 'liquidity',
      label: t('lanes.liquidity'),
      Icon: Droplets,
      color: 'rgb(99, 102, 241)', // spectra-purple-500 #6366F1
      colorClass: 'text-spectra-purple-500',
      iconBg: 'bg-spectra-purple-500/15'
    },
    {
      key: 'sentiment',
      label: t('lanes.sentiment'),
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
        aria-label={resolvedAriaLabel}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="method-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id="composite-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(0, 153, 255)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(0, 153, 255)" stopOpacity="0" />
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
              <MotionGate>
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
              </MotionGate>

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
            fill="rgb(0, 153, 255)"
            fillOpacity="0.15"
            stroke="rgb(0, 153, 255)"
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
            {t('compositeLine1')}
          </text>
          <text
            x={finalNodeX}
            y={finalNodeY + 72}
            textAnchor="middle"
            className="fill-neutral-500 dark:fill-neutral-400 text-[11px]"
            style={{ fontFamily: 'inherit' }}
          >
            {t('compositeLine2')}
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
          {t('subtitle')}
        </text>
      </svg>

      {/* Plain (non-styled-jsx) <style>: `style jsx` requires a Client
          Component boundary, which would undo the Server Component
          conversion above. These keyframe names are already unique in the
          codebase (grepped) and this component renders once per page, so a
          global <style> tag is safe — no scoping needed. */}
      <style>{`
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
