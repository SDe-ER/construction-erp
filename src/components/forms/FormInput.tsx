'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormInputProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  error?: string
  className?: string
}

export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  className,
}: FormInputProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name} className="text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={cn(
          'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500',
          error && 'border-red-500'
        )}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
