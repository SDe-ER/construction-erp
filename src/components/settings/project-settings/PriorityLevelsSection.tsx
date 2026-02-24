'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Flag,
  Loader2,
  Clock,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

// Default priority levels
const DEFAULT_PRIORITIES = [
  {
    id: 'LOW',
    name: 'منخفضة',
    nameEn: 'LOW',
    color: '#22c55e',
    icon: '🟢',
    slaDays: 14,
    description: 'يمكن الانتظار حتى أسبوعين',
  },
  {
    id: 'MEDIUM',
    name: 'متوسطة',
    nameEn: 'MEDIUM',
    color: '#f59e0b',
    icon: '🟡',
    slaDays: 7,
    description: 'يجب إكمالها خلال أسبوع',
  },
  {
    id: 'HIGH',
    name: 'عالية',
    nameEn: 'HIGH',
    color: '#f97316',
    icon: '🟠',
    slaDays: 3,
    description: 'يجب إكمالها خلال 3 أيام',
  },
  {
    id: 'CRITICAL',
    name: 'حرجة',
    nameEn: 'CRITICAL',
    color: '#ef4444',
    icon: '🔴',
    slaDays: 1,
    description: 'يجب إكمالها خلال يوم واحد',
  },
]

export function PriorityLevelsSection() {
  const [priorities, setPriorities] = useState(DEFAULT_PRIORITIES)
  const [loading, setLoading] = useState(false)

  // Fetch priorities from API
  useEffect(() => {
    fetchPriorities()
  }, [])

  const fetchPriorities = async () => {
    try {
      const res = await fetch('/api/settings?module=projects')
      const data = await res.json()
      if (data.success) {
        const savedPriorities = data.configs.priority_levels || DEFAULT_PRIORITIES
        setPriorities(savedPriorities)
      }
    } catch (error) {
      console.error('Error fetching priorities:', error)
    }
  }

  const savePriorities = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            {
              module: 'projects',
              key: 'priority_levels',
              value: JSON.stringify(priorities),
            },
          ],
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success('تم حفظ مستويات الأولوية بنجاح')
      } else {
        toast.error(data.error || 'فشل حفظ مستويات الأولوية')
      }
    } catch (error) {
      toast.error('فشل حفظ مستويات الأولوية')
    } finally {
      setLoading(false)
    }
  }

  const updatePriority = (id: string, field: string, value: any) => {
    setPriorities(priorities.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const getPriorityIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <AlertTriangle className="h-4 w-4" />
      case 'HIGH':
        return <Flag className="h-4 w-4" />
      case 'MEDIUM':
        return <Info className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Flag className="h-5 w-5" />
              مستويات الأولوية
            </CardTitle>
            <CardDescription>
              تعيين أسماء وألوان و SLA لكل مستوى أولوية
            </CardDescription>
          </div>
          <Button
            onClick={savePriorities}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              'حفظ التغييرات'
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {priorities.map((priority) => (
            <div
              key={priority.id}
              className="rounded-xl border-2 p-4 space-y-4"
              style={{ borderColor: priority.color }}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${priority.color}20` }}
                >
                  {priority.icon}
                </div>
                <div className="flex-1">
                  <Input
                    value={priority.name}
                    onChange={(e) => updatePriority(priority.id, 'name', e.target.value)}
                    className="bg-transparent border-0 p-0 text-white font-semibold text-lg focus-visible:ring-0"
                  />
                  <Input
                    value={priority.nameEn}
                    onChange={(e) => updatePriority(priority.id, 'nameEn', e.target.value)}
                    className="bg-transparent border-0 p-0 text-slate-400 text-sm focus-visible:ring-0"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs">اللون</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={priority.color}
                    onChange={(e) => updatePriority(priority.id, 'color', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <Input
                    type="text"
                    value={priority.color}
                    onChange={(e) => updatePriority(priority.id, 'color', e.target.value)}
                    className="flex-1 bg-slate-900 border-slate-700 text-white text-sm font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Icon Picker */}
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs">الأيقونة</Label>
                <div className="flex gap-1">
                  {['🟢', '🟡', '🟠', '🔴', '⚡', '🔥', '⭐', '💎'].map((icon) => (
                    <button
                      key={icon}
                      onClick={() => updatePriority(priority.id, 'icon', icon)}
                      className={cn(
                        'w-10 h-10 rounded-lg text-xl transition-all hover:scale-110',
                        priority.icon === icon
                          ? 'ring-2 ring-white'
                          : 'bg-slate-700'
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* SLA Days */}
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  SLA (أيام)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={365}
                    value={priority.slaDays}
                    onChange={(e) => updatePriority(priority.id, 'slaDays', parseInt(e.target.value) || 0)}
                    className="flex-1 bg-slate-900 border-slate-700 text-white text-center"
                    dir="ltr"
                  />
                  <span className="text-slate-400 text-sm">يوم</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-3 rounded-lg bg-slate-900/50">
                <p className="text-xs text-slate-400">
                  {priority.description}
                </p>
              </div>

              {/* Example */}
              <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-500 mb-2">مثال: مهمة بتمديد 3 أيام</p>
                <div className="flex items-center gap-2 text-sm">
                  {getPriorityIcon(priority.id)}
                  <span className="text-slate-400">تصبح متأخرة بعد:</span>
                  <span
                    className="font-bold"
                    style={{ color: priority.color }}
                  >
                    {priority.slaDays} يوم
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-blue-400 flex items-center gap-2">
            <Info className="h-4 w-4" />
            يتم احتساب المهام المتأخرة بناءً على تاريخ الاستحقاق + SLA حسب الأولوية
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
