'use client'

import { StatCard } from '@/components/shared/StatCard'
import { PageHeader, ActionButton } from '@/components/shared/PageHeader'
import { ArrowDownCircle, Plus } from 'lucide-react'

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="المصروفات"
        description="تسجيل ومتابعة المصروفات"
        actions={<ActionButton icon={<Plus className="h-4 w-4" />}>مصروف جديد</ActionButton>}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="إجمالي المصروفات" value="ر.س 125,000" icon={ArrowDownCircle} />
        <StatCard title="هذا الشهر" value="ر.س 45,000" icon={ArrowDownCircle} />
        <StatCard title="وقود" value="ر.س 18,000" icon={ArrowDownCircle} />
        <StatCard title="صيانة" value="ر.س 12,000" icon={ArrowDownCircle} />
      </div>

      <div className="text-center text-slate-400 py-12">
        قائمة المصروفات ستظهر هنا
      </div>
    </div>
  )
}
