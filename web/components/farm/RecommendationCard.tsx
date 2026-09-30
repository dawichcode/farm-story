import type { Recommendation } from '@/lib/types'

interface Props {
  recommendation: Recommendation
  index: number
}

export default function RecommendationCard({ recommendation, index }: Props) {
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 motion-safe:animate-jump-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <p className="text-xs font-semibold tracking-widest text-agric-green uppercase mb-2">
        {recommendation.category}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">
        {recommendation.text}
      </p>
    </div>
  )
}
