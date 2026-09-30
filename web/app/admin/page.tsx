'use client'

import { useEffect, useState } from 'react'
import { getAdminDashboard } from '@/lib/api'
import type { AdminDashboardData } from '@/lib/types'
import DashboardMetricCard from '@/components/admin/DashboardMetricCard'
import Spinner from '@/components/ui/Spinner'
import { Users, Layers, Wheat, ClipboardList } from 'lucide-react'

const METRICS = [
  { key: 'farmers_count',    label: 'Farmers onboarded',      icon: Users },
  { key: 'acres_total',      label: 'Acres registered',        icon: Layers },
  { key: 'production_total', label: 'Estimated production (kg)', icon: Wheat },
  { key: 'requests_count',   label: 'Service requests',        icon: ClipboardList },
] as const

function formatMetricValue(key: typeof METRICS[number]['key'], data: AdminDashboardData): string {
  const val = data[key]
  if (key === 'acres_total')      return Number(val).toLocaleString(undefined, { maximumFractionDigits: 1 })
  if (key === 'production_total') return Number(val).toLocaleString() + ' kg'
  return Number(val).toLocaleString()
}

export default function AdminDashboardPage() {
  const [data, setData]       = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch(() => setError('Could not load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-8 motion-safe:animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview</p>
      </div>

      {loading && (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      )}

      {error && !loading && (
        <div role="alert" className="rounded-lg border border-crimson/30 bg-red-50 px-4 py-3 text-sm text-crimson">
          {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* Metric cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {METRICS.map(({ key, label, icon }, i) => (
              <DashboardMetricCard
                key={key}
                label={label}
                value={formatMetricValue(key, data)}
                icon={icon}
                index={i}
              />
            ))}
          </div>

          {/* County distribution */}
          {data.farmers_by_county.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden motion-safe:animate-slide-in-up">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-display text-sm font-semibold text-black">Farmers by county</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">County</th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Farmers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.farmers_by_county.map(({ county, total }) => (
                    <tr key={county} className="hover:bg-gray-50 transition-colors duration-100">
                      <td className="px-5 py-3 text-gray-700">{county}</td>
                      <td className="px-5 py-3 text-right font-medium text-black">{total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
