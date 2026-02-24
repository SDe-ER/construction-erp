'use client'

import { useState, useMemo } from 'react'
import { StatCard } from '@/components/shared/StatCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectListItem } from '@/components/projects/ProjectListItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Search,
  Plus,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Project } from '@/types'
import { STATUS_LABELS } from '@/lib/constants'

// Mock data for demonstration
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'مشروع برج النخيل',
    code: 'PRJ-001',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-12-31'),
    status: 'ACTIVE',
    pricingType: 'METER',
    budget: 2500000,
    progress: 65,
    location: 'الرياض - حي الملقا',
    description: 'بناء برج سكني مكون من 20 طابق',
  },
  {
    id: '2',
    name: 'مشروع مجمع الياسمين',
    code: 'PRJ-002',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2025-06-30'),
    status: 'ACTIVE',
    pricingType: 'METER',
    budget: 5800000,
    progress: 42,
    location: 'جدة - أبحر الشمالية',
    description: 'مجمع سكني متكامل',
  },
  {
    id: '3',
    name: 'مشروع طريق الملك عبدالله',
    code: 'PRJ-003',
    startDate: new Date('2024-02-10'),
    endDate: new Date('2024-08-20'),
    status: 'COMPLETED',
    pricingType: 'METER',
    budget: 1200000,
    progress: 100,
    location: 'الدمام',
    description: 'تعبيد وتطوير طريق',
  },
  {
    id: '4',
    name: 'مشروع فيلا التراث',
    code: 'PRJ-004',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-10-15'),
    status: 'PAUSED',
    pricingType: 'HOURLY',
    budget: 450000,
    progress: 28,
    location: 'الرياض - حي النخيل',
    description: 'بناء فيلا مودرن',
  },
  {
    id: '5',
    name: 'مشروع مركز التسوق',
    code: 'PRJ-005',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2025-12-01'),
    status: 'PLANNING',
    pricingType: 'METER',
    budget: 15000000,
    progress: 0,
    location: 'الخبر',
    description: 'مركز تسوق تجاري',
  },
  {
    id: '6',
    name: 'مشروع بنك الأمناء',
    code: 'PRJ-006',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-09-30'),
    status: 'ACTIVE',
    pricingType: 'HOURLY',
    budget: 890000,
    progress: 78,
    location: 'الرياض - العليا',
    description: 'تشطيبات مكاتب بنك',
  },
  {
    id: '7',
    name: 'مشروع فندق الريتز',
    code: 'PRJ-007',
    startDate: new Date('2024-05-15'),
    endDate: new Date('2025-03-20'),
    status: 'ACTIVE',
    pricingType: 'METER',
    budget: 8500000,
    progress: 35,
    location: 'الرياض - حي الملك فهد',
    description: 'بناء فندق 5 نجوم',
  },
  {
    id: '8',
    name: 'مشروع مستشفى المدينة',
    code: 'PRJ-008',
    startDate: new Date('2024-03-20'),
    endDate: new Date('2025-01-15'),
    status: 'ACTIVE',
    pricingType: 'HOURLY',
    budget: 12000000,
    progress: 55,
    location: 'المدينة المنورة',
    description: 'بناء مستشفى خاص',
  },
]

type ViewMode = 'grid' | 'list'
type SortOption = 'name' | 'code' | 'startDate' | 'budget' | 'progress'
type StatusFilter = 'ALL' | 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED'

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('startDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const itemsPerPage = 6

  // Calculate stats
  const stats = useMemo(() => {
    const all = mockProjects.length
    const active = mockProjects.filter((p) => p.status === 'ACTIVE').length
    const planning = mockProjects.filter((p) => p.status === 'PLANNING').length
    const completed = mockProjects.filter((p) => p.status === 'COMPLETED').length
    const paused = mockProjects.filter((p) => p.status === 'PAUSED').length
    const totalBudget = mockProjects.reduce((sum, p) => sum + (p.budget || 0), 0)

    return { all, active, planning, completed, paused, totalBudget }
  }, [])

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...mockProjects]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.name.includes(searchQuery) ||
          project.code.includes(searchQuery) ||
          project.location?.includes(searchQuery)
      )
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'ar')
          break
        case 'code':
          comparison = a.code.localeCompare(b.code)
          break
        case 'startDate':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          break
        case 'budget':
          comparison = (a.budget || 0) - (b.budget || 0)
          break
        case 'progress':
          comparison = (a.progress || 0) - (b.progress || 0)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [searchQuery, statusFilter, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(option)
      setSortOrder('desc')
    }
  }

  const handleEdit = (project: Project) => {
    console.log('Edit project:', project)
    // TODO: Open edit modal
  }

  const handleDelete = (projectId: string) => {
    console.log('Delete project:', projectId)
    // TODO: Show confirmation and delete
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="المشاريع"
        description="إدارة جميع مشاريع الشركة"
        actions={
          <Button
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => setShowNewProjectModal(true)}
          >
            <Plus className="h-4 w-4" />
            مشروع جديد
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="جميع المشاريع" value={stats.all} icon={Building2} />
        <StatCard title="نشط" value={stats.active} icon={Building2} iconColor="text-green-400" />
        <StatCard title="قيد التخطيط" value={stats.planning} icon={Building2} iconColor="text-blue-400" />
        <StatCard title="مؤجل" value={stats.paused} icon={Building2} iconColor="text-yellow-400" />
        <StatCard title="مكتمل" value={stats.completed} icon={Building2} iconColor="text-gray-400" />
      </div>

      {/* Filters Bar */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="البحث باسم المشروع، الكود، أو الموقع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-slate-900 border-slate-600 text-white placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter Tabs */}
              <div className="flex rounded-lg bg-slate-900 p-1">
                {([
                  { value: 'ALL', label: 'الكل' },
                  { value: 'PLANNING', label: 'التخطيط' },
                  { value: 'ACTIVE', label: 'نشط' },
                  { value: 'PAUSED', label: 'مؤجل' },
                  { value: 'COMPLETED', label: 'مكتمل' },
                ] as const).map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => {
                      setStatusFilter(filter.value as StatusFilter)
                      setCurrentPage(1)
                    }}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                      statusFilter === filter.value
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Sort Select */}
              <Select
                value={sortBy}
                onValueChange={(value) => handleSort(value as SortOption)}
              >
                <SelectTrigger className="w-[140px] bg-slate-900 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="startDate">تاريخ البدء</SelectItem>
                  <SelectItem value="name">الاسم</SelectItem>
                  <SelectItem value="code">الكود</SelectItem>
                  <SelectItem value="budget">الميزانية</SelectItem>
                  <SelectItem value="progress">نسبة الإنجاز</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex rounded-lg bg-slate-900 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'rounded-md p-2 transition-colors',
                    viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'rounded-md p-2 transition-colors',
                    viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {(searchQuery || statusFilter !== 'ALL') && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-400">الفلاتر النشطة:</span>
          {searchQuery && (
            <Badge variant="secondary" className="bg-slate-700 text-white gap-1">
              بحث: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="hover:text-red-400">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {statusFilter !== 'ALL' && (
            <Badge variant="secondary" className="bg-slate-700 text-white gap-1">
              الحالة: {STATUS_LABELS[statusFilter]}
              <button onClick={() => setStatusFilter('ALL')} className="hover:text-red-400">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('ALL')
              setCurrentPage(1)
            }}
            className="text-slate-400 hover:text-white"
          >
            مسح الكل
          </Button>
        </div>
      )}

      {/* Projects Grid/List */}
      {paginatedProjects.length > 0 ? (
        <>
          <div
            className={cn(
              'grid gap-4',
              viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            )}
          >
            {paginatedProjects.map((project) =>
              viewMode === 'grid' ? (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  onView={handleEdit}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                عرض {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredProjects.length)} من{' '}
                {filteredProjects.length} مشروع
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          'w-8 h-8 rounded-md text-sm font-medium transition-colors',
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                        )}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-slate-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="py-16 text-center">
            <Building2 className="mx-auto h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">لا توجد مشاريع</h3>
            <p className="text-slate-400 mb-6">
              {searchQuery || statusFilter !== 'ALL'
                ? 'لم يتم العثور على مشاريع تطابق البحث'
                : 'ابدأ بإضافة مشروع جديد'}
            </p>
            {(!searchQuery && statusFilter === 'ALL') && (
              <Button
                className="bg-blue-600 hover:bg-blue-700 gap-2"
                onClick={() => setShowNewProjectModal(true)}
              >
                <Plus className="h-4 w-4" />
                إضافة مشروع
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* New Project Modal - Simplified for now */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">إضافة مشروع جديد</h2>
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      اسم المشروع *
                    </label>
                    <Input
                      placeholder="أدخل اسم المشروع"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      كود المشروع *
                    </label>
                    <Input
                      placeholder="PRJ-XXX"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    الموقع
                  </label>
                  <Input
                    placeholder="المدينة - الحي"
                    className="bg-slate-900 border-slate-600 text-white"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      نوع التسعير *
                    </label>
                    <Select>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                        <SelectValue placeholder="اختر نوع التسعير" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="METER">بالمتر</SelectItem>
                        <SelectItem value="HOURLY">بالساعة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      الميزانية
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      تاريخ البدء *
                    </label>
                    <Input
                      type="date"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      تاريخ الانتهاء المتوقع
                    </label>
                    <Input
                      type="date"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    الوصف
                  </label>
                  <textarea
                    placeholder="وصف المشروع..."
                    rows={3}
                    className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    إنشاء المشروع
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewProjectModal(false)}
                    className="flex-1 border-slate-600"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
