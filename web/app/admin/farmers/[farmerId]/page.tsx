'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getAdminFarmerDetail } from '@/lib/api'
import type { AdminFarmerDetail } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import FarmIntelligenceCard from '@/components/farm/FarmIntelligenceCard'
import RecommendationCard from '@/components/farm/RecommendationCard'
import ProductionMetrics from '@/components/farm/ProductionMetrics'
import { ChevronLeft, User, MapPin, Wheat, Phone, Mail, Globe } from 'lucide-react'
import { formatAcres, formatCoordinate, challengeLabel, serviceTypeLabel, formatDate } from '@/lib/utils'

const FarmLocationMap = dynamic(
  () => import('@/components/map/FarmLocationMap'),
  { ssr: false, loading: () => <div className="h-[280px] rounded-xl bg-gray-100 flex items-center justify-center"><Spinner /></div> },
)

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 motion-safe:animate-slide-in-up">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</h2>
      {children}
    </section>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-black break-words">{value || <span className="text-gray-300">Not provided</span>}</p>
      </div>
    </div>
  )
}

function statusVariant(status: string): 'success' | 'warning' | 'default' {
  switch (status.toLowerCase()) {
    case 'completed': return 'success'
    case 'pending':   return 'warning'
    default:          return 'default'
  }
}

export default function AdminFarmerDetailPage() {
  const { farmerId } = useParams<{ farmerId: string }>()
  const router = useRouter()

  const [farmer, setFarmer] = useState<AdminFarmerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getAdminFarmerDetail(farmerId)
      .then(setFarmer)
      .catch(() => setError('Could not load farmer record.'))
      .finally(() => setLoading(false))
  }, [farmerId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !farmer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-gray-600">{error || 'Farmer not found.'}</p>
        <Link href="/admin/farmers" className="text-sm text-agric-green underline underline-offset-2">
          Back to farmers
        </Link>
      </div>
    )
  }

  const farm    = farmer.farms?.[0] ?? null
  const insight = farm?.farm_insight ?? null
  const reqs    = farm?.service_requests ?? []

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-10 motion-safe:animate-fade-in">

      {/* Back */}
      <button
        onClick={() => router.push('/admin/farmers')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors duration-150"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        Back to farmers
      </button>

      {/* ---- Section 1: Farmer profile ---- */}
      <Section title="Farmer profile">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-black">{farmer.full_name}</h1>
            <p className="font-mono text-sm text-gold mt-1">{farmer.farmer_id}</p>
          </div>
          <div className="border-t border-gray-100 pt-4 grid sm:grid-cols-2 gap-4">
            <InfoRow icon={MapPin}  label="County"             value={farmer.county} />
            <InfoRow icon={Phone}   label="Mobile"             value={farmer.mobile_number} />
            <InfoRow icon={Mail}    label="Email"              value={farmer.email} />
            <InfoRow icon={Globe}   label="Preferred language" value={farmer.preferred_language} />
          </div>
        </div>
      </Section>

      {/* ---- Section 2: Farm detail ---- */}
      {farm && (
        <Section title="Farm">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
            <div>
              <h2 className="font-display text-xl font-bold text-black">{farm.farm_name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />{farm.location}
                </span>
                <span className="flex items-center gap-1">
                  <Wheat className="w-3.5 h-3.5" aria-hidden="true" />{farm.primary_crop}
                </span>
                <span>{formatAcres(farm.size_acres)}</span>
              </div>
            </div>

            {farm.primary_crop?.toLowerCase() === 'coffee' && (
              <div className="border-t border-gray-100 pt-4 grid sm:grid-cols-2 gap-4 text-sm">
                {farm.coffee_varieties && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Varieties</p>
                    <p className="font-medium text-black">{farm.coffee_varieties}</p>
                  </div>
                )}
                {farm.coffee_tree_count && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Trees</p>
                    <p className="font-medium text-black">{farm.coffee_tree_count.toLocaleString()}</p>
                  </div>
                )}
                {farm.estimated_annual_production && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Annual production</p>
                    <p className="font-medium text-black">{Number(farm.estimated_annual_production).toLocaleString()} kg</p>
                  </div>
                )}
                {farm.last_harvest_date && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Last harvest</p>
                    <p className="font-medium text-black">{farm.last_harvest_date}</p>
                  </div>
                )}
              </div>
            )}

            {farm.challenges && farm.challenges.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 mb-2">Challenges</p>
                <div className="flex flex-wrap gap-2">
                  {farm.challenges.map((k) => (
                    <span key={k} className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                      {challengeLabel(k)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ---- Section 3: Farm location ---- */}
      {farm && (
        <Section title="Location">
          <div className="space-y-3">
            <FarmLocationMap
              latitude={farm.latitude}
              longitude={farm.longitude}
              label={farm.farm_name}
            />
            <p className="font-mono text-xs text-gold">
              {formatCoordinate(farm.latitude)}, {formatCoordinate(farm.longitude)}
            </p>
          </div>
        </Section>
      )}

      {/* ---- Section 4: Farm intelligence ---- */}
      {insight && (
        <Section title="Farm intelligence">
          <div className="space-y-4">
            <FarmIntelligenceCard insight={insight} />
            {farm && <ProductionMetrics farm={farm} />}
            {insight.recommendations.length > 0 && (
              <div className="space-y-3">
                {insight.recommendations.map((rec, i) => (
                  <RecommendationCard key={`${rec.category}-${i}`} recommendation={rec} index={i} />
                ))}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ---- Section 5: Service requests ---- */}
      <Section title="Service requests">
        {reqs.length === 0 ? (
          <p className="text-sm text-gray-400">No service requests submitted.</p>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reqs.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors duration-100">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-gold">{req.reference}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">{serviceTypeLabel(req.type)}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusVariant(req.status)} className="capitalize">{req.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right text-gray-400 hidden sm:table-cell">
                      {formatDate(req.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

    </div>
  )
}
