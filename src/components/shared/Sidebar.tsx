'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/constants'
import {
  LayoutDashboard,
  Building2,
  Users,
  Truck,
  Wrench,
  Cog,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText,
  UserCheck,
  ShoppingCart,
  Home,
  Clock,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const iconMap = {
  LayoutDashboard,
  Building2,
  Users,
  Truck,
  Wrench,
  Cog,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText,
  UserCheck,
  ShoppingCart,
  Home,
  Clock,
  BarChart3,
  Settings,
}

interface SidebarProps {
  collapsed?: boolean
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed right-0 top-0 z-40 h-screen bg-slate-800 border-l border-slate-700 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-slate-700">
        {!collapsed ? (
          <h1 className="text-xl font-bold text-blue-400">نظام ERP المقاولات</h1>
        ) : (
          <span className="text-2xl font-bold text-blue-400">ERP</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        {NAV_LINKS.map((link) => {
          const Icon = iconMap[link.icon as keyof typeof iconMap] || LayoutDashboard
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                collapsed && 'justify-center'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 right-4 left-4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  )
}
