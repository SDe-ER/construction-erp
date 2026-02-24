'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormSelectProps {
  label: string
  name: string
  value?: string
  onChange?: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  error,
  className,
}: FormSelectProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name} className="text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger
          id={name}
          className={cn(
            'bg-slate-900 border-slate-700 text-white',
            error && 'border-red-500'
          )}
        >
          <SelectValue placeholder={placeholder || 'اختر من القائمة'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
