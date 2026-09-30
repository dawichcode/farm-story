'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sprout, LayoutDashboard, Users, ClipboardList } from 'lucide-react'

const NAV = [
  { href: '/admin',          label: 'Dashboard',        icon: LayoutDashboard, exact: true },
  { href: '/admin/farmers',  label: 'Farmers',           icon: Users },
  { href: '/admin/requests', label: 'Service Requests',  icon: ClipboardList },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean): boolean {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 hidden lg:flex">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-0.5">
            <Sprout className="w-5 h-5 text-agric-green" aria-hidden="true" />
            <span className="font-display font-bold text-black text-sm tracking-wide">Farm Story</span>
          </div>
          <p className="text-xs text-gray-400 pl-7">Administrator</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Admin navigation">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                  active
                    ? 'bg-agric-green/10 text-agric-green'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-20 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-agric-green" aria-hidden="true" />
            <span className="font-display font-bold text-black text-sm">Farm Story</span>
            <span className="text-xs text-gray-400">Admin</span>
          </div>
          <nav className="flex items-center gap-1" aria-label="Admin navigation">
            {NAV.map(({ href, icon: Icon, label, exact }) => {
              const active = isActive(href, exact)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'p-2 rounded-lg transition-colors duration-150',
                    active ? 'bg-agric-green/10 text-agric-green' : 'text-gray-500 hover:bg-gray-100',
                  ].join(' ')}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-14">
        {children}
      </main>
    </div>
  )
}
