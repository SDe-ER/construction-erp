import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
  className?: string
  iconColor?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  className,
  iconColor = 'text-blue-400',
}: StatCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {trend && (
              <p className={cn(
                'text-sm mt-1 flex items-center gap-1',
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              )}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                <span className="text-slate-400 text-xs mr-1">من الشهر الماضي</span>
              </p>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-1">{description}</p>
            )}
          </div>
          <div className={cn('p-3 rounded-lg bg-slate-900', iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
