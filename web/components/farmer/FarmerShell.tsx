'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BrandLogo from '@/components/ui/BrandLogo'
import FarmerBottomNav from '@/components/farmer/FarmerBottomNav'
import { ChevronLeft } from 'lucide-react'

interface FarmerShellProps {
  children: React.ReactNode
  backHref?: string
  backLabel?: string
  farmerPublicId?: string | null
  headerWidth?: 'md' | 'lg'
  background?: 'default' | 'plain'
  className?: string
  /** Farmer URL segment (numeric DB id). Required to render the bottom nav. */
  farmerId?: string
  /** Most recent farm DB id. Passed to the Farm tab. null = tab is disabled. */
  currentFarmId?: string | null
}

// Inline SVG noise pattern at 3% opacity, so subtle it reads as flat on OLED
// but adds a tactile paper-like quality on LCD screens.
const GRAIN_STYLE: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'repeat',
  backgroundSize: '200px 200px',
}

export default function FarmerShell({
  children,
  backHref,
  backLabel = 'Go back',
  farmerPublicId,
  headerWidth = 'lg',
  background = 'default',
  className = '',
  farmerId,
  currentFarmId,
}: FarmerShellProps) {
  const router = useRouter()
  const maxW = headerWidth === 'md' ? 'max-w-md' : 'max-w-lg'
  const showBottomNav = !!farmerId

  function handleBack() {
    if (backHref) router.push(backHref)
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 flex flex-col ${className}`}
      style={background === 'default' ? GRAIN_STYLE : undefined}
    >
      {/* Sticky header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3.5 sticky top-0 z-20">
        <div className={`${maxW} mx-auto flex items-center justify-between gap-3`}>
          <div className="flex items-center gap-2 min-w-0">
            {backHref && (
              <button
                onClick={handleBack}
                aria-label={backLabel}
                className="p-1.5 -ml-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 active:scale-95 transition-all duration-150 flex-shrink-0"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
            <Link href="/" aria-label="Farm Story home" className="flex-shrink-0">
              <BrandLogo size="md" />
            </Link>
          </div>
          {farmerPublicId && (
            <span
              className="font-mono text-xs text-gold bg-yellow-50 border border-gold/20 rounded-md px-2 py-0.5 flex-shrink-0"
              aria-label={`Farmer ID: ${farmerPublicId}`}
            >
              {farmerPublicId}
            </span>
          )}
        </div>
      </header>

      {/* Page content — add bottom padding on mobile when bottom nav is present */}
      <main className={`flex-1 ${showBottomNav ? 'pb-16 md:pb-0' : ''}`}>
        {children}
      </main>

      {/* Mobile bottom navigation */}
      {showBottomNav && (
        <FarmerBottomNav farmerId={farmerId} farmId={currentFarmId} />
      )}
    </div>
  )
}
