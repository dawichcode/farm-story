'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getFarmerById, ApiError } from '@/lib/api'
import { useFarmerStore } from '@/store/useFarmerStore'
import { useFarmFormStore } from '@/store/useFarmFormStore'
import FarmRegistrationForm from '@/components/farm/FarmRegistrationForm'
import Spinner from '@/components/ui/Spinner'
import FarmerShell from '@/components/farmer/FarmerShell'

export default function FarmNewPage() {
  const { farmerId } = useParams<{ farmerId: string }>()
  const router = useRouter()

  const { farmerId: storeId, farmerPublicId, farmerName, setFarmer } = useFarmerStore()
  const resetForm = useFarmFormStore((s) => s.reset)

  const [farmerDbId, setFarmerDbId] = useState<number | null>(storeId)
  const [displayId, setDisplayId]   = useState(farmerPublicId ?? '')
  const [name, setName]             = useState(farmerName ?? '')
  const [loading, setLoading]       = useState(!storeId)
  const [error, setError]           = useState('')

  useEffect(() => {
    if (storeId) return
    async function load() {
      try {
        const farmer = await getFarmerById(farmerId)
        setFarmer(farmer.id, farmer.farmer_id, farmer.full_name)
        setFarmerDbId(farmer.id)
        setDisplayId(farmer.farmer_id)
        setName(farmer.full_name)
      } catch (err) {
        setError(
          err instanceof ApiError && err.status === 404
            ? 'Farmer not found.'
            : 'Could not load farmer data. Please try again.',
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [farmerId, storeId, setFarmer])

  useEffect(() => {
    resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSuccess(farmId: number) {
    router.push(`/farmer/${farmerId}/farm/${farmId}`)
  }

  if (loading) {
    return (
      <FarmerShell farmerPublicId={displayId || null} farmerId={farmerId}>
        <div className="flex items-center justify-center min-h-[calc(100vh-57px)]">
          <Spinner size="lg" />
        </div>
      </FarmerShell>
    )
  }

  if (error || !farmerDbId) {
    return (
      <FarmerShell farmerPublicId={displayId || null} farmerId={farmerId}>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-4 text-center gap-4">
          <p className="text-gray-600">{error || 'Farmer not found.'}</p>
        </div>
      </FarmerShell>
    )
  }

  return (
    <FarmerShell farmerPublicId={displayId || null} farmerId={farmerId}>
      <div className="px-4 lg:px-8 py-8 lg:py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="motion-safe:animate-slide-in-up">
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-black">Register your farm</h1>
            {name && (
              <p className="text-sm text-gray-500 mt-1">Registering for {name}</p>
            )}
          </div>

          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 motion-safe:animate-slide-in-up"
            style={{ animationDelay: '60ms' }}
          >
            <FarmRegistrationForm farmerDbId={farmerDbId} onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </FarmerShell>
  )
}
