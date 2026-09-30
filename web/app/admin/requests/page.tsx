'use client'

import { useEffect, useState } from 'react'
import { getAdminRequests } from '@/lib/api'
import type { ServiceRequest, Farmer, Farm, PaginationMeta } from '@/lib/types'
import ServiceRequestTable from '@/components/admin/ServiceRequestTable'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'

type RequestWithRelations = ServiceRequest & { farmer?: Farmer; farm?: Farm }

export default function AdminRequestsPage() {
  const [requests, setRequests]       = useState<RequestWithRelations[]>([])
  const [meta, setMeta]               = useState<PaginationMeta | null>(null)
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]             = useState('')

  useEffect(() => {
    getAdminRequests()
      .then(({ data, meta: m }) => {
        setRequests(data as RequestWithRelations[])
        setMeta(m)
      })
      .catch(() => setError('Could not load service requests.'))
      .finally(() => setLoading(false))
  }, [])

  async function loadMore() {
    if (!meta?.next_cursor) return
    setLoadingMore(true)
    try {
      const { data, meta: m } = await getAdminRequests(meta.next_cursor)
      setRequests((prev) => [...prev, ...(data as RequestWithRelations[])])
      setMeta(m)
    } catch {
      // silent
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-6 motion-safe:animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-black">Service requests</h1>
        <p className="text-sm text-gray-500 mt-1">All submitted service requests</p>
      </div>

      {loading && (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      )}

      {error && !loading && (
        <div role="alert" className="rounded-lg border border-crimson/30 bg-red-50 px-4 py-3 text-sm text-crimson">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <ServiceRequestTable requests={requests} />
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
  )
}
