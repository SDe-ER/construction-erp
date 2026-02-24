'use client'

import { Project } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { STATUS_LABELS } from '@/lib/constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface ProjectListItemProps {
  project: Project
  onView?: (project: Project) => void
  onEdit?: (project: Project) => void
  onDelete?: (projectId: string) => void
}

export function ProjectListItem({
  project,
  onView,
  onEdit,
  onDelete,
}: ProjectListItemProps) {
  const statusColor = {
    PLANNING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    ACTIVE: 'bg-green-500/10 text-green-400 border-green-500/20',
    PAUSED: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    COMPLETED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  }[project.status]

  const statusIcon = {
    PLANNING: '📋',
    ACTIVE: '🔵',
    PAUSED: '⏸️',
    COMPLETED: '✅',
  }[project.status]

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-800/80 transition-colors">
      <div className="grid grid-cols-12 gap-4 p-4 items-center">
        {/* Project Info */}
        <div className="col-span-12 md:col-span-4 flex items-start gap-3">
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-2xl flex-shrink-0">
            {statusIcon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white truncate">{project.name}</h3>
            <p className="text-sm text-slate-400">كود: {project.code}</p>
            {project.location && (
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{project.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="col-span-6 md:col-span-2">
          <Badge className={statusColor} variant="outline">
            {STATUS_LABELS[project.status]}
          </Badge>
        </div>

        {/* Dates */}
        <div className="col-span-6 md:col-span-2">
          <div className="flex items-center gap-1 text-sm text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span className="hidden sm:inline">{formatDate(project.startDate)}</span>
            <span className="sm:hidden">{new Date(project.startDate).toLocaleDateString('ar-SA')}</span>
          </div>
        </div>

        {/* Budget */}
        <div className="col-span-6 md:col-span-2">
          {project.budget ? (
            <div className="flex items-center gap-1 text-sm text-slate-300">
              <DollarSign className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span className="font-medium">{formatCurrency(project.budget)}</span>
            </div>
          ) : (
            <span className="text-sm text-slate-500">—</span>
          )}
        </div>

        {/* Progress */}
        <div className="col-span-6 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-700 rounded-full h-2 min-w-[60px]">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 min-w-[35px] text-left">
              {project.progress || 0}%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-12 md:col-span-1 flex justify-end">
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-slate-800 border-slate-700">
              {onView && (
                <DropdownMenuItem
                  onClick={() => onView(project)}
                  className="text-slate-300 hover:text-white hover:bg-slate-700 gap-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>التفاصيل</span>
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(project)}
                  className="text-slate-300 hover:text-white hover:bg-slate-700 gap-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>تعديل</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(project.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-600/10 gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>حذف</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Progress Bar (Mobile Full Width) */}
      <div className="sm:hidden px-4 pb-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
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
    </div>
  )
}
