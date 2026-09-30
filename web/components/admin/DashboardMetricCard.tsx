import type { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  icon: LucideIcon
  index: number
}

export default function DashboardMetricCard({ label, value, icon: Icon, index }: Props) {
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm motion-safe:animate-jump-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-2xl font-bold text-black leading-none">{value}</p>
          <p className="text-sm text-gray-500 mt-1.5">{label}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-agric-green/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-agric-green" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
