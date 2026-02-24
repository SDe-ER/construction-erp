'use client'

import { Project } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, MapPin, Calendar, DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { STATUS_LABELS } from '@/lib/constants'

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (projectId: string) => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const statusColor = {
    PLANNING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    ACTIVE: 'bg-green-500/10 text-green-400 border-green-500/20',
    PAUSED: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    COMPLETED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  }[project.status]

  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-white">{project.name}</CardTitle>
            <p className="text-sm text-slate-400 mt-1">كود: {project.code}</p>
          </div>
          <Badge className={statusColor} variant="outline">
            {STATUS_LABELS[project.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {project.location && (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{project.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>{formatDate(project.startDate)}</span>
        </div>
        {project.budget && (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <span>الميزانية: {formatCurrency(project.budget)}</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>نسبة الإنجاز</span>
            <span>{project.progress || 0}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(project)}
              className="flex-1 border-slate-600"
            >
              تعديل
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(project.id)}
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
