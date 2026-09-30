import type { ServiceRequest } from '@/lib/types'
import { serviceTypeLabel, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { ClipboardList } from 'lucide-react'

interface Props {
  requests: ServiceRequest[]
  farmerId: string
}

function statusVariant(status: string): 'success' | 'warning' | 'default' {
  switch (status.toLowerCase()) {
    case 'completed': return 'success'
    case 'pending':   return 'warning'
    default:          return 'default'
  }
}

export default function ServiceRequestList({ requests, farmerId }: Props) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <ClipboardList className="w-10 h-10 text-gray-300" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-gray-600">No service requests yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Submit a request from your farm page after viewing your Farm Opportunity Score.
          </p>
        </div>
        <Link
          href={`/farmer/${farmerId}`}
          className="text-sm text-agric-green underline underline-offset-2"
        >
          Go to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((req, i) => (
        <div
          key={req.id}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm motion-safe:animate-slide-in-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-black">{serviceTypeLabel(req.type)}</p>
              <p className="font-mono text-xs text-gold mt-0.5">{req.reference}</p>
            </div>
            <Badge variant={statusVariant(req.status)} className="flex-shrink-0 capitalize">
              {req.status}
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mt-2">{formatDate(req.created_at)}</p>
        </div>
      ))}
    </div>
  )
}
