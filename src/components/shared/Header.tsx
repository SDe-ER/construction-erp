'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Bell,
  Search,
  User,
  Menu,
  ChevronRight,
  Home,
  X,
  Command,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useConfig } from '@/providers/ConfigProvider'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

// Route labels mapping
const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'لوحة التحكم',
  projects: 'المشاريع',
  tasks: 'المهام',
  gantt: 'الجدول الزمني',
  workers: 'العاملين',
  equipment: 'المعدات',
  attendance: 'الحضور والانصراف',
  expenses: 'المصروفات',
  revenues: 'الإيرادات',
  salaries: 'الرواتب',
  quotations: 'العروض السعرية',
  clients: 'العملاء',
  suppliers: 'الموردين',
  maintenance: 'الصيانة',
  'spare-parts': 'قطع الغيار',
  housing: 'السكن العمالي',
  reports: 'التقارير',
  settings: 'الإعدادات',
  'project-templates': 'قوالب المشاريع',
  'project-phases': 'مراحل المشاريع',
  risks: 'إدارة المخاطر',
  documents: 'مستندات المشاريع',
  resources: 'تخصيص الموارد',
}

// Group labels
const GROUP_LABELS: Record<string, string> = {
  projects: 'المشاريع',
  workers: 'الموارد',
  expenses: 'المالية',
  quotations: 'إدارة المشاريع',
  maintenance: 'العمليات',
}

// Mock notifications
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'تنبيه صيانة',
    message: 'الرافعة رقم 3 تحتاج صيانة دورية',
    time: 'منذ 5 دقائق',
    type: 'warning',
    read: false,
  },
  {
    id: 2,
    title: 'مهام متأخرة',
    message: 'لديك 3 مهام متأخرة في مشروع الأبراج',
    time: 'منذ ساعة',
    type: 'error',
    read: false,
  },
  {
    id: 3,
    title: 'إيصال بنكي',
    message: 'تم استلام إيصال بنكي جديد',
    time: 'منذ 3 ساعات',
    type: 'success',
    read: true,
  },
  {
    id: 4,
    title: 'انتهاء إقامة',
    message: 'إقامة العامل أحمد محمد تنتهي خلال 7 أيام',
    time: 'منذ يوم',
    type: 'warning',
    read: false,
  },
]

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const appName = useConfig('general', 'app_name') || 'نظام ERP المقاولات'

  // Search state
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Notifications state
  const [unreadCount] = useState(3) // Mock unread count
  const [notifications] = useState(MOCK_NOTIFICATIONS)

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  // Handle search submit
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }, [searchQuery, router])

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: Array<{ href: string; label: string; isLast: boolean }> = []

    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const isLast = index === segments.length - 1

      // Try to get label from route labels
      let label = ROUTE_LABELS[segment] || segment

      // For dynamic routes (like /projects/[id]), show a more user-friendly label
      if (segment.match(/^[0-9a-f]{8}-/i)) {
        label = 'تفاصيل'
      }

      breadcrumbs.push({ href, label, isLast })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-700 bg-slate-900 px-6">
        {/* Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <ol className="flex items-center gap-2">
            <li>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-slate-400 hover:text-white"
              >
                <a href="/dashboard">
                  <Home className="h-4 w-4" />
                </a>
              </Button>
            </li>
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-slate-600" />
                {crumb.isLast ? (
                  <span className="font-medium text-white">{crumb.label}</span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-slate-400 hover:text-white"
                  >
                    <a href={crumb.href}>{crumb.label}</a>
                  </Button>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Search Trigger */}
        <div className="flex-1 flex justify-end md:justify-start">
          <Button
            variant="outline"
            className="hidden md:flex w-64 justify-start text-slate-400 bg-slate-800 border-slate-700 hover:bg-slate-700"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="ml-2 h-4 w-4" />
            <span>بحث...</span>
            <kbd className="me-auto flex h-5 select-none items-center gap-1 rounded border border-slate-600 bg-slate-700 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '+9' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>الإشعارات</span>
                {unreadCount > 0 && (
                  <span className="text-xs font-normal text-slate-400">
                    {unreadCount} جديد
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-sm">
                    لا توجد إشعارات
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className={cn(
                        'flex-col items-start gap-2 p-3 cursor-pointer',
                        !notif.read && 'bg-slate-800/50'
                      )}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-sm text-slate-400 mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 me-2 mt-1" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center justify-center text-sm text-blue-400 hover:text-blue-300">
                    عرض جميع الإشعارات
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>م</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm">المدير</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">المدير العام</p>
                  <p className="text-xs text-slate-400">admin@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="ml-2 h-4 w-4" />
                <span>الملف الشخصي</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>الإعدادات</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-400 cursor-pointer"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl px-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
              <div className="flex items-center border-b border-slate-700 px-4">
                <Search className="h-5 w-5 text-slate-400" />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="بحث في المشاريع، المهام، العاملين..."
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-slate-400"
                />
                <kbd className="flex h-5 select-none items-center gap-1 rounded border border-slate-600 bg-slate-700 px-1.5 font-mono text-[10px] font-medium text-slate-400">
                  <span className="text-xs">⌘</span>K
                </kbd>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="me-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="p-4">
                <p className="text-xs font-semibold text-slate-500 mb-3">
                  الإجراءات السريعة
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-2 px-3 bg-slate-700/50 border-slate-600"
                    asChild
                  >
                    <a href="/projects/new">
                      <span className="text-sm">+ مشروع جديد</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-2 px-3 bg-slate-700/50 border-slate-600"
                    asChild
                  >
                    <a href="/workers/new">
                      <span className="text-sm">+ عامل جديد</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-2 px-3 bg-slate-700/50 border-slate-600"
                    asChild
                  >
                    <a href="/quotations/new">
                      <span className="text-sm">+ عرض سعر</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-2 px-3 bg-slate-700/50 border-slate-600"
                    asChild
                  >
                    <a href="/reports">
                      <span className="text-sm">التقارير</span>
                    </a>
                  </Button>
                </div>
              </div>

              {/* Recent Searches */}
              {searchQuery && (
                <div className="border-t border-slate-700 p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-3">
                    نتائج البحث
                  </p>
                  <p className="text-sm text-slate-400 text-center py-4">
                    اضغط Enter للبحث عن "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
