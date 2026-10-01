'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getServiceRequests, getFarmerById, getFarms, ApiError } from '@/lib/api'
import { useFarmerStore } from '@/store/useFarmerStore'
import type { ServiceRequest, PaginationMeta, Farm } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import ServiceRequestList from '@/components/farmer/ServiceRequestList'
import FarmerShell from '@/components/farmer/FarmerShell'

export default function FarmerRequestsPage() {
  const { farmerId } = useParams<{ farmerId: string }>()
  const { farmerId: storeDbId, farmerPublicId, setFarmer } = useFarmerStore()

  const [farmerDbId, setFarmerDbId]   = useState<number | null>(storeDbId)
  const [displayId, setDisplayId]     = useState(farmerPublicId ?? '')
  const [requests, setRequests]       = useState<ServiceRequest[]>([])
  const [farms, setFarms]             = useState<Farm[]>([])
  const [meta, setMeta]               = useState<PaginationMeta | null>(null)
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]             = useState('')

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
        // Also fetch farms so cards can show the farm name
        const { data: farmList } = await getFarms(dbId)
        setFarms(farmList)
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
    <FarmerShell
      farmerPublicId={displayId || null}
      backHref={`/farmer/${farmerId}`}
      backLabel="Back to dashboard"
      farmerId={farmerId}
    >
      <div className="px-4 py-6">
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
              <ServiceRequestList requests={requests} farmerId={farmerId} farms={farms} />
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
      </div>
    </FarmerShell>
  )
}
