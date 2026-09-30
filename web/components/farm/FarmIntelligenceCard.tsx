import type { FarmInsight } from '@/lib/types'

interface Props {
  insight: FarmInsight
}

export default function FarmIntelligenceCard({ insight }: Props) {
  // Arc is a simple SVG circle progress ring
  const radius   = 52
  const stroke   = 8
  const circ     = 2 * Math.PI * radius
  const progress = circ - (insight.score / 100) * circ

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 motion-safe:animate-jump-in">
      <div className="flex flex-col items-center text-center gap-4">
        {/* Score ring */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            className="-rotate-90"
            aria-hidden="true"
          >
            {/* Track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={stroke}
            />
            {/* Progress */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#C9A84C"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={progress}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Score number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold text-black leading-none">
              {insight.score}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
          </div>
        </div>

        {/* Label + summary */}
        <div>
          <p className="font-display text-base font-semibold text-black">Farm Opportunity</p>
          <p className="text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">
            {insight.summary}
          </p>
        </div>
      </div>
    </div>
  )
}
