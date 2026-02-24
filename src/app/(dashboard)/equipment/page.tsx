'use client'

import { StatCard } from '@/components/shared/StatCard'
import { PageHeader, ActionButton } from '@/components/shared/PageHeader'
import { Truck, Plus } from 'lucide-react'

export default function EquipmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="المعدات"
        description="إدارة معدات وآليات الشركة"
        actions={<ActionButton icon={<Plus className="h-4 w-4" />}>معدة جديدة</ActionButton>}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="إجمالي المعدات" value="32" icon={Truck} />
        <StatCard title="تعمل" value="24" icon={Truck} />
        <StatCard title="صيانة" value="5" icon={Truck} />
        <StatCard title="خارج الخدمة" value="3" icon={Truck} />
      </div>

      <div className="text-center text-slate-400 py-12">
        قائمة المعدات ستظهر هنا
      </div>
    </div>
  )
}
