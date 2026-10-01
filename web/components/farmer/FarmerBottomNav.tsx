'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Sprout, ClipboardList } from 'lucide-react'

interface Props {
  farmerId: string
  /** DB id of the most recent farm, used for the Farm tab link. null = disabled. */
  farmId?: string | null
}

export default function FarmerBottomNav({ farmerId, farmId }: Props) {
  const pathname = usePathname()

  const tabs = [
    {
      key:   'home',
      label: 'Home',
      icon:  Home,
      href:  `/farmer/${farmerId}`,
      active: pathname === `/farmer/${farmerId}`,
      disabled: false,
    },
    {
      key:   'farm',
      label: 'Farm',
      icon:  Sprout,
      href:  farmId ? `/farmer/${farmerId}/farm/${farmId}` : '#',
      active: pathname.includes('/farm/') && !pathname.includes('/farm/new'),
      disabled: !farmId,
    },
    {
      key:   'requests',
      label: 'Requests',
      icon:  ClipboardList,
      href:  `/farmer/${farmerId}/requests`,
      active: pathname.includes('/requests'),
      disabled: false,
    },
  ]

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-100"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Farmer navigation"
    >
      <div className="flex items-stretch">
        {tabs.map(({ key, label, icon: Icon, href, active, disabled }) => {
          const base = [
            'flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 relative',
            'transition-colors duration-150',
            disabled
              ? 'opacity-35 cursor-not-allowed'
              : active
                ? 'text-agric-green'
                : 'text-gray-400 hover:text-gray-600',
          ].join(' ')

          const inner = (
            <>
              {/* Active indicator */}
              {active && (
                <span className="absolute top-0 inset-x-4 h-0.5 bg-agric-green rounded-b-full" aria-hidden="true" />
              )}
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className={`text-[10px] font-medium ${active ? 'opacity-100' : 'opacity-0 h-0'}`}>
                {label}
              </span>
            </>
          )

          if (disabled) {
            return (
              <button key={key} disabled aria-label={label} className={base}>
                {inner}
              </button>
            )
          }

          return (
            <Link
              key={key}
              href={href}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={base}
            >
              {inner}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
