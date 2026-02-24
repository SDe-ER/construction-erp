'use client'

import { useState, useRef } from 'react'
import { Building2, Mail, Phone, MapPin, Hash, Upload, X, Check, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CompanySectionProps {
  settings: Record<string, any>
  onChange: (settings: Record<string, any>) => void
  onSave: () => void
  saving: boolean
}

export function CompanySection({ settings, onChange, onSave, saving }: CompanySectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logo_url || null)
  const [logoUploading, setLogoUploading] = useState(false)

  const handleChange = (key: string, value: any) => {
    onChange({ ...settings, [key]: value })
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return
    }

    setLogoUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        handleChange('logo_url', reader.result as string)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading logo:', error)
    } finally {
      setLogoUploading(false)
    }
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    handleChange('logo_url', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">بيانات الشركة</h1>
          <p className="text-slate-400 mt-1">المعلومات الأساسية والاتصال</p>
        </div>
        <Button
          onClick={onSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
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

      {/* Main Content */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">معلومات الشركة</CardTitle>
          <CardDescription>البيانات الأساسية التي تظهر في التقارير والفواتير</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <Label className="text-slate-300 block mb-3">شعار الشركة</Label>
              <div className="relative group">
                {logoPreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-slate-600 bg-slate-900">
                    <img
                      src={logoPreview}
                      alt="شعار الشركة"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute top-2 left-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-600 bg-slate-900 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-colors">
                    <Building2 className="h-10 w-10 text-slate-600 mb-2" />
                    <span className="text-xs text-slate-500">PNG, JPG</span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={logoUploading}
                  className="w-full mt-3 border-slate-600"
                >
                  {logoUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4 ml-2" />
                      رفع شعار
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-slate-300">
                  اسم الشركة <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="companyName"
                  value={settings.company_name || ''}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  placeholder="مثال: شركة المقاولات الحديثة"
                  className="bg-slate-900 border-slate-700 text-white"
                  dir="auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxNumber" className="text-slate-300">
                    الرقم الضريبي
                  </Label>
                  <div className="relative">
                    <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="taxNumber"
                      value={settings.tax_number || ''}
                      onChange={(e) => handleChange('tax_number', e.target.value)}
                      placeholder="3xxxxxxxxxxx"
                      className="bg-slate-900 border-slate-700 text-white pr-10"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commercialReg" className="text-slate-300">
                    رقم السجل التجاري
                  </Label>
                  <Input
                    id="commercialReg"
                    value={settings.commercial_reg || ''}
                    onChange={(e) => handleChange('commercial_reg', e.target.value)}
                    placeholder="1010xxxxxx"
                    className="bg-slate-900 border-slate-700 text-white"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">معلومات الاتصال</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">
                  رقم الهاتف
                </Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    value={settings.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+966 5x xxx xxxx"
                    className="bg-slate-900 border-slate-700 text-white pr-10"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={settings.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="info@company.com"
                    className="bg-slate-900 border-slate-700 text-white pr-10"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-slate-300">
                  العنوان
                </Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  <Textarea
                    id="address"
                    value={settings.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="المملكة العربية السعودية، الرياض، حي العليا..."
                    className="bg-slate-900 border-slate-700 text-white pr-10 min-h-[80px] resize-none"
                    dir="auto"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-slate-300">
                  الموقع الإلكتروني
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={settings.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://www.company.com"
                  className="bg-slate-900 border-slate-700 text-white"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="poBox" className="text-slate-300">
                  صندوق البريد
                </Label>
                <Input
                  id="poBox"
                  value={settings.po_box || ''}
                  onChange={(e) => handleChange('po_box', e.target.value)}
                  placeholder="12345"
                  className="bg-slate-900 border-slate-700 text-white"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
