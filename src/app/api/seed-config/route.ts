import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// الإعدادات الافتراضية للنظام
const DEFAULT_CONFIGS = [
  // MODULE: "general"
  { module: 'general', key: 'app_name', value: 'نظام إدارة المشاريع', type: 'STRING', label: 'اسم التطبيق' },
  { module: 'general', key: 'app_version', value: '4.0', type: 'STRING', label: 'الإصدار' },
  { module: 'general', key: 'currency', value: 'SAR', type: 'STRING', label: 'العملة' },
  { module: 'general', key: 'timezone', value: 'Asia/Riyadh', type: 'STRING', label: 'المنطقة الزمنية' },
  { module: 'general', key: 'date_format', value: 'DD/MM/YYYY', type: 'STRING', label: 'صيغة التاريخ' },
  { module: 'general', key: 'work_days', value: '[0,1,2,3,4]', type: 'JSON', label: 'أيام العمل (0=أحد)' },

  // MODULE: "projects"
  {
    module: 'projects',
    key: 'default_phase_colors',
    value: '["#14b8a6","#06b6d4","#7c3aed","#f97316","#10b981"]',
    type: 'JSON',
    label: 'ألوان المراحل الافتراضية'
  },
  {
    module: 'projects',
    key: 'progress_calculation',
    value: 'tasks',
    type: 'STRING',
    label: 'حساب التقدم: tasks|manual|weighted'
  },
  {
    module: 'projects',
    key: 'auto_progress',
    value: 'true',
    type: 'BOOLEAN',
    label: 'تحديث تقدم المرحلة تلقائياً'
  },
  {
    module: 'projects',
    key: 'allow_overdue_tasks',
    value: 'true',
    type: 'BOOLEAN',
    label: 'السماح بتجاوز المواعيد'
  },
  {
    module: 'projects',
    key: 'task_custom_fields',
    value: '[]',
    type: 'JSON',
    label: 'الحقول المخصصة للمهام'
  },
  {
    module: 'projects',
    key: 'default_task_statuses',
    value: '["TODO","IN_PROGRESS","IN_REVIEW","DONE"]',
    type: 'JSON',
    label: 'حالات المهام المعروضة'
  },

  // MODULE: "ui"
  {
    module: 'ui',
    key: 'enabled_modules',
    value: '["kanban","gantt","resources","risks","documents","analytics"]',
    type: 'JSON',
    label: 'الوحدات المفعّلة'
  },
  {
    module: 'ui',
    key: 'default_project_view',
    value: 'kanban',
    type: 'STRING',
    label: 'العرض الافتراضي للمشاريع'
  },
  {
    module: 'ui',
    key: 'kanban_columns_order',
    value: '["TODO","IN_PROGRESS","IN_REVIEW","ON_HOLD","DONE"]',
    type: 'JSON',
    label: 'ترتيب أعمدة Kanban'
  },
  {
    module: 'ui',
    key: 'gantt_default_zoom',
    value: 'week',
    type: 'STRING',
    label: 'مستوى Zoom الافتراضي: day|week|month'
  },

  // MODULE: "notifications"
  {
    module: 'notifications',
    key: 'task_overdue_rule',
    value: 'IMMEDIATE',
    type: 'STRING',
    label: 'إشعار المهام المتأخرة'
  },
  {
    module: 'notifications',
    key: 'milestone_remind_days',
    value: '3',
    type: 'NUMBER',
    label: 'تذكير قبل المعلم بـ X يوم'
  },
  {
    module: 'notifications',
    key: 'daily_summary_time',
    value: '08:00',
    type: 'STRING',
    label: 'وقت الملخص اليومي'
  },
  {
    module: 'notifications',
    key: 'notify_on_risk_high',
    value: 'true',
    type: 'BOOLEAN',
    label: 'إشعار فوري عند مخاطرة عالية'
  },

  // MODULE: "permissions"
  {
    module: 'permissions',
    key: 'can_edit_tasks',
    value: '["ADMIN","USER"]',
    type: 'JSON',
    label: 'من يستطيع تعديل المهام'
  },
  {
    module: 'permissions',
    key: 'can_delete_projects',
    value: '["ADMIN"]',
    type: 'JSON',
    label: 'من يستطيع حذف المشاريع'
  },
  {
    module: 'permissions',
    key: 'can_export_reports',
    value: '["ADMIN","USER"]',
    type: 'JSON',
    label: 'من يستطيع تصدير التقارير'
  },
  {
    module: 'permissions',
    key: 'can_manage_risks',
    value: '["ADMIN"]',
    type: 'JSON',
    label: 'من يستطيع إدارة المخاطر'
  },

  // MODULE: "company"
  {
    module: 'company',
    key: 'company_name',
    value: 'شركة المقاولات الحديثة',
    type: 'STRING',
    label: 'اسم الشركة'
  },
  {
    module: 'company',
    key: 'logo_url',
    value: '',
    type: 'STRING',
    label: 'رابط الشعار'
  },
  {
    module: 'company',
    key: 'tax_number',
    value: '',
    type: 'STRING',
    label: 'الرقم الضريبي'
  },
  {
    module: 'company',
    key: 'commercial_reg',
    value: '',
    type: 'STRING',
    label: 'رقم السجل التجاري'
  },
  {
    module: 'company',
    key: 'phone',
    value: '',
    type: 'STRING',
    label: 'رقم الهاتف'
  },
  {
    module: 'company',
    key: 'email',
    value: '',
    type: 'STRING',
    label: 'البريد الإلكتروني'
  },
  {
    module: 'company',
    key: 'address',
    value: '',
    type: 'STRING',
    label: 'العنوان'
  },
  {
    module: 'company',
    key: 'website',
    value: '',
    type: 'STRING',
    label: 'الموقع الإلكتروني'
  },
  {
    module: 'company',
    key: 'po_box',
    value: '',
    type: 'STRING',
    label: 'صندوق البريد'
  },

  // MODULE: "branding"
  {
    module: 'branding',
    key: 'primary_color',
    value: '#3b82f6',
    type: 'COLOR',
    label: 'اللون الأساسي'
  },
  {
    module: 'branding',
    key: 'secondary_color',
    value: '#8b5cf6',
    type: 'COLOR',
    label: 'اللون الثانوي'
  },
  {
    module: 'branding',
    key: 'font_family',
    value: 'Cairo',
    type: 'STRING',
    label: 'خط التطبيق'
  },
  {
    module: 'branding',
    key: 'base_font_size',
    value: '14',
    type: 'NUMBER',
    label: 'حجم الخط الأساسي'
  },
  {
    module: 'branding',
    key: 'color_mode',
    value: 'dark',
    type: 'STRING',
    label: 'وضع الألوان: dark|light|auto'
  },

  // MODULE: "finance"
  {
    module: 'finance',
    key: 'currency',
    value: 'SAR',
    type: 'STRING',
    label: 'العملة الافتراضية'
  },
  {
    module: 'finance',
    key: 'vat_rate',
    value: '15',
    type: 'NUMBER',
    label: 'نسبة الضريبة المضافة (%)'
  },
  {
    module: 'finance',
    key: 'number_format',
    value: '1,000',
    type: 'STRING',
    label: 'صيغة الأرقام'
  },
  {
    module: 'finance',
    key: 'date_format',
    value: 'DD/MM/YYYY',
    type: 'STRING',
    label: 'صيغة التاريخ'
  },
  {
    module: 'finance',
    key: 'timezone',
    value: 'Asia/Riyadh',
    type: 'STRING',
    label: 'المنطقة الزمنية'
  },
  {
    module: 'finance',
    key: 'last_invoice_number',
    value: '1000',
    type: 'NUMBER',
    label: 'رقم آخر فاتورة'
  },
] as const

export async function POST(request: Request) {
  try {
    // التحقق من أن هذا الطلب مصرح به (يمكن إضافة التحقق من الـ session هنا)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // التحقق مما إذا كان قد تم بالفعل تشغيل الـ seed
    const existingCount = await prisma.systemConfig.count()
    if (existingCount > 0) {
      return NextResponse.json({
        message: 'الإعدادات موجودة بالفعل',
        existing: existingCount,
        note: 'لم يتم إضافة إعدادات جديدة لتجنب التكرار'
      })
    }

    // إنشاء الإعدادات الافتراضية
    const created = await prisma.systemConfig.createMany({
      data: DEFAULT_CONFIGS.map(config => ({
        module: config.module,
        key: config.key,
        value: config.value,
        type: config.type as any,
        label: config.label,
        isPublic: config.module === 'general' || config.module === 'ui', // الإعدادات العامة والعامة يمكن قراءتها من الـ frontend
      })),
    })

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الإعدادات الافتراضية بنجاح',
      created: created.count,
      configs: DEFAULT_CONFIGS.map(c => ({ module: c.module, key: c.key, label: c.label }))
    })
  } catch (error) {
    console.error('Error seeding config:', error)
    return NextResponse.json({
      error: 'فشل إنشاء الإعدادات',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET لعرض حالة الإعدادات الحالية
export async function GET() {
  try {
    const configs = await prisma.systemConfig.findMany({
      orderBy: [{ module: 'asc' }, { key: 'asc' }]
    })

    const grouped = configs.reduce((acc, config) => {
      if (!acc[config.module]) {
        acc[config.module] = []
      }
      acc[config.module].push(config)
      return acc
    }, {} as Record<string, typeof configs>)

    return NextResponse.json({
      total: configs.length,
      modules: Object.keys(grouped),
      configs: grouped
    })
  } catch (error) {
    return NextResponse.json({
      error: 'فشل جلب الإعدادات',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
