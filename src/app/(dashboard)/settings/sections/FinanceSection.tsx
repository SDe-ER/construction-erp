'use client'

import { DollarSign, Globe, Calendar, Hash, TrendingUp, Save, Loader2 } from 'lucide-react'
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

// Currencies
const CURRENCIES = [
  { value: 'SAR', label: 'ريال سعودي', symbol: 'ر.س' },
  { value: 'USD', label: 'دولار أمريكي', symbol: '$' },
  { value: 'EUR', label: 'يورو', symbol: '€' },
  { value: 'GBP', label: 'جنيه إسترليني', symbol: '£' },
  { value: 'AED', label: 'درهم إماراتي', symbol: 'د.إ' },
  { value: 'KWD', label: 'دينار كويتي', symbol: 'د.ك' },
  { value: 'BHD', label: 'دينار بحريني', symbol: 'د.ب' },
  { value: 'OMR', label: 'ريال عماني', symbol: 'ر.ع' },
  { value: 'QAR', label: 'ريال قطري', symbol: 'ر.ق' },
  { value: 'EGP', label: 'جنيه مصري', symbol: 'ج.م' },
]

// Number formats
const NUMBER_FORMATS = [
  { value: '1,000', label: '1,000 (فاصلة)', example: '1,234,567.89' },
  { value: '1.000', label: '1.000 (نقطة)', example: '1.234.567,89' },
]

// Date formats
const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '24/02/2026' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '02/24/2026' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2026-02-24' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY', example: '24-02-2026' },
  { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD', example: '2026/02/24' },
]

// Timezones
const TIMEZONES = [
  { value: 'Asia/Riyadh', label: 'الرياض (GMT+3)', country: 'السعودية' },
  { value: 'Asia/Dubai', label: 'دبي (GMT+4)', country: 'الإمارات' },
  { value: 'Asia/Kuwait', label: 'الكويت (GMT+3)', country: 'الكويت' },
  { value: 'Asia/Bahrain', label: 'المنامة (GMT+3)', country: 'البحرين' },
  { value: 'Asia/Qatar', label: 'الدوحة (GMT+3)', country: 'قطر' },
  { value: 'Asia/Muscat', label: 'مسقط (GMT+4)', country: 'عمان' },
  { value: 'Africa/Cairo', label: 'القاهرة (GMT+2)', country: 'مصر' },
]

interface FinanceSectionProps {
  settings: Record<string, any>
  onChange: (settings: Record<string, any>) => void
  onSave: () => void
  saving: boolean
}

export function FinanceSection({ settings, onChange, onSave, saving }: FinanceSectionProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...settings, [key]: value })
  }

  // Format example number based on selected format
  const formatExampleNumber = (num: number, format: string) => {
    if (format === '1.000') {
      return num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Format example date
  const formatExampleDate = (dateFormat: string) => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    switch (dateFormat) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`
      case 'DD-MM-YYYY':
        return `${day}-${month}-${year}`
      case 'YYYY/MM/DD':
        return `${year}/${month}/${day}`
      default:
        return `${day}/${month}/${year}`
    }
  }

  const selectedCurrency = CURRENCIES.find(c => c.value === settings.currency) || CURRENCIES[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">إعدادات المالية</h1>
          <p className="text-slate-400 mt-1">العملة والضرائب والصيغ</p>
        </div>
        <Button
          onClick={onSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 gap-2"
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
        {/* Currency & Tax Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              العملة والضريبة
            </CardTitle>
            <CardDescription>إعدادات العملة والضرائب والفواتير</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Currency */}
            <div className="space-y-3">
              <Label className="text-slate-300">العملة الافتراضية</Label>
              <Select
                value={settings.currency || 'SAR'}
                onValueChange={(value) => handleChange('currency', value)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value} className="text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{currency.symbol}</span>
                        <span>{currency.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                العملة المستخدمة في الفواتير والتقارير المالية
              </p>
            </div>

            {/* VAT Rate */}
            <div className="space-y-3">
              <Label htmlFor="vatRate" className="text-slate-300">
                نسبة الضريبة المضافة (VAT)
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="vatRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settings.vat_rate || 15}
                  onChange={(e) => handleChange('vat_rate', parseFloat(e.target.value) || 0)}
                  className="bg-slate-900 border-slate-700 text-white"
                  dir="ltr"
                />
                <span className="text-white text-lg">%</span>
              </div>
              <p className="text-xs text-slate-500">
                النسبة المئوية للضريبة المضافة على الفواتير
              </p>
            </div>

            {/* Invoice Number */}
            <div className="space-y-3">
              <Label htmlFor="invoiceNumber" className="text-slate-300">
                رقم آخر فاتورة
              </Label>
              <div className="flex items-center gap-3">
                <Hash className="text-slate-400" />
                <Input
                  id="invoiceNumber"
                  type="number"
                  min="1"
                  value={settings.last_invoice_number || 1000}
                  onChange={(e) => handleChange('last_invoice_number', parseInt(e.target.value) || 1000)}
                  className="bg-slate-900 border-slate-700 text-white"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-slate-500">
                يتم زيادة الرقم تلقائياً عند إنشاء فاتورة جديدة
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Formats Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5" />
              الصيغ والتاريخ
            </CardTitle>
            <CardDescription>صيغ الأرقام والتواريخ والمنطقة الزمنية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Number Format */}
            <div className="space-y-3">
              <Label className="text-slate-300">صيغة الأرقام</Label>
              <Select
                value={settings.number_format || '1,000'}
                onValueChange={(value) => handleChange('number_format', value)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="اختر الصيغة" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {NUMBER_FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value} className="text-white">
                      <div className="flex items-center gap-2">
                        <span>{format.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">مثال:</span>
                <span className="text-white font-mono bg-slate-900 px-2 py-1 rounded">
                  {selectedCurrency.symbol} {formatExampleNumber(1234567.89, settings.number_format || '1,000')}
                </span>
              </div>
            </div>

            {/* Date Format */}
            <div className="space-y-3">
              <Label className="text-slate-300">صيغة التاريخ</Label>
              <Select
                value={settings.date_format || 'DD/MM/YYYY'}
                onValueChange={(value) => handleChange('date_format', value)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="اختر الصيغة" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {DATE_FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value} className="text-white">
                      <div className="flex items-center gap-2">
                        <span>{format.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">مثال:</span>
                <span className="text-white font-mono bg-slate-900 px-2 py-1 rounded">
                  {formatExampleDate(settings.date_format || 'DD/MM/YYYY')}
                </span>
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-3">
              <Label className="text-slate-300">المنطقة الزمنية</Label>
              <Select
                value={settings.timezone || 'Asia/Riyadh'}
                onValueChange={(value) => handleChange('timezone', value)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="اختر المنطقة" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value} className="text-white">
                      <div className="flex flex-col">
                        <span>{tz.label}</span>
                        <span className="text-xs text-slate-400">{tz.country}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            معاينة الفاتورة
          </CardTitle>
          <CardDescription>
            شاهد كيف سيظهر تنسيق الأرقام في الفواتير
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-6 max-w-md">
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900">فاتورة ضريبية</h3>
              <p className="text-sm text-gray-500">رقو الفاتورة: INV-{(settings.last_invoice_number || 1000) + 1}</p>
              <p className="text-sm text-gray-500">{formatExampleDate(settings.date_format || 'DD/MM/YYYY')}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">المبلغ:</span>
                <span className="font-mono font-medium text-gray-900">
                  {selectedCurrency.symbol} {formatExampleNumber(10000, settings.number_format || '1,000')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الضريبة ({settings.vat_rate || 15}%):</span>
                <span className="font-mono font-medium text-gray-900">
                  {selectedCurrency.symbol} {formatExampleNumber(10000 * ((settings.vat_rate || 15) / 100), settings.number_format || '1,000')}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-900">الإجمالي:</span>
                <span className="font-mono font-bold text-gray-900">
                  {selectedCurrency.symbol} {formatExampleNumber(10000 * (1 + (settings.vat_rate || 15) / 100), settings.number_format || '1,000')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
