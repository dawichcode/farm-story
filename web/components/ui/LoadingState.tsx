import Spinner from '@/components/ui/Spinner'

interface LoadingStateProps {
  label?: string
}

export default function LoadingState({ label }: LoadingStateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
      <Spinner size="lg" />
      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  )
}
