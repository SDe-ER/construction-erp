'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Worker } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { WorkerForm } from '@/components/workers/WorkerForm'

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'نشط',
  INACTIVE: 'غير نشط',
  SUSPENDED: 'موقوف',
}

export default function WorkersPage() {
  const router = useRouter()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [nationalityFilter, setNationalityFilter] = useState<string>('all')
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    fetchWorkers()
  }, [])

  const fetchWorkers = async () => {
    try {
      const res = await fetch('/api/workers')
      const data = await res.json()
      setWorkers(data)
    } catch (error) {
      console.error('Error fetching workers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkerAdded = () => {
    setShowAddDialog(false)
    fetchWorkers()
  }

  const getExpiryBadge = (daysLeft: number | null) => {
    if (daysLeft === null) return null
    if (daysLeft < 30) {
      return (
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20" variant="outline">
          <AlertCircle className="h-3 w-3 ml-1" />
          {daysLeft} يوم
        </Badge>
      )
    }
    if (daysLeft < 90) {
      return (
        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20" variant="outline">
          {daysLeft} يوم
        </Badge>
      )
    }
    return null
  }

  const filteredWorkers = workers.filter((worker: any) => {
    const matchesSearch =
      search === '' ||
      worker.nameAr?.includes(search) ||
      worker.nameEn?.toLowerCase().includes(search.toLowerCase()) ||
      worker.idNumber?.includes(search) ||
      worker.phone?.includes(search)

    const matchesStatus = statusFilter === 'all' || worker.status === statusFilter
    const matchesNationality = nationalityFilter === 'all' || worker.nationality === nationalityFilter

    return matchesSearch && matchesStatus && matchesNationality
  })

  const uniqueNationalities = Array.from(new Set(workers.map((w: any) => w.nationality).filter(Boolean)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">العاملين</h1>
          <p className="text-slate-400 mt-1">إدارة بيانات ورواتب العاملين ({workers.length} عامل)</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="h-4 w-4" />
              عامل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">إضافة عامل جديد</DialogTitle>
            </DialogHeader>
            <WorkerForm onSuccess={handleWorkerAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="بحث بالاسم، رقم الهوية، أو الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border-slate-700 pr-10 text-white placeholder:text-slate-500"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-full sm:w-[150px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="ACTIVE">نشط</SelectItem>
            <SelectItem value="INACTIVE">غير نشط</SelectItem>
            <SelectItem value="SUSPENDED">موقوف</SelectItem>
          </SelectContent>
        </Select>

        <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-full sm:w-[150px]">
            <SelectValue placeholder="الجنسية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الجنسيات</SelectItem>
            {uniqueNationalities.map((nat) => (
              <SelectItem key={nat} value={nat as string}>
                {nat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-700 overflow-hidden bg-slate-800">
        <Table dir="rtl">
          <TableHeader className="bg-slate-900">
            <TableRow className="hover:bg-slate-900 border-slate-700">
              <TableHead className="text-slate-300">العامل</TableHead>
              <TableHead className="text-slate-300">الجنسية</TableHead>
              <TableHead className="text-slate-300">الراتب</TableHead>
              <TableHead className="text-slate-300">الحالة</TableHead>
              <TableHead className="text-slate-300">تنبيهات</TableHead>
              <TableHead className="text-slate-300 text-center">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : filteredWorkers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                  لا يوجد عمال
                </TableCell>
              </TableRow>
            ) : (
              filteredWorkers.map((worker: any) => (
                <TableRow
                  key={worker.id}
                  className="hover:bg-slate-700/50 border-slate-700 cursor-pointer"
                  onClick={() => router.push(`/workers/${worker.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={worker.profileImg} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {worker.nameAr?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{worker.nameAr}</p>
                        <p className="text-sm text-slate-400">{worker.nameEn || '-'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">{worker.nationality || '-'}</TableCell>
                  <TableCell className="text-slate-300">
                    {formatCurrency(worker.baseSalary)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        worker.status === 'ACTIVE'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }
                      variant="outline"
                    >
                      {STATUS_LABELS[worker.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {getExpiryBadge(worker.residenceDaysLeft)}
                      {getExpiryBadge(worker.idDaysLeft)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/workers/${worker.id}`)
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
    </div>
  )
}
