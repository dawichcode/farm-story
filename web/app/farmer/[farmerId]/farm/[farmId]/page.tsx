'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getFarmById, getFarmInsight, ApiError } from '@/lib/api'
import { useFarmerStore } from '@/store/useFarmerStore'
import type { Farm, FarmInsight } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'
import FarmIntelligenceCard from '@/components/farm/FarmIntelligenceCard'
import RecommendationCard from '@/components/farm/RecommendationCard'
import ProductionMetrics from '@/components/farm/ProductionMetrics'
import TakeActionPanel from '@/components/farm/TakeActionPanel'
import FarmerShell from '@/components/farmer/FarmerShell'
import { MapPin, Wheat } from 'lucide-react'
import { formatAcres, formatCoordinate, challengeLabel, recommendationToServiceType } from '@/lib/utils'

export default function FarmDetailPage() {
  const { farmerId, farmId } = useParams<{ farmerId: string; farmId: string }>()
  const { farmerPublicId } = useFarmerStore()

  const [farm, setFarm]       = useState<Farm | null>(null)
  const [insight, setInsight] = useState<FarmInsight | null>(null)
  const [loadingFarm, setLoadingFarm]       = useState(true)
  const [loadingInsight, setLoadingInsight] = useState(true)
  const [farmError, setFarmError]           = useState('')
  const [insightError, setInsightError]     = useState('')

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
      <FarmerShell
        farmerPublicId={farmerPublicId}
        backHref={`/farmer/${farmerId}`}
        backLabel="Back to dashboard"
      >
        <div className="flex items-center justify-center min-h-[calc(100vh-57px)]">
          <Spinner size="lg" />
        </div>
      </FarmerShell>
    )
  }

  if (farmError || !farm) {
    return (
      <FarmerShell
        farmerPublicId={farmerPublicId}
        backHref={`/farmer/${farmerId}`}
        backLabel="Back to dashboard"
      >
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-4 text-center gap-4">
          <p className="text-gray-600">{farmError || 'Farm not found.'}</p>
          <Link href={`/farmer/${farmerId}`} className="text-sm text-agric-green underline underline-offset-2">
            Back to dashboard
          </Link>
        </div>
      </FarmerShell>
    )
  }

  return (
    <FarmerShell
      farmerPublicId={farmerPublicId}
      backHref={`/farmer/${farmerId}`}
      backLabel="Back to dashboard"
      farmerId={farmerId}
      currentFarmId={farmId}
    >
      <div className="px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6 motion-safe:animate-fade-in">

          {/* Farm header */}
          <div className="motion-safe:animate-slide-in-up">
            <h1 className="font-display text-2xl font-bold text-black">{farm.farm_name}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {farm.location}
              </span>
              <span aria-hidden="true" className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <Wheat className="w-3.5 h-3.5" aria-hidden="true" />
                {farm.primary_crop}
              </span>
              <span aria-hidden="true" className="text-gray-300">|</span>
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

          <div className="border-t border-gray-200" />

          {/* Farm Intelligence */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Farm Intelligence
            </p>

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
                {/* U4-C: Contextual narrative intro */}
                <div className="rounded-xl bg-agric-green/5 border border-agric-green/20 p-4 motion-safe:animate-slide-in-up">
                  <p className="text-sm font-semibold text-agric-green mb-1">Your farm has been assessed.</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{insight.summary}</p>
                  {insight.recommendations.length > 0 && (
                    <p className="text-xs text-agric-green/70 mt-2 font-medium">
                      {insight.recommendations.length} recommendation{insight.recommendations.length !== 1 ? 's' : ''} identified
                    </p>
                  )}
                </div>

                <FarmIntelligenceCard insight={insight} />
                {farm && <ProductionMetrics farm={farm} />}
                {insight.recommendations.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Recommendations
                    </p>
                    {insight.recommendations.map((rec, i) => (
                      <RecommendationCard key={`${rec.category}-${i}`} recommendation={rec} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {insight && !loadingInsight && <div className="border-t border-gray-200" />}

          {insight && !loadingInsight && (
            <TakeActionPanel
              farmerDbId={farm.farmer_id}
              farmDbId={farm.id}
              farmName={farm.farm_name}
              farmerId={farmerId}
              recommendedTypes={insight.recommendations
                .map((r) => recommendationToServiceType(r.category))
                .filter((t): t is string => t !== null)}
            />
          )}

        </div>
      </div>
    </FarmerShell>
  )
}
