'use client'

import type { Farmer, Farm } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'

type FarmerWithFarms = Farmer & { farms?: Farm[] }

interface Props {
  farmers: FarmerWithFarms[]
}

export default function FarmerTable({ farmers }: Props) {
  const router = useRouter()

  if (farmers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Users className="w-10 h-10 text-gray-300" aria-hidden="true" />
        <p className="text-sm text-gray-500">No farmers found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <caption className="sr-only">Registered farmers</caption>
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Farmer
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              County
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Farm
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Acres
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {farmers.map((farmer) => {
            const primaryFarm = farmer.farms?.[0]
            const href = `/admin/farmers/${farmer.id}`

            return (
              <tr
                key={farmer.id}
                role="link"
                tabIndex={0}
                aria-label={`View ${farmer.full_name}`}
                onClick={() => router.push(href)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    router.push(href)
                  }
                }}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-100 focus-visible:outline-none focus-visible:bg-agric-green/5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-agric-green"
              >
                <td className="px-4 py-3.5">
                  <p className="font-medium text-black">{farmer.full_name}</p>
                  <p className="font-mono text-xs text-gold mt-0.5">{farmer.farmer_id}</p>
                </td>
                <td className="px-4 py-3.5 text-gray-600 hidden sm:table-cell">
                  {farmer.county}
                </td>
                <td className="px-4 py-3.5 text-gray-600 hidden md:table-cell">
                  {primaryFarm?.farm_name ?? <span className="text-gray-300">None</span>}
                </td>
                <td className="px-4 py-3.5 text-right text-gray-600 hidden md:table-cell">
                  {primaryFarm ? Number(primaryFarm.size_acres).toFixed(1) : <span className="text-gray-300">-</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
