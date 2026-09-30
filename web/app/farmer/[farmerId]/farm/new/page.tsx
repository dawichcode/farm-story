'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getFarmerById, ApiError } from '@/lib/api'
import { useFarmerStore } from '@/store/useFarmerStore'
import { useFarmFormStore } from '@/store/useFarmFormStore'
import FarmRegistrationForm from '@/components/farm/FarmRegistrationForm'
import Spinner from '@/components/ui/Spinner'
import { Sprout } from 'lucide-react'

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

  // If the store is empty (e.g. page refresh), fetch the farmer from the API
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
        if (err instanceof ApiError && err.status === 404) {
          setError('Farmer not found.')
        } else {
          setError('Could not load farmer data. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [farmerId, storeId, setFarmer])

  // Reset the multi-step form store when entering this page fresh
  useEffect(() => {
    resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSuccess(farmId: number) {
    router.push(`/farmer/${farmerId}/farm/${farmId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !farmerDbId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center gap-4">
        <p className="text-gray-600">{error || 'Farmer not found.'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-agric-green" aria-hidden="true" />
            <span className="font-display font-semibold text-black text-sm tracking-wide">Farm Story</span>
          </div>
          {displayId && (
            <span className="font-mono text-xs text-gold">{displayId}</span>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="motion-safe:animate-slide-in-up">
            <h1 className="font-display text-2xl font-bold text-black">Register your farm</h1>
            {name && (
              <p className="text-sm text-gray-500 mt-1">Registering for {name}</p>
            )}
          </div>

          <div
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 motion-safe:animate-slide-in-up"
            style={{ animationDelay: '60ms' }}
          >
            <FarmRegistrationForm farmerDbId={farmerDbId} onSuccess={handleSuccess} />
          </div>
        </div>
      </main>
    </div>
  )
}
