'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getFarmerById, getFarms, ApiError } from '@/lib/api'
import { useFarmerStore } from '@/store/useFarmerStore'
import type { Farmer, Farm } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import { PlusCircle, ClipboardList, Wheat, MapPin } from 'lucide-react'
import BrandLogo from '@/components/ui/BrandLogo'
import { formatAcres } from '@/lib/utils'

export default function FarmerDashboardPage() {
  const { farmerId } = useParams<{ farmerId: string }>()
  const router = useRouter()
  const { setFarmer } = useFarmerStore()

  const [farmer, setFarmerData] = useState<Farmer | null>(null)
  const [farms, setFarms]       = useState<Farm[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getFarmerById(farmerId)
        setFarmerData(data)
        setFarmer(data.id, data.farmer_id, data.full_name)

        // Load this farmer's farms
        const { data: farmList } = await getFarms(data.id)
        setFarms(farmList)
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
  }, [farmerId, setFarmer])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !farmer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center gap-4">
        <p className="text-gray-600">{error || 'Farmer not found.'}</p>
        <Link href="/farmer/register" className="text-sm text-agric-green underline underline-offset-2">
          Back to registration
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandLogo size="md" />
          </div>
          <span className="font-mono text-xs text-gold">{farmer.farmer_id}</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="motion-safe:animate-slide-in-up">
            <h1 className="font-display text-2xl font-bold text-black">
              Welcome, {farmer.full_name.split(' ')[0]}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{farmer.county}</p>
          </div>

          {/* Existing farms */}
          {farms.length > 0 && (
            <div className="space-y-3 motion-safe:animate-slide-in-up" style={{ animationDelay: '60ms' }}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Your farms</h2>
              {farms.map((farm) => (
                <button
                  key={farm.id}
                  onClick={() => router.push(`/farmer/${farmerId}/farm/${farm.id}`)}
                  className="w-full text-left rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-agric-green hover:shadow-md transition-all duration-150"
                >
                  <p className="font-display font-semibold text-black">{farm.farm_name}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" aria-hidden="true" />{farm.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wheat className="w-3 h-3" aria-hidden="true" />{farm.primary_crop}
                    </span>
                    <span>{formatAcres(farm.size_acres)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3 motion-safe:animate-slide-in-up" style={{ animationDelay: '80ms' }}>
            <Button
              className="w-full justify-start gap-3"
              size="lg"
              onClick={() => router.push(`/farmer/${farmerId}/farm/new`)}
            >
              <PlusCircle className="w-5 h-5" aria-hidden="true" />
              Register a farm
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start gap-3"
              size="lg"
              onClick={() => router.push(`/farmer/${farmerId}/requests`)}
            >
              <ClipboardList className="w-5 h-5" aria-hidden="true" />
              View service requests
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
