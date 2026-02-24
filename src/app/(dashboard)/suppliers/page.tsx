'use client'

import { StatCard } from '@/components/shared/StatCard'
import { PageHeader, ActionButton } from '@/components/shared/PageHeader'
import { ShoppingCart, Plus } from 'lucide-react'

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="الموردين"
        description="إدارة بيانات الموردين"
        actions={<ActionButton icon={<Plus className="h-4 w-4" />}>مورد جديد</ActionButton>}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="إجمالي الموردين" value="22" icon={ShoppingCart} />
        <StatCard title="نشط" value="18" icon={ShoppingCart} />
        <StatCard title="قطع غيار" value="10" icon={ShoppingCart} />
        <StatCard title="مواد بناء" value="8" icon={ShoppingCart} />
      </div>

      <div className="text-center text-slate-400 py-12">
        قائمة الموردين ستظهر هنا
      </div>
    </div>
  )
}
