'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getFarmerById, getFarms, ApiError } from '@/lib/api'
import { useFarmerStore } from '@/store/useFarmerStore'
import type { Farmer, Farm } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import FarmerShell from '@/components/farmer/FarmerShell'
import { PlusCircle, ClipboardList, Wheat, MapPin, Check, Loader, BarChart3 } from 'lucide-react'
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
      <FarmerShell>
        <div className="flex items-center justify-center min-h-[calc(100vh-57px)]">
          <Spinner size="lg" />
        </div>
      </FarmerShell>
    )
  }

  if (error || !farmer) {
    return (
      <FarmerShell>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-4 text-center gap-4">
          <p className="text-gray-600">{error || 'Farmer not found.'}</p>
          <Link href="/farmer/register" className="text-sm text-agric-green underline underline-offset-2">
            Back to registration
          </Link>
        </div>
      </FarmerShell>
    )
  }

  return (
    <FarmerShell farmerPublicId={farmer.farmer_id} farmerId={farmerId} currentFarmId={farms[0] ? String(farms[0].id) : null}>
      <div className="px-4 py-8">
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

          {/* U4-B: Empty state journey stepper when no farms yet */}
          {farms.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm motion-safe:animate-slide-in-up space-y-5" style={{ animationDelay: '60ms' }}>
              <p className="text-sm font-medium text-gray-600">Get started by adding your first farm.</p>
              <div className="flex items-start gap-0">
                {[
                  { icon: Check,          label: 'Register',          done: true,  active: false },
                  { icon: Loader,         label: 'Add your farm',     done: false, active: true  },
                  { icon: BarChart3,      label: 'Get your score',    done: false, active: false },
                  { icon: ClipboardList,  label: 'Request a service', done: false, active: false },
                ].map(({ icon: Icon, label, done, active }, i, arr) => (
                  <div key={label} className="flex flex-col items-center flex-1">
                    <div className="flex items-center w-full">
                      {i > 0 && (
                        <div className={`flex-1 h-px ${done ? 'bg-agric-green' : 'bg-gray-200'}`} aria-hidden="true" />
                      )}
                      <div className={[
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        done   ? 'bg-agric-green text-white' :
                        active ? 'bg-agric-green/10 border-2 border-agric-green text-agric-green motion-safe:animate-score-pulse' :
                                 'bg-gray-100 text-gray-400',
                      ].join(' ')}>
                        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`flex-1 h-px ${done ? 'bg-agric-green' : 'bg-gray-200'}`} aria-hidden="true" />
                      )}
                    </div>
                    <p className={`text-[10px] mt-1.5 text-center leading-tight ${active ? 'text-agric-green font-semibold' : 'text-gray-400'}`}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
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
              {farms.length === 0 ? 'Add your first farm' : 'Register another farm'}
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
      </div>
    </FarmerShell>
  )
}
