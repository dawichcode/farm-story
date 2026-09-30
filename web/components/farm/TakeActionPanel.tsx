'use client'

import { useState } from 'react'
import { createServiceRequest, ApiError } from '@/lib/api'
import { serviceTypeLabel } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const SERVICE_TYPES = [
  'agronomist_visit',
  'soil_test',
  'biochar_assessment',
  'coffee_quality_assessment',
  'buyer_offtake_support',
] as const

type ServiceType = (typeof SERVICE_TYPES)[number]

type PanelState = 'list' | 'confirm' | 'success'

interface Props {
  farmerDbId: number
  farmDbId: number
  farmName: string
  farmerId: string   // URL segment for navigation
}

export default function TakeActionPanel({ farmerDbId, farmDbId, farmName, farmerId }: Props) {
  const [panelState, setPanelState]       = useState<PanelState>('list')
  const [selected, setSelected]           = useState<ServiceType | null>(null)
  const [reference, setReference]         = useState('')
  const [submitting, setSubmitting]       = useState(false)
  const [error, setError]                 = useState('')

  function handleSelect(type: ServiceType) {
    setSelected(type)
    setError('')
    setPanelState('confirm')
  }

  function handleBack() {
    setError('')
    setPanelState('list')
  }

  async function handleSubmit() {
    if (!selected) return
    setError('')
    setSubmitting(true)

    try {
      const req = await createServiceRequest({
        farmer_id: farmerDbId,
        farm_id:   farmDbId,
        type:      selected,
      })
      setReference(req.reference)
      setPanelState('success')
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ---- Service type list ----
  if (panelState === 'list') {
    return (
      <div className="space-y-4 motion-safe:animate-slide-in-up">
        <div>
          <h2 className="font-display text-lg font-semibold text-black">How can we help?</h2>
          <p className="text-sm text-gray-500 mt-0.5">Select a service to submit a request.</p>
        </div>

        <div className="space-y-2">
          {SERVICE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-black hover:border-agric-green hover:bg-green-50 transition-colors duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agric-green"
            >
              <span>{serviceTypeLabel(type)}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ---- Confirmation screen ----
  if (panelState === 'confirm' && selected) {
    return (
      <div className="space-y-5 motion-safe:animate-roll-in">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back
        </button>

        <div>
          <h2 className="font-display text-lg font-semibold text-black">Request service</h2>
          <p className="text-sm text-gray-500 mt-0.5">Review your request before submitting.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-0.5">Service</p>
            <p className="text-sm font-semibold text-black">{serviceTypeLabel(selected)}</p>
          </div>
          <div className="border-t border-gray-100" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-0.5">Farm</p>
            <p className="text-sm font-medium text-black">{farmName}</p>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-crimson/30 bg-red-50 px-4 py-3 text-sm text-crimson">
            {error}
          </div>
        )}

        <Button className="w-full" size="lg" loading={submitting} onClick={handleSubmit}>
          Submit request
        </Button>
      </div>
    )
  }

  // ---- Success screen ----
  if (panelState === 'success') {
    return (
      <div className="space-y-5 motion-safe:animate-roll-in">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-agric-green flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="font-display text-lg font-semibold text-black">Request submitted</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Your {selected ? serviceTypeLabel(selected).toLowerCase() : 'service'} request has been
              successfully submitted.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1.5">Reference</p>
          <p className="font-mono text-xl font-medium text-gold tracking-wider">{reference}</p>
        </div>

        <Link
          href={`/farmer/${farmerId}`}
          className="flex items-center justify-center w-full h-11 rounded-lg border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 transition-colors duration-150"
        >
          Back to dashboard
        </Link>
      </div>
    )
  }

  return null
}
