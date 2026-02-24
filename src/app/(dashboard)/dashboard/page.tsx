'use client'

import { StatCard } from '@/components/shared/StatCard'
import {
  Building2,
  Users,
  Truck,
  TrendingUp,
  DollarSign,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
        <p className="text-slate-400 mt-1">نظرة عامة على نظام ERP</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي المشاريع"
          value="12"
          icon={Building2}
          iconColor="text-blue-400"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="إجمالي العاملين"
          value="156"
          icon={Users}
          iconColor="text-green-400"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="المعدات النشطة"
          value="24"
          icon={Truck}
          iconColor="text-orange-400"
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="إيرادات الشهر"
          value="ر.س 450,000"
          icon={DollarSign}
          iconColor="text-emerald-400"
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">المشاريع النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'مشروع الساحل الشمالي', progress: 75, status: 'نشط' },
                { name: 'مجمع الياسمين السكني', progress: 45, status: 'نشط' },
                { name: 'تطوير طريق الملك فهد', progress: 90, status: 'قيد الاكتمال' },
              ].map((project, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{project.name}</span>
                    <span className="text-xs text-slate-400">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              التنبيهات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'warning', message: 'الرافعة رقم 3 تحتاج صيانة دورية' },
                { type: 'info', message: 'موعد استحقاق رواتب العاملين بعد 5 أيام' },
                { type: 'success', message: 'تم استلام الدفعة الأولى من مشروع الساحل' },
              ].map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    alert.type === 'warning'
                      ? 'bg-orange-500/10 border border-orange-500/20'
                      : alert.type === 'success'
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-blue-500/10 border border-blue-500/20'
                  }`}
                >
                  <div className="flex-1 text-sm text-slate-300">{alert.message}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'إضافة مشروع جديد', icon: Building2, href: '/projects' },
              { label: 'تسجيل عامل جديد', icon: Users, href: '/workers' },
              { label: 'إضافة معدة', icon: Truck, href: '/equipment' },
              { label: 'تسجيل مصروف', icon: TrendingUp, href: '/expenses' },
            ].map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg hover:bg-slate-900/80 transition-colors"
              >
                <action.icon className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-white">{action.label}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
