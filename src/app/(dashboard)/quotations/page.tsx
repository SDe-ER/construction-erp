'use client'

import { StatCard } from '@/components/shared/StatCard'
import { PageHeader, ActionButton } from '@/components/shared/PageHeader'
import { FileText, Plus } from 'lucide-react'

export default function QuotationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="العروض السعرية"
        description="إدارة العروض السعرية للعملاء"
        actions={<ActionButton icon={<Plus className="h-4 w-4" />}>عرض سعر جديد</ActionButton>}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="إجمالي العروض" value="24" icon={FileText} />
        <StatCard title="مسودة" value="5" icon={FileText} />
        <StatCard title="مرسلة" value="12" icon={FileText} />
        <StatCard title="مقبولة" value="7" icon={FileText} />
      </div>

      <div className="text-center text-slate-400 py-12">
        قائمة العروض السعرية ستظهر هنا
      </div>
    </div>
  )
}
