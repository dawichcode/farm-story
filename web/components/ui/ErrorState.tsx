import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message: string
  actionLabel?: string
  actionHref?: string
}

export default function ErrorState({
  title = 'Something went wrong',
  message,
  actionLabel,
  actionHref,
}: ErrorStateProps) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center px-6">
      <AlertCircle className="w-10 h-10 text-crimson" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-display text-base font-semibold text-black">{title}</p>
        <p className="text-sm text-gray-500 max-w-xs">{message}</p>
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center h-10 px-5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agric-green"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
