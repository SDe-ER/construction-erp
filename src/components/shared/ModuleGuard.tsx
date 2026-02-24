'use client'

import { useIsModuleEnabled } from '@/providers/ConfigProvider'
import { Lock, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ModuleGuardProps {
  moduleName: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ModuleGuard({ moduleName, children, fallback }: ModuleGuardProps) {
  const isEnabled = useIsModuleEnabled(moduleName)

  if (!isEnabled) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-slate-900">
                  <Lock className="h-8 w-8 text-slate-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                الوحدة غير مفعلة
              </h3>
              <p className="text-slate-400 mb-4">
                هذه الوحدة ({moduleName}) غير مفعّلة حالياً في إعدادات النظام.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 bg-slate-900 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>يرجى التواصل مع الإدارة لتفعيل هذه الوحدة</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  return <>{children}</>
}
