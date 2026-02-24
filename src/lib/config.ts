import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { revalidateTag } from 'next/cache'

// نوع بيانات الإعداد
export type ConfigType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'COLOR' | 'LIST'

export interface SystemConfigValue {
  module: string
  key: string
  value: string
  type: ConfigType
  label: string
  description?: string
}

// Cache tags for revalidation
export const CACHE_TAGS = {
  CONFIG: 'system-config',
  CONFIG_MODULE: (module: string) => `config-module-${module}`,
  CONFIG_KEY: (module: string, key: string) => `config-${module}-${key}`,
}

/**
 * جلب قيمة إعداد محدد
 * @param module - اسم الوحدة (مثل: "general", "projects", "ui")
 * @param key - مفتاح الإعداد
 * @returns القيمة (مُحَوَّلة من JSON إذا لزم الأمر)
 */
export async function getConfig<T = any>(
  module: string,
  key: string
): Promise<T | null> {
  const cache = unstable_cache(
    async () => {
      const config = await prisma.systemConfig.findUnique({
        where: {
          module_key: {
            module,
            key,
          },
        },
      })

      if (!config) return null

      return parseValue(config.value, config.type)
    },
    [`${module}-${key}`],
    {
      tags: [CACHE_TAGS.CONFIG, CACHE_TAGS.CONFIG_MODULE(module), CACHE_TAGS.CONFIG_KEY(module, key)],
      revalidate: 3600, // إعادة التحقق كل ساعة
    }
  )

  return cache()
}

/**
 * تحديث أو إنشاء إعداد
 * @param module - اسم الوحدة
 * @param key - مفتاح الإعداد
 * @param value - القيمة الجديدة
 * @param updatedBy - المستخدم الذي قام بالتحديث (اختياري)
 */
export async function setConfig(
  module: string,
  key: string,
  value: any,
  updatedBy?: string
): Promise<void> {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value)

  // تحديد النوع تلقائياً إذا لم يكن معروفاً
  let type: ConfigType = 'STRING'
  if (typeof value === 'boolean') type = 'BOOLEAN'
  else if (typeof value === 'number') type = 'NUMBER'
  else if (Array.isArray(value) || typeof value === 'object') type = 'JSON'

  await prisma.systemConfig.upsert({
    where: {
      module_key: {
        module,
        key,
      },
    },
    create: {
      module,
      key,
      value: stringValue,
      type,
      label: key, // افتراضي
      updatedBy,
    },
    update: {
      value: stringValue,
      type,
      updatedBy,
    },
  })

  // إعادة التحقق من الكاش
  revalidateTag(CACHE_TAGS.CONFIG)
  revalidateTag(CACHE_TAGS.CONFIG_MODULE(module))
  revalidateTag(CACHE_TAGS.CONFIG_KEY(module, key))
}

/**
 * جلب كل إعدادات وحدة معينة
 * @param module - اسم الوحدة
 * @returns كائن يحتوي على جميع الإعدادات
 */
export async function getModuleConfig(module: string): Promise<Record<string, any>> {
  const cache = unstable_cache(
    async () => {
      const configs = await prisma.systemConfig.findMany({
        where: { module },
      })

      const result: Record<string, any> = {}
      for (const config of configs) {
        result[config.key] = parseValue(config.value, config.type)
      }
      return result
    },
    [`module-${module}`],
    {
      tags: [CACHE_TAGS.CONFIG, CACHE_TAGS.CONFIG_MODULE(module)],
      revalidate: 3600,
    }
  )

  return cache()
}

/**
 * جلب إعدادات عامة (مثل: اسم التطبيق، العملة، إلخ)
 */
export async function getGeneralConfig(): Promise<{
  appName: string
  appVersion: string
  currency: string
  timezone: string
  dateFormat: string
  workDays: number[]
}> {
  const config = await getModuleConfig('general')
  return {
    appName: config.app_name || 'نظام إدارة المشاريع',
    appVersion: config.app_version || '4.0',
    currency: config.currency || 'SAR',
    timezone: config.timezone || 'Asia/Riyadh',
    dateFormat: config.date_format || 'DD/MM/YYYY',
    workDays: config.work_days || [0, 1, 2, 3, 4],
  }
}

/**
 * التحقق من أن وحدة مفعلة
 * @param moduleName - اسم الوحدة للتحقق (مثل: "kanban", "gantt", "risks")
 */
export async function isModuleEnabled(moduleName: string): Promise<boolean> {
  const config = await getConfig<string[]>('ui', 'enabled_modules')
  if (!config) return true // افتراضياً كل الوحدات مفعلة

  return config.includes(moduleName)
}

/**
 * جلب قائمة الوحدات المفعلة
 */
export async function getEnabledModules(): Promise<string[]> {
  const modules = await getConfig<string[]>('ui', 'enabled_modules')
  return modules || ['kanban', 'gantt', 'resources', 'risks', 'documents', 'analytics']
}

/**
 * جلب إعدادات المشاريع
 */
export async function getProjectConfig(): Promise<{
  phaseColors: string[]
  progressCalculation: 'tasks' | 'manual' | 'weighted'
  autoProgress: boolean
  allowOverdueTasks: boolean
  taskCustomFields: any[]
  defaultTaskStatuses: string[]
}> {
  const config = await getModuleConfig('projects')
  return {
    phaseColors: config.default_phase_colors || ['#14b8a6', '#06b6d4', '#7c3aed', '#f97316', '#10b981'],
    progressCalculation: config.progress_calculation || 'tasks',
    autoProgress: config.auto_progress === true,
    allowOverdueTasks: config.allow_overdue_tasks !== false,
    taskCustomFields: config.task_custom_fields || [],
    defaultTaskStatuses: config.default_task_statuses || ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'],
  }
}

/**
 * جلب إعدادات الإشعارات
 */
export async function getNotificationConfig(): Promise<{
  taskOverdueRule: 'IMMEDIATE' | 'DAILY_DIGEST' | 'WEEKLY' | 'DISABLED'
  milestoneRemindDays: number
  dailySummaryTime: string
  notifyOnRiskHigh: boolean
}> {
  const config = await getModuleConfig('notifications')
  return {
    taskOverdueRule: config.task_overdue_rule || 'IMMEDIATE',
    milestoneRemindDays: config.milestone_remind_days || 3,
    dailySummaryTime: config.daily_summary_time || '08:00',
    notifyOnRiskHigh: config.notify_on_risk_high !== false,
  }
}

/**
 * التحقق من الصلاحيات
 */
export async function hasPermission(
  permissionKey: 'can_edit_tasks' | 'can_delete_projects' | 'can_export_reports' | 'can_manage_risks',
  userRole: string
): Promise<boolean> {
  const allowedRoles = await getConfig<string[]>('permissions', permissionKey)
  if (!allowedRoles) return true // افتراضياً مسموح

  return allowedRoles.includes(userRole)
}

/**
 * تحويل القيمة من String إلى النوع المناسب
 */
function parseValue(value: string, type: ConfigType): any {
  switch (type) {
    case 'BOOLEAN':
      return value === 'true'
    case 'NUMBER':
      return Number(value)
    case 'JSON':
    case 'LIST':
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    default:
      return value
  }
}

/**
 * جلب جميع الإعدادات (للإدارة)
 */
export async function getAllConfigs(): Promise<Record<string, Record<string, any>>> {
  const cache = unstable_cache(
    async () => {
      const configs = await prisma.systemConfig.findMany({
        orderBy: [{ module: 'asc' }, { key: 'asc' }],
      })

      const grouped: Record<string, Record<string, any>> = {}
      for (const config of configs) {
        if (!grouped[config.module]) {
          grouped[config.module] = {}
        }
        grouped[config.module][config.key] = {
          value: parseValue(config.value, config.type),
          type: config.type,
          label: config.label,
          description: config.description,
        }
      }
      return grouped
    },
    ['all-configs'],
    {
      tags: [CACHE_TAGS.CONFIG],
      revalidate: 3600,
    }
  )

  return cache()
}

/**
 * حذف إعداد
 */
export async function deleteConfig(module: string, key: string): Promise<void> {
  await prisma.systemConfig.delete({
    where: {
      module_key: {
        module,
        key,
      },
    },
  })

  // إعادة التحقق من الكاش
  revalidateTag(CACHE_TAGS.CONFIG)
  revalidateTag(CACHE_TAGS.CONFIG_MODULE(module))
  revalidateTag(CACHE_TAGS.CONFIG_KEY(module, key))
}

/**
 * إعادة تعيين إعداد إلى القيمة الافتراضية
 */
export async function resetConfigToDefault(module: string, key: string): Promise<void> {
  // يمكن إضافة قيم افتراضية هنا
  const defaults: Record<string, Record<string, any>> = {
    general: {
      app_name: 'نظام إدارة المشاريع',
      currency: 'SAR',
    },
    projects: {
      progress_calculation: 'tasks',
    },
  }

  const defaultValue = defaults[module]?.[key]
  if (defaultValue !== undefined) {
    await setConfig(module, key, defaultValue)
  }
}
