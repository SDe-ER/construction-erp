import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Plus, SlidersHorizontal } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  showFilter?: boolean
  onFilterClick?: () => void
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  showFilter,
  onFilterClick,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-slate-400 mt-1">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {showFilter && (
          <Button
            variant="outline"
            size="icon"
            onClick={onFilterClick}
            className="border-slate-700"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        )}
        {actions}
      </div>
    </div>
  )
}

// Action Button Component
export function ActionButton({
  children,
  icon,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode
}) {
  return (
    <Button
      className="bg-blue-600 hover:bg-blue-700 gap-2"
      {...props}
    >
      {icon || <Plus className="h-4 w-4" />}
      {children}
    </Button>
  )
}
