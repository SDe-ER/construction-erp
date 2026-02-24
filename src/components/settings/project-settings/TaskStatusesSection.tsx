'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Layers,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Check,
  X,
  Palette,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

// Default task statuses
const DEFAULT_STATUSES = [
  { id: 'TODO', name: 'للمفع', nameEn: 'TODO', color: '#64748b', icon: '📝', enabled: true, order: 0 },
  { id: 'IN_PROGRESS', name: 'قيد التنفيذ', nameEn: 'IN_PROGRESS', color: '#3b82f6', icon: '🔄', enabled: true, order: 1 },
  { id: 'IN_REVIEW', name: 'تحت المراجعة', nameEn: 'IN_REVIEW', color: '#f59e0b', icon: '👀', enabled: true, order: 2 },
  { id: 'ON_HOLD', name: 'معلقة', nameEn: 'ON_HOLD', color: '#ef4444', icon: '⏸️', enabled: true, order: 3 },
  { id: 'DONE', name: 'مكتملة', nameEn: 'DONE', color: '#22c55e', icon: '✅', enabled: true, order: 4 },
  { id: 'CANCELLED', name: 'ملغاة', nameEn: 'CANCELLED', color: '#94a3b8', icon: '❌', enabled: false, order: 5 },
]

// Available icons
const AVAILABLE_ICONS = [
  '📝', '🔄', '👀', '⏸️', '✅', '❌', '📋', '🎯', '⭐', '🔥', '💡', '🚀',
  '📌', '📍', '🏷️', '📊', '📈', '🔧', '⚙️', '🔨', '🛠️', '✨', '💫',
]

export function TaskStatusesSection() {
  const [statuses, setStatuses] = useState(DEFAULT_STATUSES)
  const [loading, setLoading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStatus, setEditingStatus] = useState<typeof DEFAULT_STATUSES[0] | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    color: '#3b82f6',
    icon: '📝',
  })

  // Fetch statuses from API
  useEffect(() => {
    fetchStatuses()
  }, [])

  const fetchStatuses = async () => {
    try {
      const res = await fetch('/api/settings?module=projects')
      const data = await res.json()
      if (data.success) {
        const savedStatuses = data.configs.task_statuses || DEFAULT_STATUSES
        setStatuses(savedStatuses)
      }
    } catch (error) {
      console.error('Error fetching statuses:', error)
    }
  }

  const saveStatuses = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            {
              module: 'projects',
              key: 'task_statuses',
              value: JSON.stringify(statuses),
            },
          ],
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success('تم حفظ حالات المهام بنجاح')
      } else {
        toast.error(data.error || 'فشل حفظ حالات المهام')
      }
    } catch (error) {
      toast.error('فشل حفظ حالات المهام')
    } finally {
      setLoading(false)
    }
  }

  const openAddDialog = () => {
    setEditingStatus(null)
    setFormData({ name: '', nameEn: '', color: '#3b82f6', icon: '📝' })
    setDialogOpen(true)
  }

  const openEditDialog = (status: typeof DEFAULT_STATUSES[0]) => {
    setEditingStatus(status)
    setFormData({
      name: status.name,
      nameEn: status.nameEn,
      color: status.color,
      icon: status.icon,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.nameEn.trim()) {
      toast.error('يرجى إدخال اسم الحالة بالعربي والإنجليزي')
      return
    }

    if (editingStatus) {
      // Update existing status
      setStatuses(statuses.map((s) =>
        s.id === editingStatus.id
          ? { ...s, name: formData.name, nameEn: formData.nameEn, color: formData.color, icon: formData.icon }
          : s
      ))
      toast.success('تم تحديث الحالة بنجاح')
    } else {
      // Add new status
      const newStatus = {
        id: `CUSTOM_${Date.now()}`,
        name: formData.name,
        nameEn: formData.nameEn,
        color: formData.color,
        icon: formData.icon,
        enabled: true,
        order: statuses.length,
      }
      setStatuses([...statuses, newStatus])
      toast.success('تم إضافة الحالة بنجاح')
    }

    setDialogOpen(false)
    await saveStatuses()
  }

  const toggleEnabled = async (id: string) => {
    const updated = statuses.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    )
    setStatuses(updated)
    await saveStatuses()
  }

  const deleteStatus = async (id: string) => {
    // Check if status is a default one (cannot delete default statuses)
    if (DEFAULT_STATUSES.some((s) => s.id === id)) {
      toast.error('لا يمكن حذف الحالات الافتراضية')
      return
    }

    setStatuses(statuses.filter((s) => s.id !== id))
    await saveStatuses()
    toast.success('تم حذف الحالة بنجاح')
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newStatuses = [...statuses]
    const draggedItem = newStatuses[draggedIndex]
    newStatuses.splice(draggedIndex, 1)
    newStatuses.splice(index, 0, draggedItem)

    // Update orders
    newStatuses.forEach((s, i) => (s.order = i))
    setStatuses(newStatuses)
    setDraggedIndex(index)
  }

  const handleDragEnd = async () => {
    setDraggedIndex(null)
    await saveStatuses()
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Layers className="h-5 w-5" />
              حالات المهام
            </CardTitle>
            <CardDescription>
              تخصيص حالات المهام التي تظهر في لوحة Kanban
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="h-4 w-4" />
                إضافة حالة
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>
                  {editingStatus ? 'تعديل الحالة' : 'إضافة حالة جديدة'}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  {editingStatus
                    ? 'تعديل بيانات الحالة الموجودة'
                    : 'إضافة حالة مخصصة جديدة للمهام'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nameAr">الاسم بالعربي</Label>
                    <Input
                      id="nameAr"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: قيد الانتظار"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameEn">الاسم بالإنجليزي</Label>
                    <Input
                      id="nameEn"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="مثال: PENDING"
                      className="bg-slate-900 border-slate-700 text-white"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>اللون</Label>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-slate-600"
                      style={{ backgroundColor: formData.color }}
                    />
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-12 w-20 cursor-pointer bg-slate-900 border-slate-700"
                    />
                    <Input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#3b82f6"
                      className="flex-1 bg-slate-900 border-slate-700 text-white font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>الأيقونة</Label>
                  <div className="grid grid-cols-12 gap-2">
                    {AVAILABLE_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={cn(
                          'h-10 text-xl rounded border-2 transition-all hover:scale-110',
                          formData.icon === icon
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-slate-600 bg-slate-900'
                        )}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <Label>معاينة</Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-700">
                    <span className="text-2xl">{formData.icon}</span>
                    <div
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: formData.color }}
                    >
                      {formData.name || 'اسم الحالة'}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="border-slate-600"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingStatus ? 'تحديث' : 'إضافة'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-slate-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow>
                <TableHead className="text-slate-400 w-12"></TableHead>
                <TableHead className="text-slate-400">الحالة</TableHead>
                <TableHead className="text-slate-400">الاسم بالإنجليزي</TableHead>
                <TableHead className="text-slate-400">اللون</TableHead>
                <TableHead className="text-slate-400 w-24 text-center">مفعّل</TableHead>
                <TableHead className="text-slate-400 w-32 text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statuses
                .sort((a, b) => a.order - b.order)
                .map((status, index) => (
                  <TableRow
                    key={status.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'border-slate-700',
                      draggedIndex === index && 'bg-slate-700/50'
                    )}
                  >
                    <TableCell className="text-slate-500 cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{status.icon}</span>
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{ backgroundColor: status.color }}
                        >
                          {status.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-400 font-mono text-sm">
                      {status.nameEn}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-slate-600"
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-slate-400 text-sm font-mono">{status.color}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={status.enabled}
                        onCheckedChange={() => toggleEnabled(status.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(status)}
                          className="h-8 w-8 text-slate-400 hover:text-white"
                        >
                          <Palette className="h-4 w-4" />
                        </Button>
                        {!DEFAULT_STATUSES.some((s) => s.id === status.id) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteStatus(status.id)}
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Info */}
        <div className="mt-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700">
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <GripVertical className="h-4 w-4" />
            اسحب الصفوف لتغيير ترتيب حالات المهام في لوحة Kanban
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
