'use client'

import { useEffect, useRef, useState } from 'react'
import type { FarmInsight } from '@/lib/types'

interface Props {
  insight: FarmInsight
  /** Set false to skip the count-up animation (e.g. in print views). Default: true. */
  animate?: boolean
}

export default function FarmIntelligenceCard({ insight, animate = true }: Props) {
  const radius = 58
  const stroke = 9
  const circ   = 2 * Math.PI * radius

  // displayScore drives both the SVG ring and the number counter.
  const [displayScore, setDisplayScore] = useState(animate ? 0 : insight.score)
  const [pulsing, setPulsing]           = useState(animate)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!animate) return

    const target    = insight.score
    const duration  = 800  // ms
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease-out: t = 1 - (1 - progress)^3
      const eased    = 1 - Math.pow(1 - progress, 3)
      const current  = Math.round(eased * target)

      setDisplayScore(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplayScore(target)
        setPulsing(false)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [animate, insight.score])

  const offset = circ - (displayScore / 100) * circ

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 motion-safe:animate-jump-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 gap-4 text-center sm:text-left">

        {/* Score ring */}
        <div className="flex-shrink-0 flex justify-center">
          <div
            className={[
              'relative w-36 h-36 flex items-center justify-center',
              pulsing ? 'motion-safe:animate-score-pulse' : '',
            ].join(' ')}
          >
          <svg
            width="144"
            height="144"
            viewBox="0 0 144 144"
            className="-rotate-90"
            aria-hidden="true"
          >
            <circle cx="72" cy="72" r={radius} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
            <circle cx="72" cy="72" r={radius} fill="none" stroke="#C9A84C" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center" aria-live="polite" aria-atomic="true">
            <span className="font-display text-4xl font-bold text-black leading-none">{displayScore}</span>
            <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
          </div>
        </div>
        </div>{/* end ring wrapper */}

        {/* Label + summary */}
        <div className="flex-1">
          <p className="font-display text-lg font-semibold text-black">Farm Opportunity</p>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-xs">
            {insight.summary}
          </p>
        </div>
      </div>
    </div>
  )
}
