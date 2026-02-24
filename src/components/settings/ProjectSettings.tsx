'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Layers,
  Flag,
  Settings,
  Copy,
  Plus,
  Save,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { TaskStatusesSection } from './project-settings/TaskStatusesSection'
import { PriorityLevelsSection } from './project-settings/PriorityLevelsSection'
import { CustomFieldsSection } from './project-settings/CustomFieldsSection'
import { ProjectTemplatesSection } from './project-settings/ProjectTemplatesSection'

// Tab items
const TABS = [
  {
    id: 'statuses',
    label: 'حالات المهام',
    icon: Layers,
    description: 'تخصيص حالات المهام وألوانها',
  },
  {
    id: 'priorities',
    label: 'مستويات الأولوية',
    icon: Flag,
    description: 'تعيين SLA لكل مستوى أولوية',
  },
  {
    id: 'customFields',
    label: 'الحقول المخصصة',
    icon: Settings,
    description: 'إضافة حقول مخصصة للمهام',
  },
  {
    id: 'templates',
    label: 'قوالب المشاريع',
    icon: Copy,
    description: 'إنشاء وإدارة قوالب المشاريع',
  },
]

interface ProjectSettingsProps {
  projectId?: string // Optional: if viewing from a project context
}

export function ProjectSettings({ projectId }: ProjectSettingsProps) {
  const [activeTab, setActiveTab] = useState('statuses')
  const [saving, setSaving] = useState(false)

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      // Save all settings at once
      toast.success('تم حفظ جميع الإعدادات بنجاح')
    } catch (error) {
      toast.error('فشل حفظ الإعدادات')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">إعدادات إدارة المشاريع</h1>
          <p className="text-slate-400 mt-1">تخصيص إعدادات المهام والمشاريع</p>
        </div>
        <Button
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              حفظ جميع الإعدادات
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800 border border-slate-700 w-full justify-start h-auto p-1">
          {TABS.map((tab) => {
            const TabIcon = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 data-[state=active]:bg-slate-700',
                  'text-slate-400 data-[state=active]:text-white'
                )}
              >
                <TabIcon className="h-4 w-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab Contents */}
        <div className="mt-6">
          <TabsContent value="statuses" className="space-y-6">
            <TaskStatusesSection />
          </TabsContent>

          <TabsContent value="priorities" className="space-y-6">
            <PriorityLevelsSection />
          </TabsContent>

          <TabsContent value="customFields" className="space-y-6">
            <CustomFieldsSection />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <ProjectTemplatesSection projectId={projectId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
