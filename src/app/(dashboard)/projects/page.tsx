'use client'

import { StatCard } from '@/components/shared/StatCard'
import { PageHeader, ActionButton } from '@/components/shared/PageHeader'
import { Building2, Plus } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="المشاريع"
        description="إدارة جميع مشاريع الشركة"
        actions={<ActionButton icon={<Plus className="h-4 w-4" />}>مشروع جديد</ActionButton>}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="جميع المشاريع" value="12" icon={Building2} />
        <StatCard title="نشط" value="8" icon={Building2} />
        <StatCard title="قيد التخطيط" value="2" icon={Building2} />
        <StatCard title="مكتمل" value="2" icon={Building2} />
      </div>

      {/* Projects List Placeholder */}
      <div className="text-center text-slate-400 py-12">
        قائمة المشاريع ستظهر هنا
      </div>
    </div>
  )
}
