'use client'

import { StatCard } from '@/components/shared/StatCard'
import { PageHeader, ActionButton } from '@/components/shared/PageHeader'
import { ArrowUpCircle, Plus } from 'lucide-react'

export default function RevenuesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="الإيرادات"
        description="تسجيل ومتابعة الإيرادات"
        actions={<ActionButton icon={<Plus className="h-4 w-4" />}>إيراد جديد</ActionButton>}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="إجمالي الإيرادات" value="ر.س 450,000" icon={ArrowUpCircle} />
        <StatCard title="هذا الشهر" value="ر.س 85,000" icon={ArrowUpCircle} />
        <StatCard title="مستحقة" value="ر.س 35,000" icon={ArrowUpCircle} />
        <StatCard title="مدفوعة" value="ر.س 50,000" icon={ArrowUpCircle} />
      </div>

      <div className="text-center text-slate-400 py-12">
        قائمة الإيرادات ستظهر هنا
      </div>
    </div>
  )
}
