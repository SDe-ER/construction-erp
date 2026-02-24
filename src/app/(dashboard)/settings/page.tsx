'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Building2,
  Palette,
  DollarSign,
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CompanySection } from './sections/CompanySection'
import { BrandingSection } from './sections/BrandingSection'
import { FinanceSection } from './sections/FinanceSection'

// Sidebar navigation items
const SECTIONS = [
  {
    id: 'company',
    label: 'بيانات الشركة',
    icon: Building2,
    color: 'bg-blue-500',
    description: 'المعلومات الأساسية للشركة',
  },
  {
    id: 'branding',
    label: 'الهوية البصرية',
    icon: Palette,
    color: 'bg-purple-500',
    description: 'الألوان والخطوط والمظهر',
  },
  {
    id: 'finance',
    label: 'المالية',
    icon: DollarSign,
    color: 'bg-green-500',
    description: 'العملة والضرائب والصيغ',
  },
]

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const section = searchParams.get('section') || 'company'

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Settings state for each section
  const [companySettings, setCompanySettings] = useState<any>({})
  const [brandingSettings, setBrandingSettings] = useState<any>({})
  const [financeSettings, setFinanceSettings] = useState<any>({})

  // Fetch settings for a section
  const fetchSettings = async (module: string) => {
    try {
      const res = await fetch(`/api/settings?module=${module}`)
      const data = await res.json()
      if (data.success) {
        const parsed: any = {}
        for (const [key, config] of Object.entries(data.configs)) {
          parsed[key] = (config as any).value
        }
        return parsed
      }
      return {}
    } catch (error) {
      console.error('Error fetching settings:', error)
      return {}
    }
  }

  // Load settings for current section
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true)
      const settings = await fetchSettings(section)
      if (section === 'company') setCompanySettings(settings)
      else if (section === 'branding') setBrandingSettings(settings)
      else if (section === 'finance') setFinanceSettings(settings)
      setLoading(false)
    }
    loadSettings()
  }, [section])

  // Save settings for a section
  const saveSettings = async (module: string, settings: Record<string, any>) => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: Object.entries(settings).map(([key, value]) => ({
            module,
            key,
            value,
          })),
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success('تم حفظ الإعدادات بنجاح')
      } else {
        toast.error(data.error || 'فشل حفظ الإعدادات')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('فشل حفظ الإعدادات')
    } finally {
      setSaving(false)
    }
  }

  const currentSection = SECTIONS.find((s) => s.id === section) || SECTIONS[0]
  const CurrentIcon = currentSection.icon

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Sidebar Navigation */}
      <aside className="w-60 flex-shrink-0">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-2">
          <h2 className="text-lg font-bold text-white mb-4 px-2">الإعدادات</h2>

          {SECTIONS.map((item) => {
            const ItemIcon = item.icon
            const isActive = section === item.id

            return (
              <button
                key={item.id}
                onClick={() => router.push(`?section=${item.id}`)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                )}
              >
                <div className={cn('h-2 w-2 rounded-full', item.color)} />
                <ItemIcon className="h-4 w-4" />
                <span className="flex-1 text-right">{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-4 bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', currentSection.color)}>
                <CurrentIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{currentSection.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{currentSection.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {section === 'company' && (
              <CompanySection
                settings={companySettings}
                onChange={setCompanySettings}
                onSave={() => saveSettings('company', companySettings)}
                saving={saving}
              />
            )}

            {section === 'branding' && (
              <BrandingSection
                settings={brandingSettings}
                onChange={setBrandingSettings}
                onSave={() => saveSettings('branding', brandingSettings)}
                saving={saving}
              />
            )}

            {section === 'finance' && (
              <FinanceSection
                settings={financeSettings}
                onChange={setFinanceSettings}
                onSave={() => saveSettings('finance', financeSettings)}
                saving={saving}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
