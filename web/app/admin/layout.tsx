'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, ClipboardList } from 'lucide-react'
import BrandLogo from '@/components/ui/BrandLogo'

const NAV = [
  { href: '/admin',          label: 'Dashboard',       icon: LayoutDashboard, exact: true },
  { href: '/admin/farmers',  label: 'Farmers',          icon: Users },
  { href: '/admin/requests', label: 'Service Requests', icon: ClipboardList },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean): boolean {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ------------------------------------------------------------------ */}
      {/* Sidebar — hidden on mobile, icon-only on md, full on lg+            */}
      {/* ------------------------------------------------------------------ */}
      <aside className="hidden md:flex flex-col flex-shrink-0 bg-white border-r border-gray-100
                        w-[60px] lg:w-60 transition-all duration-200 overflow-hidden group/sidebar">

        {/* Brand */}
        <div className="px-3 lg:px-5 py-5 border-b border-gray-100 flex items-center gap-2 overflow-hidden">
          {/* Icon always visible */}
          <div className="flex-shrink-0">
            <BrandLogo variant="mark" size="sm" />
          </div>
          {/* Wordmark + role visible only when sidebar is expanded */}
          <div className="hidden lg:block min-w-0">
            <p className="font-display font-bold text-black text-sm tracking-wide leading-tight">Farm Story</p>
            <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 lg:px-3 py-4 space-y-0.5" aria-label="Admin navigation">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                title={label}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex items-center gap-2.5 px-2.5 lg:px-3 py-2.5 rounded-lg text-sm font-medium',
                  'transition-colors duration-150 relative overflow-hidden',
                  active
                    ? 'bg-agric-green/10 text-agric-green border-l-2 border-agric-green -ml-[2px] pl-[calc(0.625rem+2px)] lg:pl-[calc(0.75rem+2px)]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black border-l-2 border-transparent -ml-[2px]',
                ].join(' ')}
              >
                <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                {/* Label hidden on md, visible on lg */}
                <span className="hidden lg:block truncate">{label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile bottom tab bar — visible below md                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100"
           style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <nav className="flex items-stretch" aria-label="Admin navigation">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-medium',
                  'transition-colors duration-150 relative',
                  active ? 'text-agric-green' : 'text-gray-400 hover:text-gray-600',
                ].join(' ')}
              >
                {/* Active indicator bar at top of tab */}
                {active && (
                  <span className="absolute top-0 inset-x-4 h-0.5 bg-agric-green rounded-b-full" aria-hidden="true" />
                )}
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main content                                                        */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {children}
      </main>

    </div>
  )
}
