'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Copy,
  Plus,
  FolderOpen,
  Layers,
  CheckCircle,
  Loader2,
  Trash2,
  Edit,
  Eye,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

interface TemplatePhase {
  name: string
  duration: number
  tasks: Array<{ title: string; priority: string }>
}

interface ProjectTemplate {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  phases: TemplatePhase[]
  isActive: boolean
  usageCount: number
}

interface ProjectSettingsProps {
  projectId?: string
}

// Available icons
const AVAILABLE_ICONS = [
  '🏗️', '🏢', '🏠', '🏭', '🏚️', '🏘️', '🏰', '🏯',
  '🌆', '🌇', '🏗️', '🔧', '⚙️', '🛠️', '🔨', '💼',
]

// Default colors
const DEFAULT_COLORS = [
  '#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
  '#22c55e', '#06b6d4', '#ec4899', '#f97316', '#6366f1',
]

export function ProjectTemplatesSection({ projectId }: ProjectSettingsProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState<ProjectTemplate[]>([])
  const [loading, setLoading] = useState(false)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🏗️',
    color: '#14b8a6',
    phases: [] as TemplatePhase[],
  })

  // Fetch templates from API
  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/project-templates')
      const data = await res.json()
      if (data.success) {
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const openAddDialog = () => {
    setSelectedTemplate(null)
    setFormData({
      name: '',
      description: '',
      icon: '🏗️',
      color: '#14b8a6',
      phases: [],
    })
    setDialogOpen(true)
  }

  const openEditDialog = (template: ProjectTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      description: template.description || '',
      icon: template.icon,
      color: template.color,
      phases: template.phases || [],
    })
    setDialogOpen(true)
  }

  const openViewDialog = (template: ProjectTemplate) => {
    setSelectedTemplate(template)
    setViewDialogOpen(true)
  }

  const addPhase = () => {
    setFormData({
      ...formData,
      phases: [
        ...formData.phases,
        { name: '', duration: 7, tasks: [{ title: '', priority: 'MEDIUM' }] },
      ],
    })
  }

  const updatePhase = (index: number, field: string, value: any) => {
    const newPhases = [...formData.phases]
    newPhases[index] = { ...newPhases[index], [field]: value }
    setFormData({ ...formData, phases: newPhases })
  }

  const removePhase = (index: number) => {
    setFormData({
      ...formData,
      phases: formData.phases.filter((_, i) => i !== index),
    })
  }

  const addTask = (phaseIndex: number) => {
    const newPhases = [...formData.phases]
    newPhases[phaseIndex].tasks.push({ title: '', priority: 'MEDIUM' })
    setFormData({ ...formData, phases: newPhases })
  }

  const updateTask = (phaseIndex: number, taskIndex: number, field: string, value: string) => {
    const newPhases = [...formData.phases]
    newPhases[phaseIndex].tasks[taskIndex] = {
      ...newPhases[phaseIndex].tasks[taskIndex],
      [field]: value,
    }
    setFormData({ ...formData, phases: newPhases })
  }

  const removeTask = (phaseIndex: number, taskIndex: number) => {
    const newPhases = [...formData.phases]
    newPhases[phaseIndex].tasks = newPhases[phaseIndex].tasks.filter((_, i) => i !== taskIndex)
    setFormData({ ...formData, phases: newPhases })
  }

  const saveTemplate = async () => {
    if (!formData.name.trim()) {
      toast.error('يرجى إدخال اسم القالب')
      return
    }

    if (formData.phases.length === 0) {
      toast.error('يجب إضافة مرحلة واحدة على الأقل')
      return
    }

    // Validate phases and tasks
    for (let i = 0; i < formData.phases.length; i++) {
      if (!formData.phases[i].name.trim()) {
        toast.error(`يرجى إدخال اسم المرحلة ${i + 1}`)
        return
      }
      for (let j = 0; j < formData.phases[i].tasks.length; j++) {
        if (!formData.phases[i].tasks[j].title.trim()) {
          toast.error(`يرجى إدخال اسم المهمة ${j + 1} في المرحلة ${i + 1}`)
          return
        }
      }
    }

    setLoading(true)
    try {
      const res = await fetch('/api/project-templates', {
        method: selectedTemplate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(selectedTemplate && { id: selectedTemplate.id }),
          ...formData,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(selectedTemplate ? 'تم تحديث القالب بنجاح' : 'تم إضافة القالب بنجاح')
        setDialogOpen(false)
        await fetchTemplates()
      } else {
        toast.error(data.error || 'فشل حفظ القالب')
      }
    } catch (error) {
      toast.error('فشل حفظ القالب')
    } finally {
      setLoading(false)
    }
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القالب؟')) return

    try {
      const res = await fetch(`/api/project-templates/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.success) {
        toast.success('تم حذف القالب بنجاح')
        await fetchTemplates()
      } else {
        toast.error(data.error || 'فشل حذف القالب')
      }
    } catch (error) {
      toast.error('فشل حذف القالب')
    }
  }

  const createProjectFromTemplate = async (templateId: string) => {
    try {
      const res = await fetch('/api/projects/from-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success('تم إنشاء المشروع بنجاح')
        router.push(`/projects/${data.project.id}`)
      } else {
        toast.error(data.error || 'فشل إنشاء المشروع')
      }
    } catch (error) {
      toast.error('فشل إنشاء المشروع')
    }
  }

  const saveCurrentProjectAsTemplate = async () => {
    if (!projectId) {
      toast.error('يجب فتح هذه الصفحة من سياق مشروع')
      return
    }

    try {
      const res = await fetch(`/api/projects/${projectId}/save-as-template`, {
        method: 'POST',
      })

      const data = await res.json()
      if (data.success) {
        toast.success('تم حفظ المشروع كقالب بنجاح')
        await fetchTemplates()
      } else {
        toast.error(data.error || 'فشل حفظ القالب')
      }
    } catch (error) {
      toast.error('فشل حفظ القالب')
    }
  }

  const getTotalTasks = (template: ProjectTemplate) => {
    return template.phases?.reduce((sum, phase) => sum + (phase.tasks?.length || 0), 0) || 0
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Copy className="h-5 w-5" />
                قوالب المشاريع
              </CardTitle>
              <CardDescription>
                أنشئ قوالب جاهزة للمشاريع لتسريع عملية الإنشاء
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {projectId && (
                <Button
                  onClick={saveCurrentProjectAsTemplate}
                  variant="outline"
                  className="border-slate-600"
                >
                  <CheckCircle className="h-4 w-4 ml-2" />
                  احفظ المشروع الحالي كقالب
                </Button>
              )}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Plus className="h-4 w-4" />
                    قالب جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedTemplate ? 'تعديل القالب' : 'إنشاء قالب جديد'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                      {selectedTemplate
                        ? 'تعديل بيانات القالب الموجود'
                        : 'إنشاء قالب مشروع جديد مع مراحل ومهام'}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-white">المعلومات الأساسية</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">اسم القالب</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="مثال: مشروع سكني متوسط"
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">الوصف</Label>
                          <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="وصف مختصر للقالب"
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>الأيقونة</Label>
                          <div className="flex gap-1 flex-wrap">
                            {AVAILABLE_ICONS.map((icon) => (
                              <button
                                key={icon}
                                type="button"
                                onClick={() => setFormData({ ...formData, icon })}
                                className={cn(
                                  'w-12 h-12 text-2xl rounded-lg border-2 transition-all hover:scale-110',
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
                        <div className="space-y-2">
                          <Label>اللون</Label>
                          <div className="flex gap-1 flex-wrap">
                            {DEFAULT_COLORS.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setFormData({ ...formData, color })}
                                className={cn(
                                  'w-12 h-12 rounded-lg border-2 transition-all hover:scale-110',
                                  formData.color === color
                                    ? 'border-white'
                                    : 'border-slate-600'
                                )}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phases */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">المراحل والمهام</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addPhase}
                          className="border-slate-600"
                        >
                          <Plus className="h-4 w-4 ml-1" />
                          إضافة مرحلة
                        </Button>
                      </div>

                      {formData.phases.map((phase, phaseIndex) => (
                        <div
                          key={phaseIndex}
                          className="p-4 rounded-lg bg-slate-900 border border-slate-700 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Layers className="h-4 w-4 text-slate-400" />
                              <Input
                                value={phase.name}
                                onChange={(e) => updatePhase(phaseIndex, 'name', e.target.value)}
                                placeholder={`اسم المرحلة ${phaseIndex + 1}`}
                                className="bg-slate-800 border-slate-600 text-white flex-1 max-w-xs"
                              />
                              <div className="flex items-center gap-2">
                                <Label className="text-slate-400 text-xs">المدة:</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  value={phase.duration}
                                  onChange={(e) => updatePhase(phaseIndex, 'duration', parseInt(e.target.value) || 1)}
                                  className="bg-slate-800 border-slate-600 text-white w-20"
                                  dir="ltr"
                                />
                                <span className="text-slate-400 text-xs">يوم</span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removePhase(phaseIndex)}
                              className="h-8 w-8 text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-2 mr-6">
                            {phase.tasks.map((task, taskIndex) => (
                              <div key={taskIndex} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-600" />
                                <Input
                                  value={task.title}
                                  onChange={(e) => updateTask(phaseIndex, taskIndex, 'title', e.target.value)}
                                  placeholder="اسم المهمة"
                                  className="flex-1 bg-slate-800 border-slate-600 text-white text-sm"
                                />
                                <Select
                                  value={task.priority}
                                  onValueChange={(value) => updateTask(phaseIndex, taskIndex, 'priority', value)}
                                >
                                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="LOW" className="text-white">منخفضة</SelectItem>
                                    <SelectItem value="MEDIUM" className="text-white">متوسطة</SelectItem>
                                    <SelectItem value="HIGH" className="text-white">عالية</SelectItem>
                                    <SelectItem value="CRITICAL" className="text-white">حرجة</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTask(phaseIndex, taskIndex)}
                                  className="h-7 w-7 text-red-400"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => addTask(phaseIndex)}
                              className="text-slate-400 hover:text-white"
                            >
                              <Plus className="h-4 w-4 ml-1" />
                              إضافة مهمة
                            </Button>
                          </div>
                        </div>
                      ))}

                      {formData.phases.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-lg">
                          <FolderOpen className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                          <p className="text-slate-400 mb-1">لا توجد مراحل بعد</p>
                          <p className="text-sm text-slate-500">
                            أضف مراحل ومهام لبناء القالب
                          </p>
                        </div>
                      )}
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
                      onClick={saveTemplate}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin ml-2" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 ml-2" />
                          حفظ القالب
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <Copy className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">لا توجد قوالب بعد</p>
              <p className="text-sm text-slate-500">
                أنشئ قوالب للمشاريع الشائعة لتسريع عملية الإنشاء
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-xl border-2 p-4 space-y-3 hover:border-slate-600 transition-colors"
                  style={{ borderColor: template.isActive ? template.color : 'transparent' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${template.color}20` }}
                      >
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{template.name}</h3>
                        {template.description && (
                          <p className="text-sm text-slate-400">{template.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="h-4 w-4" />
                      {template.phases?.length || 0} مراحل
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {getTotalTasks(template)} مهام
                    </span>
                  </div>

                  {template.usageCount > 0 && (
                    <span className="text-xs text-slate-500">
                      تم الاستخدام {template.usageCount} مرة
                    </span>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewDialog(template)}
                      className="flex-1 border-slate-600"
                    >
                      <Eye className="h-4 w-4 ml-1" />
                      عرض
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(template)}
                      className="border-slate-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTemplate(template.id)}
                      className="border-slate-600 text-red-400 hover:text-red-300"
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

      {/* View Template Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            {selectedTemplate?.description && (
              <DialogDescription className="text-slate-400">
                {selectedTemplate.description}
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              {selectedTemplate.phases?.map((phase, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedTemplate.color }}
                    />
                    <h4 className="font-semibold text-white">{phase.name}</h4>
                    <span className="text-sm text-slate-400">({phase.duration} يوم)</span>
                  </div>
                  <div className="mr-5 space-y-1">
                    {phase.tasks?.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center gap-2 text-sm text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        <span>{task.title}</span>
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded',
                            task.priority === 'CRITICAL' && 'bg-red-500/20 text-red-400',
                            task.priority === 'HIGH' && 'bg-orange-500/20 text-orange-400',
                            task.priority === 'MEDIUM' && 'bg-yellow-500/20 text-yellow-400',
                            task.priority === 'LOW' && 'bg-green-500/20 text-green-400'
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
