'use client'

import { Equipment } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Truck, Wrench, Clock, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { STATUS_LABELS } from '@/lib/constants'

interface EquipmentCardProps {
  equipment: Equipment
  onEdit?: (equipment: Equipment) => void
  onDelete?: (equipmentId: string) => void
  onViewMaintenance?: (equipmentId: string) => void
}

export function EquipmentCard({ equipment, onEdit, onDelete, onViewMaintenance }: EquipmentCardProps) {
  const statusColor = {
    available: 'bg-green-500/10 text-green-400 border-green-500/20',
    in_use: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    maintenance: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    out_of_service: 'bg-red-500/10 text-red-400 border-red-500/20',
  }[equipment.status]

  const needsMaintenance = equipment.currentHours > 500 // Example threshold

  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-white">{equipment.name}</CardTitle>
            <p className="text-sm text-slate-400 mt-1">كود: {equipment.code}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={statusColor} variant="outline">
              {STATUS_LABELS[equipment.status]}
            </Badge>
            {needsMaintenance && (
              <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20" variant="outline">
                يحتاج صيانة
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Truck className="h-4 w-4 text-slate-400" />
          <span>النوع: {equipment.type || 'غير محدد'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Clock className="h-4 w-4 text-slate-400" />
          <span>ساعات العمل: {equipment.currentHours}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <DollarSign className="h-4 w-4 text-slate-400" />
          <span>تكلفة الشراء: {formatCurrency(equipment.purchaseCost)}</span>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full ${
              needsMaintenance ? 'bg-orange-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min((equipment.currentHours / 1000) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-400">مستوى الاستهلاك</p>

        <div className="flex gap-2 pt-2">
          {onViewMaintenance && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewMaintenance(equipment.id)}
              className="flex-1 border-slate-600"
            >
              <Wrench className="ml-1 h-3 w-3" />
              الصيانة
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(equipment)}
              className="flex-1 border-slate-600"
            >
              تعديل
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(equipment.id)}
              className="border-red-600 text-red-400 hover:bg-red-600/10"
            >
              حذف
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
