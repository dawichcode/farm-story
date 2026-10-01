'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface FarmerIdCardProps {
  farmerId: string
  farmerName: string
  county?: string
}

export default function FarmerIdCard({ farmerId, farmerName, county }: FarmerIdCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(farmerId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — silent fail
    }
  }

  return (
    <div className="relative rounded-b-xl rounded-t-xl border border-gold/40 bg-white shadow-sm overflow-hidden motion-safe:animate-roll-in">
      {/* Green top accent border */}
      <div className="h-1 bg-agric-green w-full" aria-hidden="true" />

      <div className="p-6">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3">
          Farmer ID
        </p>

        {/* ID + copy button */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="font-mono text-2xl font-medium text-gold tracking-wider">
            {farmerId}
          </p>
          <button
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy Farmer ID'}
            className="p-1.5 rounded-md text-gray-400 hover:text-agric-green hover:bg-agric-green/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agric-green flex-shrink-0"
          >
            {copied
              ? <Check className="w-4 h-4 text-agric-green" aria-hidden="true" />
              : <Copy className="w-4 h-4" aria-hidden="true" />
            }
          </button>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-1">
          <p className="text-sm font-semibold text-black">{farmerName}</p>
          {county && (
            <p className="text-sm text-gray-500">{county}</p>
          )}
        </div>
      </div>

      {/* Subtle watermark bottom-right */}
      <span
        className="absolute bottom-3 right-4 font-display text-[10px] tracking-widest text-gray-200 uppercase pointer-events-none select-none"
        aria-hidden="true"
      >
        Farm Story
      </span>
    </div>
  )
}
