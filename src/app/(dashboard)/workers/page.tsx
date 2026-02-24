'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Users,
  Search,
  Plus,
  LayoutGrid,
  List,
  X,
  AlertCircle,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  Star,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate } from '@/lib/utils'

// Worker types
type WorkerStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

interface Worker {
  id: string
  nameAr: string
  nameEn?: string
  phone: string
  nationality?: string
  birthDate?: Date
  joinDate: Date
  baseSalary: number
  foodAllowance: number
  residenceNumber?: string
  residenceExpiry?: Date
  residenceDaysLeft?: number
  idNumber: string
  idExpiry?: Date
  idDaysLeft?: number
  licenseNumber?: string
  licenseExpiry?: Date
  profileImg?: string
  status: WorkerStatus
  rating: number
  notes?: string
  currentProject?: string
  currentRole?: string
  housing?: string
  totalOvertime?: number
  totalAbsent?: number
}

// Mock workers data
const mockWorkers: Worker[] = [
  {
    id: '1',
    nameAr: 'أحمد محمد علي',
    nameEn: 'Ahmed Mohamed Ali',
    phone: '+966501234567',
    nationality: 'مصري',
    birthDate: new Date('1985-05-15'),
    joinDate: new Date('2022-03-01'),
    baseSalary: 2500,
    foodAllowance: 500,
    residenceNumber: 'A12345678',
    residenceExpiry: new Date('2024-06-15'),
    residenceDaysLeft: 112,
    idNumber: '28505151234567',
    idExpiry: new Date('2024-12-01'),
    idDaysLeft: 281,
    licenseNumber: 'L789456',
    licenseExpiry: new Date('2024-08-20'),
    profileImg: '',
    status: 'ACTIVE',
    rating: 4.5,
    currentProject: 'برج النخيل',
    currentRole: 'مشرف',
    housing: 'السكن 1 - غرفة 3',
    totalOvertime: 4500,
    totalAbsent: 2,
  },
  {
    id: '2',
    nameAr: 'محمد حسن إبراهيم',
    nameEn: 'Mohamed Hassan Ibrahim',
    phone: '+966502345678',
    nationality: 'مصري',
    birthDate: new Date('1990-08-20'),
    joinDate: new Date('2023-01-15'),
    baseSalary: 2000,
    foodAllowance: 400,
    residenceNumber: 'A98765432',
    residenceExpiry: new Date('2024-04-10'),
    residenceDaysLeft: 45,
    idNumber: '29008201234567',
    idExpiry: new Date('2025-01-15'),
    idDaysLeft: 326,
    status: 'ACTIVE',
    rating: 4.0,
    currentProject: 'مجمع الياسمين',
    currentRole: 'سباك',
    housing: 'السكن 2 - غرفة 5',
    totalOvertime: 2800,
    totalAbsent: 5,
  },
  {
    id: '3',
    nameAr: 'عبدالله خالد العمري',
    nameEn: 'Abdullah Al-Omari',
    phone: '+966503456789',
    nationality: 'سعودي',
    birthDate: new Date('1992-03-10'),
    joinDate: new Date('2021-06-01'),
    baseSalary: 4000,
    foodAllowance: 600,
    residenceNumber: 'SA1234567',
    residenceExpiry: new Date('2025-12-31'),
    residenceDaysLeft: 677,
    idNumber: '1030310123',
    idExpiry: new Date('2026-06-01'),
    idDaysLeft: 863,
    status: 'ACTIVE',
    rating: 4.8,
    currentProject: 'فندق الريتز',
    currentRole: 'مهندس',
    housing: '-',
    totalOvertime: 1200,
    totalAbsent: 0,
  },
  {
    id: '4',
    nameAr: 'راشد محمد السعيد',
    nameEn: 'Rashed Al-Saeed',
    phone: '+966504567890',
    nationality: 'سوداني',
    birthDate: new Date('1988-11-25'),
    joinDate: new Date('2022-09-01'),
    baseSalary: 1800,
    foodAllowance: 400,
    residenceNumber: 'B23456789',
    residenceExpiry: new Date('2024-03-20'),
    residenceDaysLeft: 25,
    idNumber: '28811251234567',
    idExpiry: new Date('2024-10-15'),
    idDaysLeft: 235,
    status: 'ACTIVE',
    rating: 3.5,
    currentProject: 'طريق الملك عبدالله',
    currentRole: 'عامل بناء',
    housing: 'السكن 1 - غرفة 1',
    totalOvertime: 1800,
    totalAbsent: 8,
  },
  {
    id: '5',
    nameAr: 'سالم عبدالله الغامدي',
    nameEn: 'Salem Al-Ghamdi',
    phone: '+966505678901',
    nationality: 'يمني',
    birthDate: new Date('1987-07-08'),
    joinDate: new Date('2021-12-01'),
    baseSalary: 2200,
    foodAllowance: 450,
    residenceNumber: 'Y34567890',
    residenceExpiry: new Date('2024-02-28'),
    residenceDaysLeft: 5,
    idNumber: '28707081234567',
    idExpiry: new Date('2024-07-20'),
    idDaysLeft: 147,
    status: 'ACTIVE',
    rating: 4.2,
    currentProject: 'فيلا التراث',
    currentRole: 'كهربائي',
    housing: 'السكن 3 - غرفة 2',
    totalOvertime: 3200,
    totalAbsent: 3,
  },
  {
    id: '6',
    nameAr: 'فيصل ناصر القحطاني',
    nameEn: 'Faisal Al-Qahtani',
    phone: '+966506789012',
    nationality: 'سعودي',
    birthDate: new Date('1995-02-14'),
    joinDate: new Date('2023-06-15'),
    baseSalary: 3500,
    foodAllowance: 550,
    residenceNumber: 'SA7654321',
    residenceExpiry: new Date('2026-05-01'),
    residenceDaysLeft: 798,
    idNumber: '1050214123',
    idExpiry: new Date('2027-02-14'),
    idDaysLeft: 1086,
    status: 'ACTIVE',
    rating: 4.6,
    currentProject: 'برج النخيل',
    currentRole: 'مساح',
    housing: '-',
    totalOvertime: 900,
    totalAbsent: 1,
  },
  {
    id: '7',
    nameAr: 'خالد إبراهيم المصري',
    nameEn: 'Khaled Ibrahim',
    phone: '+966507890123',
    nationality: 'مصري',
    birthDate: new Date('1983-09-30'),
    joinDate: new Date('2020-01-10'),
    baseSalary: 2800,
    foodAllowance: 500,
    residenceNumber: 'A45678901',
    residenceExpiry: new Date('2024-01-15'),
    residenceDaysLeft: -40,
    idNumber: '28309301234567',
    idExpiry: new Date('2024-11-20'),
    idDaysLeft: 270,
    status: 'ACTIVE',
    rating: 4.3,
    currentProject: 'مجمع الياسمين',
    currentRole: 'نجار',
    housing: 'السكن 2 - غرفة 8',
    totalOvertime: 5100,
    totalAbsent: 4,
  },
  {
    id: '8',
    nameAr: 'عمر فاروق',
    nameEn: 'Omar Farooq',
    phone: '+966508901234',
    nationality: 'باكستاني',
    birthDate: new Date('1989-04-12'),
    joinDate: new Date('2022-07-20'),
    baseSalary: 1900,
    foodAllowance: 400,
    residenceNumber: 'P56789012',
    residenceExpiry: new Date('2024-05-30'),
    residenceDaysLeft: 96,
    idNumber: '58904121234567',
    idExpiry: new Date('2025-03-15'),
    idDaysLeft: 385,
    status: 'ACTIVE',
    rating: 3.8,
    currentProject: 'فندق الريتز',
    currentRole: 'دهان',
    housing: 'السكن 1 - غرفة 4',
    totalOvertime: 2100,
    totalAbsent: 6,
  },
  {
    id: '9',
    nameAr: 'محمود حسن',
    nameEn: 'Mahmoud Hassan',
    phone: '+966509012345',
    nationality: 'سوري',
    birthDate: new Date('1986-12-05'),
    joinDate: new Date('2021-03-15'),
    baseSalary: 2400,
    foodAllowance: 450,
    residenceNumber: 'S67890123',
    residenceExpiry: new Date('2024-08-10'),
    residenceDaysLeft: 168,
    idNumber: '28612051234567',
    idExpiry: new Date('2024-09-25'),
    idDaysLeft: 214,
    status: 'ACTIVE',
    rating: 4.1,
    currentProject: 'طريق الملك عبدالله',
    currentRole: 'لحام',
    housing: 'السكن 3 - غرفة 6',
    totalOvertime: 3500,
    totalAbsent: 2,
  },
  {
    id: '10',
    nameAr: 'سعيد الدوسري',
    nameEn: 'Saeed Al-Dosari',
    phone: '+966510123456',
    nationality: 'سعودي',
    birthDate: new Date('1993-06-18'),
    joinDate: new Date('2023-02-01'),
    baseSalary: 3200,
    foodAllowance: 500,
    residenceNumber: 'SA89012345',
    residenceExpiry: new Date('2025-10-01'),
    residenceDaysLeft: 585,
    idNumber: '1060618123',
    idExpiry: new Date('2026-06-18'),
    idDaysLeft: 880,
    status: 'INACTIVE',
    rating: 4.4,
    housing: '-',
    totalOvertime: 500,
    totalAbsent: 0,
  },
  {
    id: '11',
    nameAr: 'يوسف كمال',
    nameEn: 'Yousef Kamal',
    phone: '+966511234567',
    nationality: 'أردني',
    birthDate: new Date('1991-10-22'),
    joinDate: new Date('2022-05-10'),
    baseSalary: 2600,
    foodAllowance: 480,
    residenceNumber: 'J90123456',
    residenceExpiry: new Date('2024-11-15'),
    residenceDaysLeft: 265,
    idNumber: '29110221234567',
    idExpiry: new Date('2025-05-20'),
    idDaysLeft: 456,
    status: 'ACTIVE',
    rating: 4.0,
    currentProject: 'فيلا التراث',
    currentRole: 'مبلط',
    housing: 'السكن 2 - غرفة 3',
    totalOvertime: 2700,
    totalAbsent: 3,
  },
  {
    id: '12',
    nameAr: 'عادل الرحمن',
    nameEn: 'Adel Rahman',
    phone: '+966512345678',
    nationality: 'بنغلاديشي',
    birthDate: new Date('1984-03-28'),
    joinDate: new Date('2020-08-01'),
    baseSalary: 1700,
    foodAllowance: 350,
    residenceNumber: 'B01234567',
    residenceExpiry: new Date('2024-01-10'),
    residenceDaysLeft: -45,
    idNumber: '48403281234567',
    idExpiry: new Date('2024-06-30'),
    idDaysLeft: 127,
    status: 'SUSPENDED',
    rating: 3.2,
    housing: 'السكن 1 - غرفة 7',
    totalOvertime: 1500,
    totalAbsent: 15,
  },
]

const STATUS_LABELS: Record<WorkerStatus, string> = {
  ACTIVE: 'نشط',
  INACTIVE: 'غير نشط',
  SUSPENDED: 'موقوف',
}

const STATUS_COLORS: Record<WorkerStatus, string> = {
  ACTIVE: 'bg-green-500/10 text-green-400 border-green-500/20',
  INACTIVE: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  SUSPENDED: 'bg-red-500/10 text-red-400 border-red-500/20',
}

type ViewMode = 'grid' | 'list'

export default function WorkersPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<WorkerStatus | 'ALL'>('ALL')
  const [nationalityFilter, setNationalityFilter] = useState<string>('ALL')
  const [projectFilter, setProjectFilter] = useState<string>('ALL')
  const [showNewWorkerModal, setShowNewWorkerModal] = useState(false)

  // Get unique values for filters
  const uniqueNationalities = useMemo(() => {
    return Array.from(new Set(mockWorkers.map((w) => w.nationality).filter(Boolean))).sort()
  }, [])

  const uniqueProjects = useMemo(() => {
    return Array.from(new Set(mockWorkers.map((w) => w.currentProject).filter(Boolean))).sort()
  }, [])

  // Calculate stats
  const stats = useMemo(() => {
    const total = mockWorkers.length
    const active = mockWorkers.filter((w) => w.status === 'ACTIVE').length
    const inactive = mockWorkers.filter((w) => w.status === 'INACTIVE').length
    const suspended = mockWorkers.filter((w) => w.status === 'SUSPENDED').length
    const expiringSoon = mockWorkers.filter(
      (w) => w.residenceDaysLeft !== undefined && w.residenceDaysLeft < 30 && w.residenceDaysLeft > 0
    ).length
    const expired = mockWorkers.filter(
      (w) => w.residenceDaysLeft !== undefined && w.residenceDaysLeft <= 0
    ).length
    const totalSalary = mockWorkers.reduce((sum, w) => sum + w.baseSalary + w.foodAllowance, 0)

    return { total, active, inactive, suspended, expiringSoon, expired, totalSalary }
  }, [])

  // Filter workers
  const filteredWorkers = useMemo(() => {
    return mockWorkers.filter((worker) => {
      const matchesSearch =
        !searchQuery ||
        worker.nameAr.includes(searchQuery) ||
        (worker.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        worker.idNumber.includes(searchQuery) ||
        worker.phone.includes(searchQuery)

      const matchesStatus = statusFilter === 'ALL' || worker.status === statusFilter
      const matchesNationality = nationalityFilter === 'ALL' || worker.nationality === nationalityFilter
      const matchesProject = projectFilter === 'ALL' || worker.currentProject === projectFilter

      return matchesSearch && matchesStatus && matchesNationality && matchesProject
    })
  }, [searchQuery, statusFilter, nationalityFilter, projectFilter])

  const handleViewWorker = (workerId: string) => {
    router.push(`/workers/${workerId}`)
  }

  const handleEditWorker = (worker: Worker) => {
    console.log('Edit worker:', worker)
  }

  const handleDeleteWorker = (workerId: string) => {
    console.log('Delete worker:', workerId)
  }

  const getExpiryBadge = (daysLeft?: number, label?: string) => {
    if (daysLeft === undefined) return null
    if (daysLeft <= 0) {
      return (
        <Badge className="bg-red-600 text-white" variant="secondary">
          <AlertCircle className="h-3 w-3 ml-1" />
          منتهي {label ? `(${label})` : ''}
        </Badge>
      )
    }
    if (daysLeft < 30) {
      return (
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20" variant="outline">
          <AlertCircle className="h-3 w-3 ml-1" />
          {daysLeft} يوم {label ? `(${label})` : ''}
        </Badge>
      )
    }
    if (daysLeft < 90) {
      return (
        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20" variant="outline">
          {daysLeft} يوم {label ? `(${label})` : ''}
        </Badge>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">العاملين</h1>
          <p className="text-slate-400 mt-1">إدارة بيانات ورواتب العاملين</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 gap-2 w-full sm:w-auto"
          onClick={() => setShowNewWorkerModal(true)}
        >
          <Plus className="h-4 w-4" />
          عامل جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">الكل</span>
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">عامل</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-green-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-400">نشط</span>
              <Users className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400 mt-2">{stats.active}</p>
            <p className="text-xs text-slate-500 mt-1">عامل</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-slate-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">غير نشط</span>
              <Users className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-slate-400 mt-2">{stats.inactive}</p>
            <p className="text-xs text-slate-500 mt-1">عامل</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-red-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-400">موقوف</span>
              <Users className="h-5 w-5 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400 mt-2">{stats.suspended}</p>
            <p className="text-xs text-slate-500 mt-1">عامل</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-yellow-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-400">قارب الانتهاء</span>
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-400 mt-2">{stats.expiringSoon}</p>
            <p className="text-xs text-slate-500 mt-1">إقامة</p>
          </CardContent>
        </Card>
        <Card className="bg-red-900/20 border border-red-600/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-400">منتهية</span>
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400 mt-2">{stats.expired}</p>
            <p className="text-xs text-slate-500 mt-1">إقامة</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">إجمالي الرواتب</span>
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-xl font-bold text-green-400 mt-2">{formatCurrency(stats.totalSalary)}</p>
            <p className="text-xs text-slate-500 mt-1">شهرياً</p>
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
                placeholder="بحث بالاسم، رقم الهوية، أو الهاتف..."
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
                  <SelectItem value="ACTIVE">نشط</SelectItem>
                  <SelectItem value="INACTIVE">غير نشط</SelectItem>
                  <SelectItem value="SUSPENDED">موقوف</SelectItem>
                </SelectContent>
              </Select>

              {/* Nationality Filter */}
              <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
                <SelectTrigger className="w-[140px] bg-slate-900 border-slate-600">
                  <SelectValue placeholder="الجنسية" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="ALL">الكل</SelectItem>
                  {uniqueNationalities.map((nat) => (
                    <SelectItem key={nat} value={nat}>
                      {nat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Project Filter */}
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-[160px] bg-slate-900 border-slate-600">
                  <SelectValue placeholder="المشروع" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="ALL">الكل</SelectItem>
                  {uniqueProjects.map((proj) => (
                    <SelectItem key={proj} value={proj}>
                      {proj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex rounded-lg bg-slate-900 p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  )}
                >
                  جدول
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  )}
                >
                  بطاقات
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {(searchQuery || statusFilter !== 'ALL' || nationalityFilter !== 'ALL' || projectFilter !== 'ALL') && (
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
          {nationalityFilter !== 'ALL' && (
            <Badge variant="secondary" className="bg-slate-700 text-white gap-1">
              الجنسية: {nationalityFilter}
              <button onClick={() => setNationalityFilter('ALL')} className="hover:text-red-400">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {projectFilter !== 'ALL' && (
            <Badge variant="secondary" className="bg-slate-700 text-white gap-1">
              المشروع: {projectFilter}
              <button onClick={() => setProjectFilter('ALL')} className="hover:text-red-400">
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
              setNationalityFilter('ALL')
              setProjectFilter('ALL')
            }}
            className="text-slate-400 hover:text-white"
          >
            مسح الكل
          </Button>
        </div>
      )}

      {/* Content */}
      {viewMode === 'list' ? (
        /* Table View */
        <div className="rounded-lg border border-slate-700 overflow-hidden bg-slate-800">
          <Table dir="rtl">
            <TableHeader className="bg-slate-900">
              <TableRow className="hover:bg-slate-900 border-slate-700">
                <TableHead className="text-slate-300">العامل</TableHead>
                <TableHead className="text-slate-300">الجنسية</TableHead>
                <TableHead className="text-slate-300">المشروع الحالي</TableHead>
                <TableHead className="text-slate-300">الراتب</TableHead>
                <TableHead className="text-slate-300">الحالة</TableHead>
                <TableHead className="text-slate-300">تنبيهات</TableHead>
                <TableHead className="text-slate-300 text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-12">
                    لا يوجد عمال
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkers.map((worker) => (
                  <TableRow
                    key={worker.id}
                    className="hover:bg-slate-700/50 border-slate-700 cursor-pointer"
                    onClick={() => handleViewWorker(worker.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={worker.profileImg} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {worker.nameAr.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{worker.nameAr}</p>
                          <p className="text-sm text-slate-400">{worker.nameEn || '-'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{worker.nationality || '-'}</TableCell>
                    <TableCell className="text-slate-300">{worker.currentProject || '-'}</TableCell>
                    <TableCell className="text-slate-300">{formatCurrency(worker.baseSalary + worker.foodAllowance)}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[worker.status]} variant="outline">
                        {STATUS_LABELS[worker.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {getExpiryBadge(worker.residenceDaysLeft, 'إقامة')}
                        {getExpiryBadge(worker.idDaysLeft, 'هوية')}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewWorker(worker.id)
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        عرض
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* Grid View */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onView={handleViewWorker}
              onEdit={handleEditWorker}
              onDelete={handleDeleteWorker}
            />
          ))}
          {filteredWorkers.length === 0 && (
            <Card className="bg-slate-800 border-slate-700 col-span-full">
              <CardContent className="py-16 text-center">
                <Users className="mx-auto h-16 w-16 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">لا يوجد عمال</h3>
                <p className="text-slate-400">
                  {searchQuery || statusFilter !== 'ALL' || nationalityFilter !== 'ALL'
                    ? 'لم يتم العثور على عمال يطابقون البحث'
                    : 'ابدأ بإضافة عامل جديد'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* New Worker Modal (Simplified) */}
      {showNewWorkerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">إضافة عامل جديد</h2>
                <button
                  onClick={() => setShowNewWorkerModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      الاسم (عربي) *
                    </label>
                    <Input
                      placeholder="الاسم الكامل بالعربي"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      الاسم (إنجليزي)
                    </label>
                    <Input
                      placeholder="Full Name in English"
                      className="bg-slate-900 border-slate-600 text-white"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      الجنسية *
                    </label>
                    <Input
                      placeholder="الجنسية"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      رقم الهوية *
                    </label>
                    <Input
                      placeholder="رقم الهوية/الإقامة"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      رقم الهاتف *
                    </label>
                    <Input
                      placeholder="+9665XXXXXXXX"
                      className="bg-slate-900 border-slate-600 text-white"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      تاريخ الميلاد
                    </label>
                    <Input
                      type="date"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      تاريخ الانضمام *
                    </label>
                    <Input
                      type="date"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                </div>

                {/* Salary Info */}
                <div className="border-t border-slate-700 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-4">الراتب والبدلات</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        الراتب الأساسي *
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="bg-slate-900 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        بدل الطعام
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="bg-slate-900 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="border-t border-slate-700 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-4">الوثائق</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        رقم الإقامة
                      </label>
                      <Input
                        placeholder="رقم الإقامة"
                        className="bg-slate-900 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        تاريخ انتهاء الإقامة
                      </label>
                      <Input
                        type="date"
                        className="bg-slate-900 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        تاريخ انتهاء الهوية
                      </label>
                      <Input
                        type="date"
                        className="bg-slate-900 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        رقم رخصة القيادة
                      </label>
                      <Input
                        placeholder="رقم الرخصة"
                        className="bg-slate-900 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    إضافة العامل
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewWorkerModal(false)}
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

// Worker Card Component (for Grid View)
function WorkerCard({ worker, onView, onEdit, onDelete }: {
  worker: Worker
  onView: (id: string) => void
  onEdit: (worker: Worker) => void
  onDelete: (id: string) => void
}) {
  const statusColor = STATUS_COLORS[worker.status]
  const totalSalary = worker.baseSalary + worker.foodAllowance

  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer group">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={worker.profileImg} />
              <AvatarFallback className="bg-blue-600 text-white text-lg">
                {worker.nameAr.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-white">{worker.nameAr}</h4>
              {worker.nameEn && (
                <p className="text-sm text-slate-400">{worker.nameEn}</p>
              )}
            </div>
          </div>
          <Badge className={statusColor} variant="outline">
            {STATUS_LABELS[worker.status]}
          </Badge>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm">
          {worker.nationality && (
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="h-4 w-4 text-slate-400" />
              <span>{worker.nationality}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="h-4 w-4 text-slate-400" />
            <span dir="ltr">{worker.phone}</span>
          </div>
          {worker.currentProject && (
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="h-4 w-4 text-slate-400" />
              <span>{worker.currentProject}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-green-400">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">{formatCurrency(totalSalary)}</span>
          </div>
          {worker.rating > 0 && (
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <span>{worker.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Expiry Alerts */}
        {(worker.residenceDaysLeft !== undefined && worker.residenceDaysLeft < 90) ||
         (worker.idDaysLeft !== undefined && worker.idDaysLeft < 90) ? (
          <div className="flex flex-wrap gap-1 mt-3">
            {worker.residenceDaysLeft !== undefined && worker.residenceDaysLeft < 90 && (
              <Badge
                variant={worker.residenceDaysLeft <= 0 ? "destructive" : "secondary"}
                className={worker.residenceDaysLeft <= 0
                  ? "bg-red-600 text-white"
                  : worker.residenceDaysLeft < 30
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                }
              >
                الإقامة: {worker.residenceDaysLeft <= 0 ? 'منتهية' : `${worker.residenceDaysLeft} يوم`}
              </Badge>
            )}
            {worker.idDaysLeft !== undefined && worker.idDaysLeft < 90 && (
              <Badge
                variant={worker.idDaysLeft <= 0 ? "destructive" : "secondary"}
                className={worker.idDaysLeft <= 0
                  ? "bg-red-600 text-white"
                  : worker.idDaysLeft < 30
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                }
              >
                الهوية: {worker.idDaysLeft <= 0 ? 'منتهية' : `${worker.idDaysLeft} يوم`}
              </Badge>
            )}
          </div>
        ) : null}

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-700">
          <Button
            size="sm"
            variant="ghost"
            className="flex-1"
            onClick={() => onView(worker.id)}
          >
            <Eye className="h-4 w-4 ml-1" />
            عرض
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 opacity-0 group-hover:opacity-100"
            onClick={() => onEdit(worker)}
          >
            <Pencil className="h-4 w-4 ml-1" />
            تعديل
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
