'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, TrendingUp, DollarSign, Users, Truck } from 'lucide-react'

export default function ReportsPage() {
  const reports = [
    { title: 'تقرير المشاريع', icon: TrendingUp, description: 'ملخص شامل لجميع المشاريع' },
    { title: 'تقرير الرواتب', icon: Users, description: 'كشف رواتب العاملين' },
    { title: 'تقرير المعدات', icon: Truck, description: 'حالة المعدات والصيانة' },
    { title: 'التقرير المالي', icon: DollarSign, description: 'الإيرادات والمصروفات' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="التقارير"
        description="تقارير شاملة عن جميع نشاطات الشركة"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report, i) => (
          <Card key={i} className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/10 rounded-lg">
                  <report.icon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white">{report.title}</CardTitle>
                  <p className="text-sm text-slate-400 mt-1">{report.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2">
                  <FileText className="h-4 w-4" />
                  عرض
                </Button>
                <Button variant="outline" className="border-slate-600 gap-2">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
