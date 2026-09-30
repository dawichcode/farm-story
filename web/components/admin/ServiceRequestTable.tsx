import type { ServiceRequest, Farmer, Farm } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import { serviceTypeLabel, formatDate } from '@/lib/utils'
import { ClipboardList } from 'lucide-react'

type RequestWithRelations = ServiceRequest & { farmer?: Farmer; farm?: Farm }

interface Props {
  requests: RequestWithRelations[]
}

function statusVariant(status: string): 'success' | 'warning' | 'default' {
  switch (status.toLowerCase()) {
    case 'completed': return 'success'
    case 'pending':   return 'warning'
    default:          return 'default'
  }
}

export default function ServiceRequestTable({ requests }: Props) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <ClipboardList className="w-10 h-10 text-gray-300" aria-hidden="true" />
        <p className="text-sm text-gray-500">No service requests yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Reference
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              Farmer
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Farm
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Submitted
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-gray-50 transition-colors duration-100">
              <td className="px-4 py-3.5">
                <span className="font-mono text-xs text-gold">{req.reference}</span>
              </td>
              <td className="px-4 py-3.5 text-gray-700 hidden sm:table-cell">
                {req.farmer?.full_name ?? '-'}
              </td>
              <td className="px-4 py-3.5 text-gray-700 hidden lg:table-cell">
                {req.farm?.farm_name ?? '-'}
              </td>
              <td className="px-4 py-3.5 text-gray-700">
                {serviceTypeLabel(req.type)}
              </td>
              <td className="px-4 py-3.5">
                <Badge variant={statusVariant(req.status)} className="capitalize">
                  {req.status}
                </Badge>
              </td>
              <td className="px-4 py-3.5 text-right text-gray-400 hidden md:table-cell">
                {formatDate(req.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
