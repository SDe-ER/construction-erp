'use client'

import { Worker } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Calendar, DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { STATUS_LABELS } from '@/lib/constants'

interface WorkerCardProps {
  worker: Worker
  onEdit?: (worker: Worker) => void
  onDelete?: (workerId: string) => void
}

export function WorkerCard({ worker, onEdit, onDelete }: WorkerCardProps) {
  const statusColor = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    on_leave: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    terminated: 'bg-red-500/10 text-red-400 border-red-500/20',
  }[worker.status]

  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={worker.avatar} />
              <AvatarFallback className="bg-blue-600 text-white">
                {worker.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-white">{worker.name}</CardTitle>
              <p className="text-sm text-slate-400">{worker.position || 'بدون وظيفة'}</p>
            </div>
          </div>
          <Badge className={statusColor} variant="outline">
            {STATUS_LABELS[worker.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Phone className="h-4 w-4 text-slate-400" />
          <span>{worker.phone}</span>
        </div>
        {worker.nationalId && (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="text-slate-400">رقم الهوية:</span>
            <span>{worker.nationalId}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <DollarSign className="h-4 w-4 text-slate-400" />
          <span>{formatCurrency(worker.salary)}</span>
        </div>
        {worker.housing && (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>السكن: {worker.housing}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>{formatDate(worker.joinDate)}</span>
        </div>

        <div className="flex gap-2 pt-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(worker)}
              className="flex-1 border-slate-600"
            >
              تعديل
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(worker.id)}
              className="flex-1 border-red-600 text-red-400 hover:bg-red-600/10"
            >
              حذف
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
