'use client'

import { StatCard } from '@/components/shared/StatCard'
import { PageHeader, ActionButton } from '@/components/shared/PageHeader'
import { Wrench, Plus } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="الصيانة"
        description="سجل صيانة المعدات والآليات"
        actions={<ActionButton icon={<Plus className="h-4 w-4" />}>صيانة جديدة</ActionButton>}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="إجمالي الصيانة" value="45" icon={Wrench} />
        <StatCard title="روتينية" value="32" icon={Wrench} />
        <StatCard title="طارئة" value="8" icon={Wrench} />
        <StatCard title="دورية" value="5" icon={Wrench} />
      </div>

      <div className="text-center text-slate-400 py-12">
        سجل الصيانة سيظهر هنا
      </div>
    </div>
  )
}
