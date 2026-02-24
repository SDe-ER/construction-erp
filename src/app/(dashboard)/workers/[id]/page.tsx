'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowRight, Calendar, Phone, Globe, CreditCard, DollarSign, FileText, Star, Edit, Camera, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'نشط',
  INACTIVE: 'غير نشط',
  SUSPENDED: 'موقوف',
}

export default function WorkerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [worker, setWorker] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showSalaryDialog, setShowSalaryDialog] = useState(false)
  const [payingSalary, setPayingSalary] = useState(false)
  const [salaryForm, setSalaryForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    baseSalary: 0,
    foodAllowance: 0,
    overtimeTotal: 0,
    deductions: 0,
    absenceDays: 0,
    notes: '',
  })

  useEffect(() => {
    fetchWorker()
  }, [params.id])

  const fetchWorker = async () => {
    try {
      const res = await fetch(`/api/workers/${params.id}`)
      const data = await res.json()
      setWorker(data)
      // Initialize salary form with worker's default values
      setSalaryForm({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        baseSalary: data.baseSalary || 0,
        foodAllowance: data.foodAllowance || 0,
        overtimeTotal: 0,
        deductions: 0,
        absenceDays: 0,
        notes: '',
      })
    } catch (error) {
      console.error('Error fetching worker:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaySalary = async () => {
    setPayingSalary(true)
    try {
      const absenceDeduction = salaryForm.absenceDays > 0
        ? (salaryForm.baseSalary / 30) * salaryForm.absenceDays
        : 0

      const netSalary = salaryForm.baseSalary + salaryForm.foodAllowance + salaryForm.overtimeTotal - salaryForm.deductions - absenceDeduction

      const res = await fetch(`/api/workers/${params.id}/salary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...salaryForm,
          absenceDeduction,
          netSalary,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'فشل صرف الراتب')
      }

      toast.success('تم صرف الراتب بنجاح')
      setShowSalaryDialog(false)
      fetchWorker() // Refresh worker data
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    } finally {
      setPayingSalary(false)
    }
  }

  const openSalaryDialog = () => {
    setSalaryForm({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      baseSalary: worker?.baseSalary || 0,
      foodAllowance: worker?.foodAllowance || 0,
      overtimeTotal: 0,
      deductions: 0,
      absenceDays: 0,
      notes: '',
    })
    setShowSalaryDialog(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">جاري التحميل...</p>
      </div>
    )
  }

  if (!worker) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-slate-400">العامل غير موجود</p>
        <Button onClick={() => router.push('/workers')} className="bg-blue-600 hover:bg-blue-700">
          العودة للقائمة
        </Button>
      </div>
    )
  }

  const getExpiryBadge = (daysLeft: number | null, label: string) => {
    if (daysLeft === null) return null
    if (daysLeft < 0) {
      return (
        <Badge className="bg-red-500 text-white">منتهية ({Math.abs(daysLeft)} يوم)</Badge>
      )
    }
    if (daysLeft < 30) {
      return (
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
          {label}: {daysLeft} يوم
        </Badge>
      )
    }
    if (daysLeft < 90) {
      return (
        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
          {label}: {daysLeft} يوم
        </Badge>
      )
    }
    return (
      <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
        {label}: {daysLeft} يوم
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/workers')}
          className="text-slate-400 hover:text-white"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{worker.nameAr}</h1>
          <p className="text-slate-400 mt-1">{worker.nameEn || '-'}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Edit className="h-4 w-4" />
          تعديل
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-slate-700">
                <AvatarImage src={worker.profileImg} />
                <AvatarFallback className="bg-blue-600 text-white text-4xl">
                  {worker.nameAr?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 left-0 rounded-full h-8 w-8 bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            {/* Info */}
            <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-slate-400">رقم الهوية</p>
                <p className="text-white font-medium">{worker.idNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">الجنسية</p>
                <p className="text-white font-medium">{worker.nationality || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">تاريخ الميلاد</p>
                <p className="text-white font-medium">{formatDate(worker.birthDate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">رقم الهاتف</p>
                <p className="text-white font-medium">{worker.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">الراتب الأساسي</p>
                <p className="text-white font-medium">{formatCurrency(worker.baseSalary)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">البدلات</p>
                <p className="text-white font-medium">{formatCurrency(worker.foodAllowance)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">الحالة</p>
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
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">تاريخ الانضمام</p>
                <p className="text-white font-medium">{formatDate(worker.joinDate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">التقييم</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.floor(worker.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-slate-400 mr-2">({worker.rating || 0})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Expiry Badges */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-700">
            {getExpiryBadge(worker.residenceDaysLeft, 'الإقامة')}
            {getExpiryBadge(worker.idDaysLeft, 'الهوية')}
            {worker.licenseNumber && getExpiryBadge(worker.licenseDaysLeft, 'الرخصة')}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
          <TabsTrigger value="documents">المستندات</TabsTrigger>
          <TabsTrigger value="salaries">الرواتب</TabsTrigger>
          <TabsTrigger value="projects">المشاريع</TabsTrigger>
          <TabsTrigger value="attendance">الحضور</TabsTrigger>
          <TabsTrigger value="rating">التقييم</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">معلومات إضافية</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {worker.residenceNumber && (
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">رقم الإقامة</p>
                  <p className="text-white">{worker.residenceNumber}</p>
                </div>
              )}
              {worker.licenseNumber && (
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">رقم الرخصة</p>
                  <p className="text-white">{worker.licenseNumber}</p>
                </div>
              )}
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-slate-400">ملاحظات</p>
                <p className="text-white">{worker.notes || 'لا توجد ملاحظات'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* ID Card */}
            {worker.idImg && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">بطاقة الهوية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[1.585/1] bg-slate-900 rounded-lg overflow-hidden">
                    <img
                      src={worker.idImg}
                      alt="ID Card"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Residence Card */}
            {worker.residenceImg && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">بطاقة الإقامة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[1.585/1] bg-slate-900 rounded-lg overflow-hidden">
                    <img
                      src={worker.residenceImg}
                      alt="Residence Card"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* License */}
            {worker.licenseNumber && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">رخصة القيادة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[1.585/1] bg-slate-900 rounded-lg flex items-center justify-center">
                    <p className="text-slate-400">لا توجد صورة</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Salaries Tab */}
        <TabsContent value="salaries" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">سجل الرواتب</CardTitle>
              <Button onClick={openSalaryDialog} className="bg-blue-600 hover:bg-blue-700 gap-2">
                <DollarSign className="h-4 w-4" />
                صرف راتب
              </Button>
            </CardHeader>
            <CardContent>
              <Table dir="rtl">
                <TableHeader className="bg-slate-900">
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">الشهر</TableHead>
                    <TableHead className="text-slate-300">الراتب الأساسي</TableHead>
                    <TableHead className="text-slate-300">البدلات</TableHead>
                    <TableHead className="text-slate-300">الإضافي</TableHead>
                    <TableHead className="text-slate-300">الخصومات</TableHead>
                    <TableHead className="text-slate-300">صافي الراتب</TableHead>
                    <TableHead className="text-slate-300">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {worker.salaries?.length > 0 ? (
                    worker.salaries.map((salary: any) => (
                      <TableRow key={salary.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell className="text-slate-300">
                          {salary.month}/{salary.year}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {formatCurrency(salary.baseSalary)}
                        </TableCell>
                        <TableCell className="text-green-400">
                          +{formatCurrency(salary.foodAllowance)}
                        </TableCell>
                        <TableCell className="text-green-400">
                          +{formatCurrency(salary.overtimeTotal)}
                        </TableCell>
                        <TableCell className="text-red-400">
                          -{formatCurrency(salary.deductions + salary.absenceDeduction)}
                        </TableCell>
                        <TableCell className="text-white font-medium">
                          {formatCurrency(salary.netSalary)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={salary.isPaid ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}
                            variant="outline"
                          >
                            {salary.isPaid ? 'مدفوع' : 'غير مدفوع'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                        لا توجد سجلات رواتب
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">المشاريع</CardTitle>
            </CardHeader>
            <CardContent>
              {worker.projectWorkers?.length > 0 ? (
                <div className="space-y-3">
                  {worker.projectWorkers.map((pw: any) => (
                    <div
                      key={pw.id}
                      className="flex items-center justify-between p-4 bg-slate-900 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">{pw.project.name}</p>
                        <p className="text-sm text-slate-400">كود: {pw.project.code}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-slate-400">السعر اليومي</p>
                        <p className="text-white font-medium">{formatCurrency(pw.dailyRate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">لا توجد مشاريع</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">سجل الحضور</CardTitle>
            </CardHeader>
            <CardContent>
              <Table dir="rtl">
                <TableHeader className="bg-slate-900">
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">التاريخ</TableHead>
                    <TableHead className="text-slate-300">الحالة</TableHead>
                    <TableHead className="text-slate-300">المشروع</TableHead>
                    <TableHead className="text-slate-300">ملاحظات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {worker.attendanceRecords?.length > 0 ? (
                    worker.attendanceRecords.slice(0, 20).map((att: any) => (
                      <TableRow key={att.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell className="text-slate-300">{formatDate(att.date)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              att.status === 'PRESENT'
                                ? 'bg-green-500/10 text-green-400'
                                : att.status === 'ABSENT'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-yellow-500/10 text-yellow-400'
                            }
                            variant="outline"
                          >
                            {att.status === 'PRESENT' ? 'حاضر' : att.status === 'ABSENT' ? 'غائب' : 'نصف يوم'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{att.projectId || '-'}</TableCell>
                        <TableCell className="text-slate-300">{att.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                        لا توجد سجلات حضور
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rating Tab */}
        <TabsContent value="rating" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">التقييم العام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 ${
                        star <= Math.floor(worker.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-white">{worker.rating || 0}</span>
                <span className="text-slate-400">من 5</span>
              </div>
              <p className="text-slate-400">لا توجد تقييمات سابقة</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Salary Payment Dialog */}
      <Dialog open={showSalaryDialog} onOpenChange={setShowSalaryDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">صرف راتب شهر</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Month/Year Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">الشهر</Label>
                <select
                  value={salaryForm.month}
                  onChange={(e) => setSalaryForm({ ...salaryForm, month: parseInt(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-md p-2"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleDateString('ar-SA', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">السنة</Label>
                <Input
                  type="number"
                  value={salaryForm.year}
                  onChange={(e) => setSalaryForm({ ...salaryForm, year: parseInt(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="space-y-3 border-t border-slate-700 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">الراتب الأساسي</span>
                <span className="text-white font-medium">{formatCurrency(salaryForm.baseSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">البدلات</span>
                <span className="text-green-400">+{formatCurrency(salaryForm.foodAllowance)}</span>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">الإضافي (عمل إضافي)</Label>
                <Input
                  type="number"
                  value={salaryForm.overtimeTotal}
                  onChange={(e) => setSalaryForm({ ...salaryForm, overtimeTotal: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">الخصومات</Label>
                <Input
                  type="number"
                  value={salaryForm.deductions}
                  onChange={(e) => setSalaryForm({ ...salaryForm, deductions: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">أيام الغياب</Label>
                <Input
                  type="number"
                  min={0}
                  max={30}
                  value={salaryForm.absenceDays}
                  onChange={(e) => setSalaryForm({ ...salaryForm, absenceDays: parseInt(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="0"
                />
                {salaryForm.absenceDays > 0 && (
                  <p className="text-xs text-red-400">
                    خصم الغياب: {formatCurrency((salaryForm.baseSalary / 30) * salaryForm.absenceDays)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">ملاحظات</Label>
                <Input
                  value={salaryForm.notes}
                  onChange={(e) => setSalaryForm({ ...salaryForm, notes: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="أي ملاحظات..."
                />
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-slate-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-white">صافي الراتب</span>
                <span className="text-xl font-bold text-blue-400">
                  {formatCurrency(
                    salaryForm.baseSalary +
                    salaryForm.foodAllowance +
                    salaryForm.overtimeTotal -
                    salaryForm.deductions -
                    (salaryForm.baseSalary / 30) * salaryForm.absenceDays
                  )}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handlePaySalary}
                disabled={payingSalary}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {payingSalary ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الصرف...
                  </>
                ) : (
                  <>
                    <DollarSign className="ml-2 h-4 w-4" />
                    تأكيد الصرف
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowSalaryDialog(false)}
                variant="outline"
                disabled={payingSalary}
                className="border-slate-600"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
