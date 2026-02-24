'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Settings,
  Plus,
  Trash2,
  GripVertical,
  Loader2,
  Type,
  Hash,
  Calendar,
  List,
  CheckSquare,
  X,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Field types
const FIELD_TYPES = [
  { value: 'TEXT', label: 'نص', icon: Type, description: 'حقل نصي قصير' },
  { value: 'NUMBER', label: 'رقم', icon: Hash, description: 'رقم صحيح أو عشري' },
  { value: 'DATE', label: 'تاريخ', icon: Calendar, description: 'اختيار تاريخ' },
  { value: 'SELECT', label: 'قائمة', icon: List, description: 'اختيار من قائمة محددة' },
  { value: 'CHECKBOX', label: 'Checkbox', icon: CheckSquare, description: 'صح/خطأ' },
]

interface CustomField {
  id: string
  name: string
  nameEn: string
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'CHECKBOX'
  required: boolean
  defaultValue?: string | number | boolean
  options?: string[]
  order: number
}

export function CustomFieldsSection() {
  const [fields, setFields] = useState<CustomField[]>([])
  const [loading, setLoading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingField, setEditingField] = useState<CustomField | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    type: 'TEXT' as CustomField['type'],
    required: false,
    defaultValue: '',
    options: [''],
  })

  // Fetch custom fields from API
  useEffect(() => {
    fetchFields()
  }, [])

  const fetchFields = async () => {
    try {
      const res = await fetch('/api/settings?module=projects')
      const data = await res.json()
      if (data.success) {
        const savedFields = data.configs.task_custom_fields || []
        setFields(savedFields)
      }
    } catch (error) {
      console.error('Error fetching custom fields:', error)
    }
  }

  const saveFields = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            {
              module: 'projects',
              key: 'task_custom_fields',
              value: JSON.stringify(fields),
            },
          ],
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success('تم حفظ الحقول المخصصة بنجاح')
      } else {
        toast.error(data.error || 'فشل حفظ الحقول المخصصة')
      }
    } catch (error) {
      toast.error('فشل حفظ الحقول المخصصة')
    } finally {
      setLoading(false)
    }
  }

  const openAddDialog = () => {
    setEditingField(null)
    setFormData({
      name: '',
      nameEn: '',
      type: 'TEXT',
      required: false,
      defaultValue: '',
      options: [''],
    })
    setDialogOpen(true)
  }

  const openEditDialog = (field: CustomField) => {
    setEditingField(field)
    setFormData({
      name: field.name,
      nameEn: field.nameEn,
      type: field.type,
      required: field.required,
      defaultValue: String(field.defaultValue || ''),
      options: field.options || [''],
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.nameEn.trim()) {
      toast.error('يرجى إدخال اسم الحقل بالعربي والإنجليزي')
      return
    }

    if (formData.type === 'SELECT' && (!formData.options || formData.options.filter(Boolean).length < 2)) {
      toast.error('يجب إضافة خيارين على الأقل للقائمة')
      return
    }

    const fieldData: CustomField = {
      id: editingField?.id || `FIELD_${Date.now()}`,
      name: formData.name,
      nameEn: formData.nameEn,
      type: formData.type,
      required: formData.required,
      defaultValue: formData.type === 'CHECKBOX' ? formData.defaultValue === 'true' : formData.defaultValue,
      options: formData.type === 'SELECT' ? formData.options.filter(Boolean) : undefined,
      order: editingField?.order || fields.length,
    }

    if (editingField) {
      setFields(fields.map((f) => (f.id === editingField.id ? fieldData : f)))
      toast.success('تم تحديث الحقل بنجاح')
    } else {
      setFields([...fields, fieldData])
      toast.success('تم إضافة الحقل بنجاح')
    }

    setDialogOpen(false)
    await saveFields()
  }

  const deleteField = async (id: string) => {
    setFields(fields.filter((f) => f.id !== id))
    await saveFields()
    toast.success('تم حذف الحقل بنجاح')
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newFields = [...fields]
    const draggedItem = newFields[draggedIndex]
    newFields.splice(draggedIndex, 1)
    newFields.splice(index, 0, draggedItem)

    newFields.forEach((f, i) => (f.order = i))
    setFields(newFields)
    setDraggedIndex(index)
  }

  const handleDragEnd = async () => {
    setDraggedIndex(null)
    await saveFields()
  }

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] })
  }

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    })
  }

  const updateOption = (index: number, value: string) => {
    setFormData({
      ...formData,
      options: formData.options.map((opt, i) => (i === index ? value : opt)),
    })
  }

  const moveOption = (index: number, direction: 'up' | 'down') => {
    const newOptions = [...formData.options]
    if (direction === 'up' && index > 0) {
      [newOptions[index - 1], newOptions[index]] = [newOptions[index], newOptions[index - 1]]
    } else if (direction === 'down' && index < newOptions.length - 1) {
      [newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]]
    }
    setFormData({ ...formData, options: newOptions })
  }

  const getFieldIcon = (type: CustomField['type']) => {
    const fieldType = FIELD_TYPES.find((t) => t.value === type)
    const Icon = fieldType?.icon || Type
    return <Icon className="h-4 w-4" />
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              الحقول المخصصة للمهام
            </CardTitle>
            <CardDescription>
              أضف حقول مخصصة لتظهر في نموذج إنشاء وتعديل المهام
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="h-4 w-4" />
                إضافة حقل
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingField ? 'تعديل الحقل' : 'إضافة حقل جديد'}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  {editingField
                    ? 'تعديل بيانات الحقل الموجود'
                    : 'إضافة حقل مخصص جديد للمهام'}
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
                      placeholder="مثال: العميل"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameEn">الاسم بالإنجليزي</Label>
                    <Input
                      id="nameEn"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="مثال: Client"
                      className="bg-slate-900 border-slate-700 text-white"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>نوع الحقل</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {FIELD_TYPES.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.value as any })}
                          className={cn(
                            'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all',
                            formData.type === type.value
                              ? 'border-blue-500 bg-blue-500/10 text-white'
                              : 'border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{type.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultValue">القيمة الافتراضية</Label>
                  {formData.type === 'CHECKBOX' ? (
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={formData.defaultValue === 'true'}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, defaultValue: checked ? 'true' : 'false' })
                        }
                      />
                      <span className="text-sm text-slate-400">
                        {formData.defaultValue === 'true' ? 'مفعّل' : 'معطّل'}
                      </span>
                    </div>
                  ) : formData.type === 'SELECT' ? (
                    <Select
                      value={formData.defaultValue}
                      onValueChange={(value) => setFormData({ ...formData, defaultValue: value })}
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="اختر القيمة الافتراضية" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {formData.options.filter(Boolean).map((option, i) => (
                          <SelectItem key={i} value={option} className="text-white">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="defaultValue"
                      value={formData.defaultValue}
                      onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                      placeholder="القيمة الافتراضية"
                      className="bg-slate-900 border-slate-700 text-white"
                      type={formData.type === 'NUMBER' ? 'number' : 'text'}
                    />
                  )}
                </div>

                {formData.type === 'SELECT' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>خيارات القائمة</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOption}
                        className="border-slate-600"
                      >
                        <Plus className="h-4 w-4 ml-1" />
                        إضافة خيار
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-slate-500" />
                          <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`خيار ${index + 1}`}
                            className="flex-1 bg-slate-900 border-slate-700 text-white"
                          />
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => moveOption(index, 'up')}
                              disabled={index === 0}
                              className="h-8 w-8 text-slate-400"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => moveOption(index, 'down')}
                              disabled={index === formData.options.length - 1}
                              className="h-8 w-8 text-slate-400"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOption(index)}
                              disabled={formData.options.length <= 1}
                              className="h-8 w-8 text-red-400"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">حقل إلزامي</span>
                    <span className="text-xs text-slate-500">
                      (يجب على المستخدم إدخال قيمة لهذا الحقل)
                    </span>
                  </div>
                  <Switch
                    checked={formData.required}
                    onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
                  />
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
                  {editingField ? 'تحديث' : 'إضافة'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {fields.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">لا توجد حقول مخصصة</p>
            <p className="text-sm text-slate-500">
              أضف حقول مخصصة لتجميع بيانات إضافية في المهام
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {fields
              .sort((a, b) => a.order - b.order)
              .map((field, index) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-lg border-2 transition-all',
                    draggedIndex === index && 'bg-slate-700/50'
                  )}
                  style={{ borderColor: field.required ? '#3b82f6' : 'transparent' }}
                >
                  <div className="cursor-grab active:cursor-grabbing text-slate-500">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300">
                    {getFieldIcon(field.type)}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-white">{field.name}</p>
                    <p className="text-sm text-slate-400">{field.nameEn}</p>
                  </div>

                  <div className="text-sm text-slate-400">
                    {FIELD_TYPES.find((t) => t.value === field.type)?.label}
                  </div>

                  {field.required && (
                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs">
                      إلزامي
                    </span>
                  )}

                  {field.defaultValue !== undefined && field.defaultValue !== '' && (
                    <span className="text-xs text-slate-500">
                      افتراضي: {String(field.defaultValue)}
                    </span>
                  )}

                  {field.options && field.options.length > 0 && (
                    <div className="flex gap-1">
                      {field.options.slice(0, 3).map((opt, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-xs"
                        >
                          {opt}
                        </span>
                      ))}
                      {field.options.length > 3 && (
                        <span className="text-slate-500 text-xs">+{field.options.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(field)}
                      className="h-8 w-8 text-slate-400 hover:text-white"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteField(field.id)}
                      className="h-8 w-8 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
