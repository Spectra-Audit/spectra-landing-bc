'use client'

import React from 'react'
import { Search, ThumbsUp, BarChart3, Brain } from 'lucide-react'

export interface LearningLoopDiagramProps {
  className?: string
  ariaLabel?: string
}

/**
 * Circular animated SVG showing 4 nodes connected in a feedback loop:
 * Audit -> User Feedback -> Calibration -> Model Retraining -> Audit
 *
 * Animation respects `prefers-reduced-motion` (handled globally in globals.css).
 */
export default function LearningLoopDiagram({
  className = '',
  ariaLabel = 'Continuous improvement feedback loop: audits inform user feedback, which informs calibration, which retrains the model, which improves the next audit.'
}: LearningLoopDiagramProps) {
  const size = 400
  const center = size / 2
  const radius = 140

  // 4 nodes evenly distributed around the circle
  const nodes = [
    {
      key: 'audit',
      label: 'Audit',
      Icon: Search,
      color: 'text-spectra-blue-500',
      bg: 'fill-spectra-blue-500/15',
      stroke: 'stroke-spectra-blue-500/50',
      angle: -90 // Top
    },
    {
      key: 'feedback',
      label: 'User Feedback',
      Icon: ThumbsUp,
      color: 'text-spectra-green-500',
      bg: 'fill-spectra-green-500/15',
      stroke: 'stroke-spectra-green-500/50',
      angle: 0 // Right
    },
    {
      key: 'calibration',
      label: 'Calibration',
      Icon: BarChart3,
      color: 'text-spectra-purple-500',
      bg: 'fill-spectra-purple-500/15',
      stroke: 'stroke-spectra-purple-500/50',
      angle: 90 // Bottom
    },
    {
      key: 'retraining',
      label: 'Model Retraining',
      Icon: Brain,
      color: 'text-spectra-cyan-500',
      bg: 'fill-spectra-cyan-500/15',
      stroke: 'stroke-spectra-cyan-500/50',
      angle: 180 // Left
    }
  ]

  // Convert angle (degrees) to x/y on circle
  const toXY = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    }
  }

  const nodePoints = nodes.map((n) => ({ ...n, ...toXY(n.angle) }))

  return (
    <div className={`relative w-full max-w-[400px] mx-auto ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto"
        role="img"
        aria-label={ariaLabel}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Defs: gradient + animated dash */}
        <defs>
          <linearGradient id="loop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(0, 102, 255)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="rgb(168, 85, 247)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.6" />
          </linearGradient>

          <radialGradient id="loop-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(0, 102, 255)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="rgb(0, 102, 255)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Central glow */}
        <circle cx={center} cy={center} r={radius - 30} fill="url(#loop-center-glow)" />

        {/* Connecting circle (the loop itself) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#loop-grad)"
          strokeWidth="2"
          strokeDasharray="8 6"
          className="loop-rotate"
          style={{
            transformOrigin: `${center}px ${center}px`,
            animation: 'spectra-loop-rotate 12s linear infinite'
          }}
        />

        {/* Static guide circle (subtle) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth="1"
          className="text-neutral-400"
        />

        {/* Arrow markers between nodes — small directional triangles at 4 midpoints */}
        {nodePoints.map((node, i) => {
          const next = nodePoints[(i + 1) % nodePoints.length]
          // Midpoint angle for arrow
          const midAngle = (node.angle + (i === nodePoints.length - 1 ? node.angle + 90 : next.angle)) / 2
          // Handle wraparound for last node (180 -> -90 = wrap to 270)
          const startAngle = node.angle
          let endAngle = next.angle
          if (endAngle < startAngle) endAngle += 360
          const midAng = (startAngle + endAngle) / 2
          const { x: ax, y: ay } = toXY(midAng)
          // Direction of arrow (tangent — perpendicular to radius)
          const tangentAngle = midAng + 90
          return (
            <g key={`arrow-${i}`}>
              <polygon
                points="0,-6 10,0 0,6"
                fill="currentColor"
                className="text-spectra-blue-500/70"
                transform={`translate(${ax} ${ay}) rotate(${tangentAngle})`}
              />
            </g>
          )
        })}

        {/* Nodes */}
        {nodePoints.map((node) => {
          const NodeIcon = node.Icon
          return (
            <g key={node.key}>
              {/* Node background circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r="34"
                className={`${node.bg} ${node.stroke}`}
                strokeWidth="2"
              />
              {/* Icon (rendered as foreignObject for lucide-react) */}
              <foreignObject
                x={node.x - 16}
                y={node.y - 16}
                width="32"
                height="32"
                style={{ pointerEvents: 'none' }}
              >
                <div className={`flex items-center justify-center w-full h-full ${node.color}`}>
                  <NodeIcon className="w-6 h-6" strokeWidth={2} />
                </div>
              </foreignObject>
              {/* Label */}
              <text
                x={node.x}
                y={node.y + 56}
                textAnchor="middle"
                className="fill-neutral-700 dark:fill-neutral-200 text-[12px] font-semibold"
                style={{ fontFamily: 'inherit' }}
              >
                {node.label}
              </text>
            </g>
          )
        })}

        {/* Center label */}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          className="fill-neutral-900 dark:fill-white text-[14px] font-bold"
          style={{ fontFamily: 'inherit' }}
        >
          Continuous
        </text>
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          className="fill-neutral-500 dark:fill-neutral-400 text-[11px]"
          style={{ fontFamily: 'inherit' }}
        >
          Learning Loop
        </text>
      </svg>

      {/* Local keyframes (scoped via style tag is acceptable for this single use) */}
      <style jsx>{`
        @keyframes spectra-loop-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.loop-rotate) {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
