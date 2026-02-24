'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useConfig, useIsModuleEnabled } from '@/providers/ConfigProvider'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Building2,
  Users,
  Truck,
  Wrench,
  FileText,
  UserCheck,
  ShoppingCart,
  Home,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  FolderKanban,
  GanttChart,
  UserCheck2,
  AlertTriangle,
  FileQuestion,
  Scale,
  ClipboardList,
  Calculator,
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronRight,
  X,
} from 'lucide-react'

// Navigation item types
interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  module?: string
  badge?: string
}

interface NavSection {
  group: string | null
  items: NavItem[]
}

// Navigation links configuration
const NAVIGATION: NavSection[] = [
  {
    group: null,
    items: [
      { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    ]
  },
  {
    group: 'المشاريع',
    items: [
      { href: '/projects', label: 'المشاريع', icon: Building2 },
      { href: '/tasks', label: 'المهام', icon: ClipboardList, module: 'kanban', badge: 'overdue' },
      { href: '/gantt', label: 'الجدول الزمني', icon: GanttChart, module: 'gantt' },
    ],
  },
  {
    group: 'الموارد',
    items: [
      { href: '/workers', label: 'العاملين', icon: Users },
      { href: '/equipment', label: 'المعدات', icon: Truck },
      { href: '/attendance', label: 'الحضور والانصراف', icon: Clock },
    ],
  },
  {
    group: 'المالية',
    items: [
      { href: '/expenses', label: 'المصروفات', icon: TrendingUp },
      { href: '/revenues', label: 'الإيرادات', icon: Scale },
      { href: '/salaries', label: 'الرواتب', icon: Calculator },
    ],
  },
  {
    group: 'إدارة المشاريع',
    items: [
      { href: '/quotations', label: 'العروض السعرية', icon: FileText },
      { href: '/clients', label: 'العملاء', icon: UserCheck },
      { href: '/suppliers', label: 'الموردين', icon: ShoppingCart },
    ],
  },
  {
    group: 'العمليات',
    items: [
      { href: '/maintenance', label: 'الصيانة', icon: Wrench },
      { href: '/spare-parts', label: 'قطع الغيار', icon: Settings },
      { href: '/housing', label: 'السكن العمالي', icon: Home },
    ],
  },
  {
    group: null,
    items: [
      { href: '/reports', label: 'التقارير', icon: BarChart3 },
      { href: '/settings', label: 'الإعدادات', icon: Settings },
    ],
  },
]

// Project management sub-items
const PROJECT_MANAGEMENT: NavItem[] = [
  { href: '/project-templates', label: 'قوالب المشاريع', icon: FileQuestion },
  { href: '/project-phases', label: 'مراحل المشاريع', icon: FolderKanban },
  { href: '/risks', label: 'إدارة المخاطر', icon: AlertTriangle, module: 'risks' },
  { href: '/documents', label: 'مستندات المشاريع', icon: FileText, module: 'documents' },
  { href: '/resources', label: 'تخصيص الموارد', icon: UserCheck2, module: 'resources' },
]

// Mock badge counts (can be fetched from API)
const BADGE_COUNTS: Record<string, { overdue?: number; total?: number; pending?: number }> = {
  tasks: {
    overdue: 10,
    total: 45,
  },
  documents: {
    pending: 5,
  },
}

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { appName } = useConfig()
  const isKanbanEnabled = useIsModuleEnabled('kanban')
  const isGanttEnabled = useIsModuleEnabled('gantt')
  const isResourcesEnabled = useIsModuleEnabled('resources')
  const isRisksEnabled = useIsModuleEnabled('risks')
  const isDocumentsEnabled = useIsModuleEnabled('documents')

  const [projectGroupExpanded, setProjectGroupExpanded] = useState(true)

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-slate-800 border-l border-slate-700 transition-all duration-300',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-slate-700 px-4">
        {!collapsed ? (
          <div className="text-center">
            <h1 className="text-lg font-bold text-blue-400">{appName}</h1>
          </div>
        ) : (
          <span className="text-xl font-bold text-blue-400">ERP</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 p-4 overflow-y-auto">
        {NAVIGATION.map((section, groupIndex) => {
          if (section.group === null) {
            // Items without group
            return (
              <div key={groupIndex} className="space-y-1">
                {section.items.map((item) => {
                  // Skip if module is specified and not enabled
                  if (item.module && !useIsModuleEnabled(item.module)) {
                    return null
                  }

                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                  const badge = item.badge && BADGE_COUNTS[item.badge as keyof typeof BADGE_COUNTS]

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors relative group',
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                        collapsed && 'justify-center px-3'
                      )}
                    >
                      <Icon className={cn('h-5 w-5 flex-shrink-0', collapsed && 'h-6 w-6')} />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {badge && (
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              badge.overdue && badge.overdue > 0 ? 'bg-red-500 text-white' : 'bg-slate-600 text-slate-300'
                            )}>
                              {badge.overdue && badge.overdue > 0 ? `${badge.overdue} متأخر` : (badge.total || badge.pending)}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
            )
          }

          // Sections with group
          return (
            <div key={groupIndex} className="space-y-1">
              {/* Group Header */}
              {!collapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {section.group}
                </div>
              )}

              {/* Group Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  // Skip if module is specified and not enabled
                  if (item.module && !useIsModuleEnabled(item.module)) {
                    return null
                  }

                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                  const badge = item.badge && BADGE_COUNTS[item.badge as keyof typeof BADGE_COUNTS]

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                        collapsed && 'justify-center px-3'
                      )}
                    >
                      <Icon className={cn('h-5 w-5 flex-shrink-0', collapsed && 'h-6 w-6')} />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {badge && (
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              badge.overdue && badge.overdue > 0 ? 'bg-red-500 text-white' : 'bg-slate-600 text-slate-300'
                            )}>
                              {badge.overdue && badge.overdue > 0 ? `${badge.overdue} متأخر` : (badge.total || badge.pending)}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Project Management Sub-group */}
              {section.group === 'المشاريع' && !collapsed && (
                <div className="mr-4 space-y-1">
                  <button
                    onClick={() => setProjectGroupExpanded(!projectGroupExpanded)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {projectGroupExpanded ? (
                      <ArrowDownCircle className="h-4 w-4" />
                    ) : (
                      <ArrowUpCircle className="h-4 w-4" />
                    )}
                    <span className="font-medium">إدارة المشاريع</span>
                  </button>

                  {projectGroupExpanded && (
                    <div className="space-y-1 mr-2">
                      {PROJECT_MANAGEMENT.map((item) => {
                        // Skip if module is specified and not enabled
                        if (item.module && !useIsModuleEnabled(item.module)) {
                          return null
                        }

                        const Icon = item.icon
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors',
                              isActive
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white',
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-white',
            collapsed && 'justify-center px-3'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <X className="h-5 w-5" />
              <span>طي القائمة</span>
            </>
          )}
        </button>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300',
            collapsed && 'justify-center px-3'
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  )
}
