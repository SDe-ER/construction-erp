'use client'

import { StatCard } from '@/components/shared/StatCard'
import { PageHeader, ActionButton } from '@/components/shared/PageHeader'
import { Home, Plus } from 'lucide-react'

export default function HousingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="السكن العمالي"
        description="إشاءات سكن العمال"
        actions={<ActionButton icon={<Plus className="h-4 w-4" />}>سكن جديد</ActionButton>}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="إجمالي المساكن" value="8" icon={Home} />
        <StatCard title="إجمالي السكان" value="142" icon={Home} />
        <StatCard title="إيجار شهري" value="ر.س 24,000" icon={Home} />
        <StatCard title="طاقة استيعابية" value="160" icon={Home} />
      </div>

      <div className="text-center text-slate-400 py-12">
        قائمة المساكن ستظهر هنا
      </div>
    </div>
  )
}
