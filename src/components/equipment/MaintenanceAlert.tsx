'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Calendar, Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface MaintenanceAlertProps {
  equipmentName: string
  lastMaintenanceDate: string
  nextMaintenanceDate: string
  hoursSinceLastMaintenance: number
  onSchedule?: () => void
  urgency?: 'low' | 'medium' | 'high' | 'critical'
}

export function MaintenanceAlert({
  equipmentName,
  lastMaintenanceDate,
  nextMaintenanceDate,
  hoursSinceLastMaintenance,
  onSchedule,
  urgency = 'medium',
}: MaintenanceAlertProps) {
  const urgencyConfig = {
    low: {
      color: 'bg-green-500/10 text-green-400 border-green-500/20',
      icon: null,
      label: 'منخفضة',
    },
    medium: {
      color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      icon: null,
      label: 'متوسطة',
    },
    high: {
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      icon: null,
      label: 'عالية',
    },
    critical: {
      color: 'bg-red-500/10 text-red-400 border-red-500/20',
      icon: AlertTriangle,
      label: 'حرجة',
    },
  }[urgency]

  const UrgencyIcon = urgencyConfig.icon

  return (
    <Card className={`border ${urgencyConfig.color} bg-slate-800`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {UrgencyIcon && (
            <div className="flex-shrink-0">
              <UrgencyIcon className="h-5 w-5" />
            </div>
          )}

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">{equipmentName}</h4>
              <Badge className={urgencyConfig.color} variant="outline">
                {urgencyConfig.label}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-1">
                <Wrench className="h-4 w-4" />
                <span>{hoursSinceLastMaintenance} ساعة منذ آخر صيانة</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>الصيانة القادمة: {nextMaintenanceDate}</span>
              </div>
            </div>
          </div>

          {onSchedule && (
            <Button
              size="sm"
              onClick={onSchedule}
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700"
            >
              جدولة الصيانة
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
