'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormTextareaProps {
  label: string
  name: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
  error?: string
  rows?: number
  className?: string
}

export function FormTextarea({
  label,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  rows = 3,
  className,
}: FormTextareaProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name} className="text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={cn(
          'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 resize-none',
          error && 'border-red-500'
        )}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
