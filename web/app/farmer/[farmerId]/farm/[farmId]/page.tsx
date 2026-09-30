'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getFarmById, getFarmInsight, ApiError } from '@/lib/api'
import { useFarmerStore } from '@/store/useFarmerStore'
import type { Farm, FarmInsight } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'
import FarmIntelligenceCard from '@/components/farm/FarmIntelligenceCard'
import RecommendationCard from '@/components/farm/RecommendationCard'
import ProductionMetrics from '@/components/farm/ProductionMetrics'
import TakeActionPanel from '@/components/farm/TakeActionPanel'
import { Sprout, MapPin, Wheat, ChevronLeft } from 'lucide-react'
import { formatAcres, formatCoordinate, challengeLabel } from '@/lib/utils'

export default function FarmDetailPage() {
  const { farmerId, farmId } = useParams<{ farmerId: string; farmId: string }>()
  const router = useRouter()
  const { farmerPublicId } = useFarmerStore()

  const [farm, setFarm]       = useState<Farm | null>(null)
  const [insight, setInsight] = useState<FarmInsight | null>(null)
  const [loadingFarm, setLoadingFarm]       = useState(true)
  const [loadingInsight, setLoadingInsight] = useState(true)
  const [farmError, setFarmError]           = useState('')
  const [insightError, setInsightError]     = useState('')

  // Load farm data
  useEffect(() => {
    async function loadFarm() {
      try {
        const data = await getFarmById(farmId)
        setFarm(data)
      } catch (err) {
        setFarmError(
          err instanceof ApiError && err.status === 404
            ? 'Farm not found.'
            : 'Could not load farm data.',
        )
      } finally {
        setLoadingFarm(false)
      }
    }
    loadFarm()
  }, [farmId])

  // Load insight independently so the farm data shows immediately
  useEffect(() => {
    async function loadInsight() {
      try {
        const data = await getFarmInsight(farmId)
        setInsight(data)
      } catch {
        setInsightError('Could not load farm intelligence.')
      } finally {
        setLoadingInsight(false)
      }
    }
    loadInsight()
  }, [farmId])

  if (loadingFarm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (farmError || !farm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center gap-4">
        <p className="text-gray-600">{farmError || 'Farm not found.'}</p>
        <Link href={`/farmer/${farmerId}`} className="text-sm text-agric-green underline underline-offset-2">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/farmer/${farmerId}`)}
              className="p-1 -ml-1 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors duration-150"
              aria-label="Back to dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-agric-green" aria-hidden="true" />
              <span className="font-display font-semibold text-black text-sm tracking-wide">Farm Story</span>
            </div>
          </div>
          {farmerPublicId && (
            <span className="font-mono text-xs text-gold">{farmerPublicId}</span>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6 animate-fade-in">

          {/* Farm header */}
          <div className="motion-safe:animate-slide-in-up">
            <h1 className="font-display text-2xl font-bold text-black">{farm.farm_name}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {farm.location}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <Wheat className="w-3.5 h-3.5" aria-hidden="true" />
                {farm.primary_crop}
              </span>
              <span className="text-gray-300">|</span>
              <span>{formatAcres(farm.size_acres)}</span>
            </div>
          </div>

          {/* Coordinates */}
          <div
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm motion-safe:animate-slide-in-up"
            style={{ animationDelay: '60ms' }}
          >
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Coordinates</p>
            <p className="font-mono text-sm text-gold">
              {formatCoordinate(farm.latitude)}, {formatCoordinate(farm.longitude)}
            </p>
          </div>

          {/* Challenges */}
          {farm.challenges && farm.challenges.length > 0 && (
            <div
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm motion-safe:animate-slide-in-up"
              style={{ animationDelay: '80ms' }}
            >
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Challenges</p>
              <div className="flex flex-wrap gap-2">
                {farm.challenges.map((key) => (
                  <span
                    key={key}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700"
                  >
                    {challengeLabel(key)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Farm Intelligence */}
          <div>
            <h2 className="font-display text-base font-semibold text-black mb-4 uppercase tracking-wide text-xs text-gray-400">
              Farm Intelligence
            </h2>

            {loadingInsight && (
              <div className="flex flex-col items-center gap-3 py-8 text-gray-400">
                <Spinner size="lg" />
                <p className="text-sm">Calculating your Farm Opportunity Score...</p>
              </div>
            )}

            {insightError && !loadingInsight && (
              <div className="rounded-lg border border-crimson/30 bg-red-50 px-4 py-3 text-sm text-crimson">
                {insightError}
              </div>
            )}

            {insight && !loadingInsight && (
              <div className="space-y-4">
                <FarmIntelligenceCard insight={insight} />

                {farm && <ProductionMetrics farm={farm} />}

                {insight.recommendations.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-display text-sm font-semibold text-black uppercase tracking-wide text-xs text-gray-400">
                      Recommendations
                    </h3>
                    {insight.recommendations.map((rec, i) => (
                      <RecommendationCard key={`${rec.category}-${i}`} recommendation={rec} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Divider before Take Action */}
          {insight && !loadingInsight && (
            <div className="border-t border-gray-200" />
          )}

          {/* Take Action panel */}
          {insight && !loadingInsight && (
            <TakeActionPanel
              farmerDbId={farm.farmer_id}
              farmDbId={farm.id}
              farmName={farm.farm_name}
              farmerId={farmerId}
            />
          )}

        </div>
      </main>
    </div>
  )
}
