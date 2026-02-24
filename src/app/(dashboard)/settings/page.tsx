'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Settings, User, Bell, Lock, Database } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="الإعدادات"
        description="إعدادات النظام والحساب"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Settings */}
        <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              إعدادات الملف الشخصي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-slate-300">الاسم</Label>
                <Input
                  defaultValue="المدير العام"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  defaultValue="admin@example.com"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="h-5 w-5" />
                كلمة المرور
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">كلمة المرور الحالية</Label>
                <Input
                  type="password"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">كلمة المرور الجديدة</Label>
                <Input
                  type="password"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <Button variant="outline" className="w-full border-slate-600">
                تحديث كلمة المرور
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                إعدادات الإشعارات والتنبيهات
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
