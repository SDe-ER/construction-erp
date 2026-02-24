'use client'

import { StatCard } from '@/components/shared/StatCard'
import { PageHeader, ActionButton } from '@/components/shared/PageHeader'
import { UserCheck, Plus } from 'lucide-react'

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="العملاء"
        description="إدارة بيانات العملاء"
        actions={<ActionButton icon={<Plus className="h-4 w-4" />}>عميل جديد</ActionButton>}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="إجمالي العملاء" value="18" icon={UserCheck} />
        <StatCard title="نشط" value="14" icon={UserCheck} />
        <StatCard title="مشاريع نشطة" value="8" icon={UserCheck} />
        <StatCard title="مدفوعات معلقة" value="ر.س 120,000" icon={UserCheck} />
      </div>

      <div className="text-center text-slate-400 py-12">
        قائمة العملاء ستظهر هنا
      </div>
    </div>
  )
}
