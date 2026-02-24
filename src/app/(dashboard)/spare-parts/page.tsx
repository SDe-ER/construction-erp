'use client'

import { StatCard } from '@/components/shared/StatCard'
import { PageHeader, ActionButton } from '@/components/shared/PageHeader'
import { Cog, Plus } from 'lucide-react'

export default function SparePartsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="قطع الغيار"
        description="إدارة مخزون قطع الغيار"
        actions={<ActionButton icon={<Plus className="h-4 w-4" />}>قطعة غيار جديدة</ActionButton>}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="إجمالي القطع" value="128" icon={Cog} />
        <StatCard title="متاحة" value="98" icon={Cog} />
        <StatCard title="منخفضة الكمية" value="18" icon={Cog} />
        <StatCard title="نفذت" value="12" icon={Cog} />
      </div>

      <div className="text-center text-slate-400 py-12">
        قائمة قطع الغيار ستظهر هنا
      </div>
    </div>
  )
}
