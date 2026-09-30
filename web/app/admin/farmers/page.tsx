'use client'

import { useCallback, useEffect, useState } from 'react'
import { getAdminFarmers } from '@/lib/api'
import type { Farmer, Farm, PaginationMeta } from '@/lib/types'
import FarmerTable from '@/components/admin/FarmerTable'
import FarmerSearchInput from '@/components/admin/FarmerSearchInput'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import { Download } from 'lucide-react'

type FarmerWithFarms = Farmer & { farms?: Farm[] }

const EXPORT_URL = `${process.env.NEXT_PUBLIC_API_URL}/admin/farmers/export`

export default function AdminFarmersPage() {
  const [farmers, setFarmers]     = useState<FarmerWithFarms[]>([])
  const [meta, setMeta]           = useState<PaginationMeta | null>(null)
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    getAdminFarmers({ search: search || undefined })
      .then(({ data, meta: m }) => {
        setFarmers(data as FarmerWithFarms[])
        setMeta(m)
      })
      .catch(() => setError('Could not load farmers.'))
      .finally(() => setLoading(false))
  }, [search])

  const handleSearch = useCallback((term: string) => {
    setSearch(term)
  }, [])

  async function loadMore() {
    if (!meta?.next_cursor) return
    setLoadingMore(true)
    try {
      const { data, meta: m } = await getAdminFarmers({ search: search || undefined, cursor: meta.next_cursor })
      setFarmers((prev) => [...prev, ...(data as FarmerWithFarms[])])
      setMeta(m)
    } catch {
      // silent
    } finally {
      setLoadingMore(false)
    }
  }

  function handleExport() {
    // Direct browser navigation triggers the Content-Disposition: attachment download
    window.location.href = EXPORT_URL
  }

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-6 motion-safe:animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-black">Farmers</h1>
          <p className="text-sm text-gray-500 mt-1">All registered farmers</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          className="self-start sm:self-auto"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Export CSV
        </Button>
      </div>

      <FarmerSearchInput onSearch={handleSearch} />

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
          <FarmerTable farmers={farmers} />
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
