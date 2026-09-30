'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getServiceRequests, getFarmerById, ApiError } from '@/lib/api'
import { useFarmerStore } from '@/store/useFarmerStore'
import type { ServiceRequest } from '@/lib/types'
import type { PaginationMeta } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import ServiceRequestList from '@/components/farmer/ServiceRequestList'
import { ChevronLeft } from 'lucide-react'
import BrandLogo from '@/components/ui/BrandLogo'

export default function FarmerRequestsPage() {
  const { farmerId } = useParams<{ farmerId: string }>()
  const router = useRouter()
  const { farmerId: storeDbId, farmerPublicId, setFarmer } = useFarmerStore()

  const [farmerDbId, setFarmerDbId]   = useState<number | null>(storeDbId)
  const [displayId, setDisplayId]     = useState(farmerPublicId ?? '')
  const [requests, setRequests]       = useState<ServiceRequest[]>([])
  const [meta, setMeta]               = useState<PaginationMeta | null>(null)
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]             = useState('')

  // Resolve farmer DB ID from store or API
  useEffect(() => {
    async function resolveAndLoad() {
      let dbId = storeDbId

      if (!dbId) {
        try {
          const farmer = await getFarmerById(farmerId)
          setFarmer(farmer.id, farmer.farmer_id, farmer.full_name)
          setFarmerDbId(farmer.id)
          setDisplayId(farmer.farmer_id)
          dbId = farmer.id
        } catch {
          setError('Could not load farmer data.')
          setLoading(false)
          return
        }
      }

      try {
        const { data, meta: m } = await getServiceRequests({ farmer_id: dbId })
        setRequests(data)
        setMeta(m)
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : 'Could not load service requests.',
        )
      } finally {
        setLoading(false)
      }
    }
    resolveAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerId])

  async function loadMore() {
    if (!meta?.next_cursor || !farmerDbId) return
    setLoadingMore(true)
    try {
      const { data, meta: m } = await getServiceRequests({
        farmer_id: farmerDbId,
        cursor:    meta.next_cursor,
      })
      setRequests((prev) => [...prev, ...data])
      setMeta(m)
    } catch {
      // Silent fail on load more
    } finally {
      setLoadingMore(false)
    }
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
              <BrandLogo size="sm" />
            </div>
          </div>
          {displayId && (
            <span className="font-mono text-xs text-gold">{displayId}</span>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="motion-safe:animate-slide-in-up">
            <h1 className="font-display text-2xl font-bold text-black">Service requests</h1>
            <p className="text-sm text-gray-500 mt-1">All requests you have submitted.</p>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          )}

          {error && !loading && (
            <div role="alert" className="rounded-lg border border-crimson/30 bg-red-50 px-4 py-3 text-sm text-crimson">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <ServiceRequestList requests={requests} farmerId={farmerId} />

              {meta?.has_more && (
                <div className="flex justify-center pt-2">
                  <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
