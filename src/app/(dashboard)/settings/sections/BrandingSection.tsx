'use client'

import { useState, useEffect } from 'react'
import { Palette, Type, Sun, Moon, Monitor, Check, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// Available fonts
const FONTS = [
  { value: 'Cairo', label: 'Cairo', arabicLabel: 'القاهرة' },
  { value: 'Tajawal', label: 'Tajawal', arabicLabel: 'تجوال' },
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Sans Arabic', arabicLabel: 'آي بي إم بليكس' },
]

// Color modes
const COLOR_MODES = [
  { value: 'dark', label: 'داكن', icon: Moon },
  { value: 'light', label: 'فاتح', icon: Sun },
  { value: 'auto', label: 'تلقائي', icon: Monitor },
]

interface BrandingSectionProps {
  settings: Record<string, any>
  onChange: (settings: Record<string, any>) => void
  onSave: () => void
  saving: boolean
}

export function BrandingSection({ settings, onChange, onSave, saving }: BrandingSectionProps) {
  const [previewMode, setPreviewMode] = useState<'dark' | 'light'>('dark')

  const handleChange = (key: string, value: any) => {
    onChange({ ...settings, [key]: value })
  }

  // Apply CSS variables for live preview
  useEffect(() => {
    if (settings.primary_color) {
      document.documentElement.style.setProperty('--primary-color', settings.primary_color)
    }
    if (settings.secondary_color) {
      document.documentElement.style.setProperty('--secondary-color', settings.secondary_color)
    }
    if (settings.font_family) {
      document.documentElement.style.setProperty('--font-family', settings.font_family)
    }
  }, [settings.primary_color, settings.secondary_color, settings.font_family])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">الهوية البصرية</h1>
          <p className="text-slate-400 mt-1">الألوان والخطوط والمظهر العام</p>
        </div>
        <Button
          onClick={onSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colors Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Palette className="h-5 w-5" />
              الألوان
            </CardTitle>
            <CardDescription>اختر الألوان الرئيسية والثانوية للنظام</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Color */}
            <div className="space-y-3">
              <Label className="text-slate-300">اللون الأساسي</Label>
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-slate-600 shadow-sm"
                  style={{ backgroundColor: settings.primary_color || '#3b82f6' }}
                />
                <div className="flex-1">
                  <Input
                    type="color"
                    value={settings.primary_color || '#3b82f6'}
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                    className="h-12 w-full cursor-pointer bg-slate-900 border-slate-700"
                  />
                </div>
                <Input
                  type="text"
                  value={settings.primary_color || '#3b82f6'}
                  onChange={(e) => handleChange('primary_color', e.target.value)}
                  placeholder="#3b82f6"
                  className="w-28 bg-slate-900 border-slate-700 text-white font-mono"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-slate-500">
                يستخدم للأزرار والروابط والعناصر الرئيسية
              </p>
            </div>

            {/* Secondary Color */}
            <div className="space-y-3">
              <Label className="text-slate-300">اللون الثانوي</Label>
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-slate-600 shadow-sm"
                  style={{ backgroundColor: settings.secondary_color || '#8b5cf6' }}
                />
                <div className="flex-1">
                  <Input
                    type="color"
                    value={settings.secondary_color || '#8b5cf6'}
                    onChange={(e) => handleChange('secondary_color', e.target.value)}
                    className="h-12 w-full cursor-pointer bg-slate-900 border-slate-700"
                  />
                </div>
                <Input
                  type="text"
                  value={settings.secondary_color || '#8b5cf6'}
                  onChange={(e) => handleChange('secondary_color', e.target.value)}
                  placeholder="#8b5cf6"
                  className="w-28 bg-slate-900 border-slate-700 text-white font-mono"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-slate-500">
                يستخدم للخلفيات والحواف والعناصر الثانوية
              </p>
            </div>

            {/* Color Mode */}
            <div className="space-y-3">
              <Label className="text-slate-300">وضع الألوان</Label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_MODES.map((mode) => {
                  const ModeIcon = mode.icon
                  const isSelected = settings.color_mode === mode.value

                  return (
                    <button
                      key={mode.value}
                      onClick={() => handleChange('color_mode', mode.value)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10 text-white'
                          : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600'
                      )}
                    >
                      <ModeIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">{mode.label}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-purple-400 absolute top-2 left-2" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Type className="h-5 w-5" />
              الخطوط
            </CardTitle>
            <CardDescription>اختر خط التطبيق ونمط النص</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Font Family */}
            <div className="space-y-3">
              <Label className="text-slate-300">خط التطبيق</Label>
              <Select
                value={settings.font_family || 'Cairo'}
                onValueChange={(value) => handleChange('font_family', value)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="اختر الخط" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {FONTS.map((font) => (
                    <SelectItem
                      key={font.value}
                      value={font.value}
                      className="text-white"
                      style={{ fontFamily: font.value }}
                    >
                      <span className="ml-2">{font.arabicLabel}</span>
                      <span className="text-slate-400 text-sm me-2">{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <Label className="text-slate-300">حجم الخط الأساسي</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="range"
                  min="12"
                  max="18"
                  step="1"
                  value={settings.base_font_size || 14}
                  onChange={(e) => handleChange('base_font_size', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-white font-medium w-12 text-center">
                  {settings.base_font_size || 14}px
                </span>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-3">
              <Label className="text-slate-300">معاينة الخط</Label>
              <div
                className="p-4 rounded-lg bg-slate-900 border border-slate-700"
                style={{ fontFamily: settings.font_family || 'Cairo' }}
              >
                <p className="text-lg font-bold text-white mb-2">عنوان تجريبي</p>
                <p className="text-sm text-slate-400 mb-3">
                  هذا نص تجريبي لمعاينة الخط المختار في النظام.
                </p>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded text-white text-sm font-medium"
                    style={{ backgroundColor: settings.primary_color || '#3b82f6' }}
                  >
                    زر أساسي
                  </button>
                  <button
                    className="px-4 py-2 rounded text-white text-sm font-medium"
                    style={{ backgroundColor: settings.secondary_color || '#8b5cf6' }}
                  >
                    زر ثانوي
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">معاينة مباشرة</CardTitle>
          <CardDescription>
            شاهد كيف يظهر التغيير على واجهة التطبيق
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-slate-400">وضع المعاينة:</span>
            <div className="flex gap-1 bg-slate-900 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('dark')}
                className={cn(
                  'px-3 py-1.5 rounded text-sm transition-colors',
                  previewMode === 'dark'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('light')}
                className={cn(
                  'px-3 py-1.5 rounded text-sm transition-colors',
                  previewMode === 'light'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Sun className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            className={cn(
              'rounded-xl p-6 border-2 transition-colors',
              previewMode === 'dark'
                ? 'bg-slate-900 border-slate-700'
                : 'bg-white border-gray-200'
            )}
            style={{ fontFamily: settings.font_family || 'Cairo' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: settings.primary_color || '#3b82f6' }}
                >
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <p
                    className={cn(
                      'font-semibold',
                      previewMode === 'dark' ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    لوحة التحكم
                  </p>
                  <p
                    className={cn(
                      'text-xs',
                      previewMode === 'dark' ? 'text-slate-400' : 'text-gray-500'
                    )}
                  >
                    الإحصائيات والملخص
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div
                className={cn(
                  'rounded-lg p-4',
                  previewMode === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
                )}
              >
                <p
                  className={cn(
                    'text-2xl font-bold',
                    previewMode === 'dark' ? 'text-white' : 'text-gray-900'
                  )}
                >
                  24
                </p>
                <p
                  className={cn(
                    'text-sm',
                    previewMode === 'dark' ? 'text-slate-400' : 'text-gray-500'
                  )}
                >
                  مشروع نشط
                </p>
              </div>
              <div
                className={cn(
                  'rounded-lg p-4',
                  previewMode === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
                )}
              >
                <p
                  className={cn(
                    'text-2xl font-bold',
                    previewMode === 'dark' ? 'text-white' : 'text-gray-900'
                  )}
                  style={{ color: settings.primary_color || '#3b82f6' }}
                >
                  156
                </p>
                <p
                  className={cn(
                    'text-sm',
                    previewMode === 'dark' ? 'text-slate-400' : 'text-gray-500'
                  )}
                >
                  عامل
                </p>
              </div>
              <div
                className={cn(
                  'rounded-lg p-4',
                  previewMode === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
                )}
              >
                <p
                  className={cn(
                    'text-2xl font-bold',
                    previewMode === 'dark' ? 'text-white' : 'text-gray-900'
                  )}
                  style={{ color: settings.secondary_color || '#8b5cf6' }}
                >
                  89%
                </p>
                <p
                  className={cn(
                    'text-sm',
                    previewMode === 'dark' ? 'text-slate-400' : 'text-gray-500'
                  )}
                >
                  نسبة الإنجاز
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
