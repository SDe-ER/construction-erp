'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ArrowUpDown,
  Search,
  Plus,
  LayoutGrid,
  List,
  Filter,
  X,
  Calendar,
  User,
  Flag,
  MoreVertical,
  Pencil,
  Trash2,
  MessageSquare,
  CheckSquare,
  Link2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { STATUS_LABELS } from '@/lib/constants'

// Task types (matching Prisma schema)
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'ON_HOLD' | 'DONE' | 'CANCELLED'
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  assignedTo?: string
  estimatedHours?: number
  actualHours?: number
  progressPct: number
  tags: string[]
  commentCount?: number
  checklistCount?: { total: number; completed: number }
  subtaskCount?: { total: number; completed: number }
  project?: string
  phase?: string
  createdAt: Date
}

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'تصميم المخططات المعمارية',
    description: 'إعداد المخططات المعمارية الأولية للبرج',
    status: 'DONE',
    priority: 'HIGH',
    dueDate: new Date('2024-02-15'),
    assignedTo: 'أحمد محمد',
    estimatedHours: 40,
    actualHours: 38,
    progressPct: 100,
    tags: ['تصميم', 'معماري'],
    commentCount: 5,
    checklistCount: { total: 8, completed: 8 },
    subtaskCount: { total: 3, completed: 3 },
    project: 'برج النخيل',
    phase: 'التصميم',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    title: 'حفر الأساسات',
    description: 'حفر الأساسات وتجهيز القواعد',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    dueDate: new Date('2024-03-01'),
    assignedTo: 'علي حسن',
    estimatedHours: 120,
    actualHours: 85,
    progressPct: 70,
    tags: ['تنفيذ', 'أساسات'],
    commentCount: 12,
    checklistCount: { total: 10, completed: 7 },
    subtaskCount: { total: 5, completed: 3 },
    project: 'برج النخيل',
    phase: 'التنفيذ',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    title: 'صب الخرسانة للطابق الأرضي',
    description: 'صب الخرسانة المسلحة للطابق الأرضي',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: new Date('2024-03-15'),
    assignedTo: 'خالد عبدالله',
    estimatedHours: 60,
    actualHours: 0,
    progressPct: 0,
    tags: ['تنفيذ', 'خرسانة'],
    commentCount: 3,
    checklistCount: { total: 6, completed: 0 },
    subtaskCount: { total: 2, completed: 0 },
    project: 'برج النخيل',
    phase: 'التنفيذ',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '4',
    title: 'توريد الحديد',
    description: 'توريد حديد التسليح للمشروع',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: new Date('2024-02-28'),
    assignedTo: 'سعيد الغامدي',
    estimatedHours: 20,
    actualHours: 15,
    progressPct: 75,
    tags: ['مشتريات', 'مواد'],
    commentCount: 8,
    checklistCount: { total: 4, completed: 3 },
    project: 'برج النخيل',
    phase: 'المشتريات',
    createdAt: new Date('2024-02-05'),
  },
  {
    id: '5',
    title: 'مراجعة المخططات الهيكلية',
    description: 'مراجعة واعتماد المخططات الهيكلية',
    status: 'IN_REVIEW',
    priority: 'HIGH',
    dueDate: new Date('2024-02-20'),
    assignedTo: 'مهندس سالم',
    estimatedHours: 16,
    actualHours: 14,
    progressPct: 90,
    tags: ['مراجعة', 'هيكلي'],
    commentCount: 6,
    checklistCount: { total: 5, completed: 5 },
    project: 'مجمع الياسمين',
    phase: 'التصميم',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '6',
    title: 'أعمال التكييف',
    description: 'تركيب نظام التكييف المركزي',
    status: 'ON_HOLD',
    priority: 'MEDIUM',
    dueDate: new Date('2024-04-01'),
    assignedTo: 'فريق التكييف',
    estimatedHours: 80,
    actualHours: 20,
    progressPct: 25,
    tags: ['كهرباء', 'ميكانيكا'],
    commentCount: 4,
    checklistCount: { total: 12, completed: 3 },
    project: 'مجمع الياسمين',
    phase: 'التمديدات',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '7',
    title: 'إنهاء الواجهات',
    description: 'أعمال إنهاء الواجهات الخارجية',
    status: 'TODO',
    priority: 'LOW',
    dueDate: new Date('2024-05-01'),
    assignedTo: 'فريق الإنشاءات',
    estimatedHours: 200,
    actualHours: 0,
    progressPct: 0,
    tags: ['إنهاء', 'واجهات'],
    commentCount: 2,
    checklistCount: { total: 15, completed: 0 },
    project: 'فندق الريتز',
    phase: 'الإنهاءات',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '8',
    title: 'تجهيز غرف القاعات',
    description: 'تجهيز قاعات المؤتمرات والمحاضرات',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: new Date('2024-03-20'),
    assignedTo: 'فريق النجارة',
    estimatedHours: 150,
    actualHours: 95,
    progressPct: 60,
    tags: ['إنهاء', 'نجارة'],
    commentCount: 10,
    checklistCount: { total: 20, completed: 12 },
    subtaskCount: { total: 4, completed: 2 },
    project: 'فندق الريتز',
    phase: 'الإنهاءات',
    createdAt: new Date('2024-02-12'),
  },
  {
    id: '9',
    title: 'فحص جودة الخرسانة',
    description: 'فحص جودة الخرسانة المسلحة',
    status: 'DONE',
    priority: 'MEDIUM',
    dueDate: new Date('2024-02-10'),
    assignedTo: 'مختبر الجودة',
    estimatedHours: 8,
    actualHours: 8,
    progressPct: 100,
    tags: ['جودة', 'فحص'],
    commentCount: 2,
    checklistCount: { total: 3, completed: 3 },
    project: 'طريق الملك عبدالله',
    phase: 'التنفيذ',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '10',
    title: 'رصف الطريق',
    description: 'رصف الطريق بالإسفلت',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    dueDate: new Date('2024-03-10'),
    assignedTo: 'فريق الرصف',
    estimatedHours: 100,
    actualHours: 45,
    progressPct: 45,
    tags: ['تنفيذ', 'رصف'],
    commentCount: 7,
    checklistCount: { total: 8, completed: 4 },
    subtaskCount: { total: 3, completed: 1 },
    project: 'طريق الملك عبدالله',
    phase: 'التنفيذ',
    createdAt: new Date('2024-02-05'),
  },
  {
    id: '11',
    title: 'تصميم الحدائق',
    description: 'تصميم تنسيق الحدائق المحيطة',
    status: 'TODO',
    priority: 'LOW',
    dueDate: new Date('2024-04-15'),
    estimatedHours: 30,
    actualHours: 0,
    progressPct: 0,
    tags: ['تصميم', 'حدائق'],
    commentCount: 1,
    checklistCount: { total: 5, completed: 0 },
    project: 'فيلا التراث',
    phase: 'التصميم',
    createdAt: new Date('2024-02-18'),
  },
  {
    id: '12',
    title: 'تركيب الأبواب والشبابيك',
    description: 'تركيب الأبواب والشبابيك الألمنيوم',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: new Date('2024-03-25'),
    assignedTo: 'فميل الألمونيوم',
    estimatedHours: 50,
    actualHours: 20,
    progressPct: 40,
    tags: ['إنهاء', 'أبواب'],
    commentCount: 5,
    checklistCount: { total: 10, completed: 4 },
    project: 'فيلا التراث',
    phase: 'الإنهاءات',
    createdAt: new Date('2024-02-20'),
  },
]

// Task status configuration
const TASK_COLUMNS: { status: TaskStatus; label: string; icon: React.ReactNode; color: string }[] = [
  {
    status: 'TODO',
    label: 'للتنفيذ',
    icon: <Circle className="h-4 w-4" />,
    color: 'border-slate-600 bg-slate-800/50',
  },
  {
    status: 'IN_PROGRESS',
    label: 'قيد التنفيذ',
    icon: <Clock className="h-4 w-4 text-blue-400" />,
    color: 'border-blue-600/50 bg-blue-950/30',
  },
  {
    status: 'IN_REVIEW',
    label: 'قيد المراجعة',
    icon: <ArrowUpDown className="h-4 w-4 text-purple-400" />,
    color: 'border-purple-600/50 bg-purple-950/30',
  },
  {
    status: 'ON_HOLD',
    label: 'معلقة',
    icon: <AlertCircle className="h-4 w-4 text-yellow-400" />,
    color: 'border-yellow-600/50 bg-yellow-950/30',
  },
  {
    status: 'DONE',
    label: 'مكتملة',
    icon: <CheckCircle2 className="h-4 w-4 text-green-400" />,
    color: 'border-green-600/50 bg-green-950/30',
  },
]

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: React.ReactNode }> = {
  LOW: { label: 'منخفضة', color: 'bg-slate-600/30 text-slate-400', icon: null },
  MEDIUM: { label: 'متوسطة', color: 'bg-blue-600/30 text-blue-400', icon: null },
  HIGH: { label: 'عالية', color: 'bg-orange-600/30 text-orange-400', icon: null },
  CRITICAL: { label: 'حرجة', color: 'bg-red-600/30 text-red-400', icon: <AlertCircle className="h-3 w-3" /> },
}

type ViewMode = 'kanban' | 'list'

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)

  // Get unique assignees
  const assignees = useMemo(() => {
    const unique = new Set<string>()
    mockTasks.forEach((task) => {
      if (task.assignedTo) unique.add(task.assignedTo)
    })
    return Array.from(unique).sort()
  }, [])

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return mockTasks.filter((task) => {
      const matchesSearch =
        !searchQuery ||
        task.title.includes(searchQuery) ||
        task.description?.includes(searchQuery) ||
        task.tags.some((tag) => tag.includes(searchQuery))

      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter
      const matchesAssignee = assigneeFilter === 'ALL' || task.assignedTo === assigneeFilter

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
    })
  }, [searchQuery, statusFilter, priorityFilter, assigneeFilter])

  // Group tasks by status for kanban
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      ON_HOLD: [],
      DONE: [],
      CANCELLED: [],
    }
    filteredTasks.forEach((task) => {
      grouped[task.status].push(task)
    })
    return grouped
  }, [filteredTasks])

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: mockTasks.length,
      todo: mockTasks.filter((t) => t.status === 'TODO').length,
      inProgress: mockTasks.filter((t) => t.status === 'IN_PROGRESS').length,
      inReview: mockTasks.filter((t) => t.status === 'IN_REVIEW').length,
      onHold: mockTasks.filter((t) => t.status === 'ON_HOLD').length,
      done: mockTasks.filter((t) => t.status === 'DONE').length,
      overdue: mockTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length,
    }
  }, [])

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setShowNewTaskModal(true)
  }

  const handleDeleteTask = (taskId: string) => {
    console.log('Delete task:', taskId)
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    console.log('Change status:', taskId, newStatus)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">المهام</h1>
          <p className="text-slate-400 mt-1">إدارة ومتابعة جميع مهام المشاريع</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 gap-2 w-full sm:w-auto"
          onClick={() => setShowNewTaskModal(true)}
        >
          <Plus className="h-4 w-4" />
          مهمة جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">الكل</span>
              <span className="text-2xl font-bold text-white">{stats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">للتنفيذ</span>
              <span className="text-2xl font-bold text-slate-300">{stats.todo}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-blue-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-400">قيد التنفيذ</span>
              <span className="text-2xl font-bold text-blue-400">{stats.inProgress}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-purple-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-400">مراجعة</span>
              <span className="text-2xl font-bold text-purple-400">{stats.inReview}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-yellow-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-400">معلقة</span>
              <span className="text-2xl font-bold text-yellow-400">{stats.onHold}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-green-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-400">مكتملة</span>
              <span className="text-2xl font-bold text-green-400">{stats.done}</span>
            </div>
          </CardContent>
        </Card>
        <Card className={cn("bg-slate-800 border", stats.overdue > 0 ? "border-red-600" : "border-slate-700")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className={cn("text-sm", stats.overdue > 0 ? "text-red-400" : "text-slate-400")}>متأخرة</span>
              <span className={cn("text-2xl font-bold", stats.overdue > 0 ? "text-red-400" : "text-white")}>{stats.overdue}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="البحث في المهام..."
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
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="w-[140px] bg-slate-900 border-slate-600">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="ALL">الكل</SelectItem>
                  <SelectItem value="TODO">للتنفيذ</SelectItem>
                  <SelectItem value="IN_PROGRESS">قيد التنفيذ</SelectItem>
                  <SelectItem value="IN_REVIEW">قيد المراجعة</SelectItem>
                  <SelectItem value="ON_HOLD">معلقة</SelectItem>
                  <SelectItem value="DONE">مكتملة</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as typeof priorityFilter)}>
                <SelectTrigger className="w-[140px] bg-slate-900 border-slate-600">
                  <SelectValue placeholder="الأولوية" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="ALL">الكل</SelectItem>
                  <SelectItem value="LOW">منخفضة</SelectItem>
                  <SelectItem value="MEDIUM">متوسطة</SelectItem>
                  <SelectItem value="HIGH">عالية</SelectItem>
                  <SelectItem value="CRITICAL">حرجة</SelectItem>
                </SelectContent>
              </Select>

              {/* Assignee Filter */}
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-[160px] bg-slate-900 border-slate-600">
                  <SelectValue placeholder="المسؤول" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="ALL">الكل</SelectItem>
                  {assignees.map((assignee) => (
                    <SelectItem key={assignee} value={assignee}>
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex rounded-lg bg-slate-900 p-1">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  )}
                >
                  كانبان
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  )}
                >
                  قائمة
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {(searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || assigneeFilter !== 'ALL') && (
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
              الحالة: {TASK_COLUMNS.find((c) => c.status === statusFilter)?.label}
              <button onClick={() => setStatusFilter('ALL')} className="hover:text-red-400">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {priorityFilter !== 'ALL' && (
            <Badge variant="secondary" className="bg-slate-700 text-white gap-1">
              الأولوية: {PRIORITY_CONFIG[priorityFilter].label}
              <button onClick={() => setPriorityFilter('ALL')} className="hover:text-red-400">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {assigneeFilter !== 'ALL' && (
            <Badge variant="secondary" className="bg-slate-700 text-white gap-1">
              المسؤول: {assigneeFilter}
              <button onClick={() => setAssigneeFilter('ALL')} className="hover:text-red-400">
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
              setPriorityFilter('ALL')
              setAssigneeFilter('ALL')
            }}
            className="text-slate-400 hover:text-white"
          >
            مسح الكل
          </Button>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {TASK_COLUMNS.map((column) => {
            const tasks = tasksByStatus[column.status]
            return (
              <div key={column.status} className="flex-shrink-0 w-80">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {column.icon}
                    <span className="font-semibold text-white">{column.label}</span>
                    <Badge variant="secondary" className="bg-slate-700 text-white">
                      {tasks.length}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      لا توجد مهام
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
          {filteredTasks.length === 0 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="py-16 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">لا توجد مهام</h3>
                <p className="text-slate-400">
                  {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || assigneeFilter !== 'ALL'
                    ? 'لم يتم العثور على مهام تطابق البحث'
                    : 'ابدأ بإضافة مهمة جديدة'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* New Task Modal (Simplified) */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {selectedTask ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
                </h2>
                <button
                  onClick={() => {
                    setShowNewTaskModal(false)
                    setSelectedTask(null)
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    عنوان المهمة *
                  </label>
                  <Input
                    placeholder="أدخل عنوان المهمة"
                    defaultValue={selectedTask?.title}
                    className="bg-slate-900 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    الوصف
                  </label>
                  <textarea
                    placeholder="وصف المهمة..."
                    rows={3}
                    defaultValue={selectedTask?.description}
                    className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      المشروع
                    </label>
                    <Select>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                        <SelectValue placeholder="اختر المشروع" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1">برج النخيل</SelectItem>
                        <SelectItem value="2">مجمع الياسمين</SelectItem>
                        <SelectItem value="3">طريق الملك عبدالله</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      المسؤول
                    </label>
                    <Select>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                        <SelectValue placeholder="اختر المسؤول" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {assignees.map((assignee) => (
                          <SelectItem key={assignee} value={assignee}>
                            {assignee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      الحالة
                    </label>
                    <Select defaultValue={selectedTask?.status || 'TODO'}>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="TODO">للتنفيذ</SelectItem>
                        <SelectItem value="IN_PROGRESS">قيد التنفيذ</SelectItem>
                        <SelectItem value="IN_REVIEW">قيد المراجعة</SelectItem>
                        <SelectItem value="ON_HOLD">معلقة</SelectItem>
                        <SelectItem value="DONE">مكتملة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      الأولوية
                    </label>
                    <Select defaultValue={selectedTask?.priority || 'MEDIUM'}>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="LOW">منخفضة</SelectItem>
                        <SelectItem value="MEDIUM">متوسطة</SelectItem>
                        <SelectItem value="HIGH">عالية</SelectItem>
                        <SelectItem value="CRITICAL">حرجة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      تاريخ الاستحقاق
                    </label>
                    <Input
                      type="date"
                      defaultValue={selectedTask?.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : ''}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      الساعات المقدرة
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      defaultValue={selectedTask?.estimatedHours}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      نسبة الإنجاز %
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      defaultValue={selectedTask?.progressPct || 0}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    {selectedTask ? 'حفظ التغييرات' : 'إنشاء المهمة'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewTaskModal(false)
                      setSelectedTask(null)
                    }}
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

// Task Card Component (for Kanban)
function TaskCard({ task, onEdit, onDelete, onStatusChange }: {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
}) {
  const priority = PRIORITY_CONFIG[task.priority]
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE'

  return (
    <Card className={cn(
      "bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-all cursor-pointer group",
      isOverdue && "border-red-600/50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge className={priority.color} variant="secondary">
            {priority.icon}
            <span className="mr-1">{priority.label}</span>
          </Badge>
          <button
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        <h4 className={cn(
          "font-medium text-white mb-2",
          task.status === 'DONE' && "line-through text-slate-400"
        )}>
          {task.title}
        </h4>

        {task.description && (
          <p className="text-sm text-slate-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Progress Bar */}
        {task.progressPct > 0 && (
          <div className="mb-3">
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all"
                style={{ width: `${task.progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-slate-400">+{task.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1",
                isOverdue ? "text-red-400" : ""
              )}>
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.dueDate).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="max-w-[80px] truncate">{task.assignedTo}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {task.commentCount && task.commentCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{task.commentCount}</span>
              </div>
            )}
            {task.checklistCount && task.checklistCount.total > 0 && (
              <div className="flex items-center gap-1">
                <CheckSquare className="h-3 w-3" />
                <span>{task.checklistCount.completed}/{task.checklistCount.total}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700">
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 h-7 text-xs"
            onClick={() => onEdit(task)}
          >
            <Pencil className="h-3 w-3 ml-1" />
            تعديل
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Task List Item Component
function TaskListItem({ task, onEdit, onDelete, onStatusChange }: {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
}) {
  const priority = PRIORITY_CONFIG[task.priority]
  const statusConfig = TASK_COLUMNS.find((c) => c.status === task.status)
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE'

  return (
    <Card className={cn(
      "bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-colors",
      isOverdue && "border-red-600/50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Status Icon - Clickable */}
          <button
            onClick={() => {
              const nextStatus: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']
              const currentIndex = nextStatus.indexOf(task.status)
              if (currentIndex < nextStatus.length - 1) {
                onStatusChange(task.id, nextStatus[currentIndex + 1])
              }
            }}
            className="mt-1 text-slate-400 hover:text-white transition-colors"
          >
            {statusConfig?.icon}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className={cn(
                  "font-medium text-white",
                  task.status === 'DONE' && "line-through text-slate-400"
                )}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge className={priority.color} variant="secondary">
                  {priority.label}
                </Badge>
                <Badge className={cn("text-white", statusConfig?.color)} variant="outline">
                  {statusConfig?.label}
                </Badge>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
              {task.project && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">{task.project}</span>
                  {task.phase && <span>› {task.phase}</span>}
                </span>
              )}
              {task.assignedTo && (
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {task.assignedTo}
                </span>
              )}
              {task.dueDate && (
                <span className={cn(
                  "flex items-center gap-1",
                  isOverdue ? "text-red-400" : ""
                )}>
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                </span>
              )}
              {task.estimatedHours && (
                <span>
                  {task.actualHours || 0} / {task.estimatedHours} ساعة
                </span>
              )}
            </div>

            {/* Progress */}
            {task.progressPct > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>نسبة الإنجاز</span>
                  <span>{task.progressPct}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${task.progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {task.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
