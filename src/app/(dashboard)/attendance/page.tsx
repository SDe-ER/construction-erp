'use client'

import { StatCard } from '@/components/shared/StatCard'
import { PageHeader, ActionButton } from '@/components/shared/PageHeader'
import { Clock, Plus } from 'lucide-react'

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="الحضور والانصراف"
        description="تسجيل الحضور والانصراف للعاملين"
        actions={<ActionButton icon={<Plus className="h-4 w-4" />}>تسجيل حضور</ActionButton>}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="إجمالي العاملين" value="156" icon={Clock} />
        <StatCard title="حاضرون" value="142" icon={Clock} />
        <StatCard title="غائبون" value="8" icon={Clock} />
        <StatCard title="متأخرون" value="6" icon={Clock} />
      </div>

      <div className="text-center text-slate-400 py-12">
        سجل الحضور سيظهر هنا
      </div>
    </div>
  )
}
