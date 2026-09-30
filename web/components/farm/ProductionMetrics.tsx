import type { Farm } from '@/lib/types'
import { formatKg, productionPerTree } from '@/lib/utils'

interface Props {
  farm: Farm
}

export default function ProductionMetrics({ farm }: Props) {
  const isCoffee =
    farm.primary_crop?.toLowerCase() === 'coffee' &&
    (farm.estimated_annual_production || farm.coffee_tree_count)

  if (!isCoffee) return null

  const metrics: { label: string; value: string }[] = [
    {
      label: 'Estimated annual production',
      value: formatKg(farm.estimated_annual_production),
    },
    {
      label: 'Coffee trees',
      value: farm.coffee_tree_count
        ? farm.coffee_tree_count.toLocaleString()
        : 'Unknown',
    },
    {
      label: 'Estimated production per tree',
      value: productionPerTree(farm.estimated_annual_production, farm.coffee_tree_count),
    },
  ]

  return (
    <div className="motion-safe:animate-slide-in-up" style={{ animationDelay: '120ms' }}>
      <h3 className="font-display text-sm font-semibold text-black mb-3 tracking-wide uppercase">
        Production
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {metrics.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm"
          >
            <p className="font-display text-xl font-bold text-black leading-none">{value}</p>
            <p className="text-xs text-gray-500 mt-1.5 leading-snug">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
