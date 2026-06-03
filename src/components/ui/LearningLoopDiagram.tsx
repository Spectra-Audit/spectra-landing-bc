'use client'

import React from 'react'
import { Search, ThumbsUp, BarChart3, Brain } from 'lucide-react'

export interface LearningLoopDiagramProps {
  className?: string
  ariaLabel?: string
}

type Pt = { x: number; y: number }

/**
 * Shield-shaped animated SVG echoing the Spectra logo. Four nodes sit at the
 * corners of the shield, connected in a continuous feedback loop:
 * Audit -> User Feedback -> Calibration -> Model Retraining -> Audit
 *
 * The "circuit" is the shield outline itself; energy flows along the edge via
 * an animated stroke-dashoffset, so the shield stays put rather than spinning.
 * Animation respects `prefers-reduced-motion` (handled here and globally).
 */
export default function LearningLoopDiagram({
  className = '',
  ariaLabel = 'Continuous improvement feedback loop shaped like a shield: audits inform user feedback, which informs calibration, which retrains the model, which improves the next audit.'
}: LearningLoopDiagramProps) {
  const size = 400

  // --- Shield silhouette (matches the Spectra logo) -----------------------
  // Widest across the shoulders, tapering to a point at the bottom. A node
  // sits at each of the four corners; the bottom point is the shield tip.
  const audit: Pt = { x: 118, y: 126 } // top-left corner
  const feedback: Pt = { x: 282, y: 126 } // top-right corner
  const calibration: Pt = { x: 282, y: 228 } // lower-right corner (waist)
  const retraining: Pt = { x: 118, y: 228 } // lower-left corner (waist)
  const tip: Pt = { x: 200, y: 348 } // bottom point

  // Five quadratic segments traced clockwise from the top-left corner.
  // Vertical-ish sides in the upper body, tapering to a rounded point —
  // the silhouette of the Spectra logo shield. Each entry is [from, control, to].
  const segs: [Pt, Pt, Pt][] = [
    [audit, { x: 200, y: 110 }, feedback], // flat top (gently rounded)
    [feedback, { x: 290, y: 177 }, calibration], // right side
    [calibration, { x: 274, y: 300 }, tip], // taper to point (right)
    [tip, { x: 126, y: 300 }, retraining], // taper from point (left)
    [retraining, { x: 110, y: 177 }, audit] // left side
  ]

  const shieldPath =
    `M ${audit.x} ${audit.y} ` +
    segs.map(([, c, to]) => `Q ${c.x} ${c.y} ${to.x} ${to.y}`).join(' ') +
    ' Z'

  // Midpoint & tangent of a quadratic at t=0.5. The tangent direction at the
  // midpoint of a quadratic Bézier equals the chord direction (P2 - P0).
  const segArrow = ([p0, p1, p2]: [Pt, Pt, Pt]) => ({
    x: 0.25 * p0.x + 0.5 * p1.x + 0.25 * p2.x,
    y: 0.25 * p0.y + 0.5 * p1.y + 0.25 * p2.y,
    angle: (Math.atan2(p2.y - p0.y, p2.x - p0.x) * 180) / Math.PI
  })

  // One directional arrow per loop transition (clockwise). The bottom
  // transition (Calibration -> Model Retraining) is drawn at the tip.
  const arrows = [
    segArrow(segs[0]), // Audit -> Feedback (top)
    segArrow(segs[1]), // Feedback -> Calibration (right)
    { x: tip.x, y: tip.y - 6, angle: 180 }, // Calibration -> Retraining (tip)
    segArrow(segs[4]) // Retraining -> Audit (left)
  ]

  const nodes = [
    {
      ...audit,
      key: 'audit',
      label: 'Audit',
      Icon: Search,
      color: 'text-spectra-blue-500',
      bg: 'fill-spectra-blue-500/15',
      stroke: 'stroke-spectra-blue-500/50',
      labelDy: -50
    },
    {
      ...feedback,
      key: 'feedback',
      label: 'User Feedback',
      Icon: ThumbsUp,
      color: 'text-spectra-green-500',
      bg: 'fill-spectra-green-500/15',
      stroke: 'stroke-spectra-green-500/50',
      labelDy: -50
    },
    {
      ...calibration,
      key: 'calibration',
      label: 'Calibration',
      Icon: BarChart3,
      color: 'text-spectra-purple-500',
      bg: 'fill-spectra-purple-500/15',
      stroke: 'stroke-spectra-purple-500/50',
      labelDy: 56
    },
    {
      ...retraining,
      key: 'retraining',
      label: 'Model Retraining',
      Icon: Brain,
      color: 'text-spectra-cyan-500',
      bg: 'fill-spectra-cyan-500/15',
      stroke: 'stroke-spectra-cyan-500/50',
      labelDy: 56
    }
  ]

  return (
    <div className={`relative w-full max-w-[400px] mx-auto ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto"
        role="img"
        aria-label={ariaLabel}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Defs: edge gradient + inner glow */}
        <defs>
          <linearGradient id="loop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(0, 102, 255)" stopOpacity="0.75" />
            <stop offset="50%" stopColor="rgb(99, 102, 241)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="rgb(0, 208, 132)" stopOpacity="0.75" />
          </linearGradient>

          <radialGradient id="loop-center-glow" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="rgb(0, 102, 255)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="rgb(0, 102, 255)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Inner shield glow */}
        <path d={shieldPath} fill="url(#loop-center-glow)" />

        {/* Static guide outline (subtle) */}
        <path
          d={shieldPath}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth="1"
          className="text-neutral-400"
        />

        {/* Animated circuit — flowing dashes along the shield edge */}
        <path
          d={shieldPath}
          fill="none"
          stroke="url(#loop-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="9 7"
          className="loop-circuit"
        />

        {/* Directional flow arrows (one per loop transition) */}
        {arrows.map((a, i) => (
          <polygon
            key={`arrow-${i}`}
            points="0,-5 9,0 0,5"
            fill="currentColor"
            className="text-spectra-blue-500/70"
            transform={`translate(${a.x} ${a.y}) rotate(${a.angle})`}
          />
        ))}

        {/* Nodes at each corner of the shield */}
        {nodes.map((node) => {
          const NodeIcon = node.Icon
          return (
            <g key={node.key}>
              {/* Node background circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r="32"
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
                y={node.y + node.labelDy}
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
          x={200}
          y={172}
          textAnchor="middle"
          className="fill-neutral-900 dark:fill-white text-[14px] font-bold"
          style={{ fontFamily: 'inherit' }}
        >
          Continuous
        </text>
        <text
          x={200}
          y={190}
          textAnchor="middle"
          className="fill-neutral-500 dark:fill-neutral-400 text-[11px]"
          style={{ fontFamily: 'inherit' }}
        >
          Learning Loop
        </text>
      </svg>

      {/* Local keyframes. Defining AND referencing the animation inside the
          same styled-jsx block keeps the scoped keyframe name in sync (an
          inline `style` animation would reference the un-scoped name). */}
      <style jsx>{`
        .loop-circuit {
          animation: spectra-circuit-flow 1.1s linear infinite;
        }
        @keyframes spectra-circuit-flow {
          to {
            stroke-dashoffset: -16;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .loop-circuit {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
