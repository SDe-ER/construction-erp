'use client'

import { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react'

// Config types
type ConfigType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'COLOR' | 'LIST'

interface SystemConfig {
  module: string
  key: string
  value: string
  type: ConfigType
  label: string
  description?: string
  isPublic: boolean
  updatedBy?: string
  updatedAt: string
}

interface ConfigContextType {
  configs: Record<string, Record<string, any>>
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  get: <T = any>(module: string, key: string) => T | null
  getAll: () => Record<string, Record<string, any>>
  getModule: <T = any>(module: string) => Record<string, T>
  isEnabled: (module: string) => boolean
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [configs, setConfigs] = useState<Record<string, Record<string, any>>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all configs on mount
  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/config')
      if (!res.ok) throw new Error('فشل جلب الإعدادات')
      const data = await res.json()

      // Group configs by module
      const grouped: Record<string, Record<string, any>> = {}
      for (const config of data.configs || []) {
        if (!grouped[config.module]) {
          grouped[config.module] = {}
        }
        // Parse value based on type
        let parsedValue = config.value
        if (config.type === 'BOOLEAN') {
          parsedValue = config.value === 'true'
        } else if (config.type === 'NUMBER') {
          parsedValue = Number(config.value)
        } else if (config.type === 'JSON' || config.type === 'LIST') {
          try {
            parsedValue = JSON.parse(config.value)
          } catch {
            parsedValue = config.value
          }
        }
        grouped[config.module][config.key] = {
          value: parsedValue,
          type: config.type,
          label: config.label,
          description: config.description,
        }
      }

      setConfigs(grouped)
    } catch (err) {
      console.error('Error fetching configs:', err)
      setError('فشل تحميل الإعدادات')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount
  useEffect(() => {
    fetchConfigs()
  }, [fetchConfigs])

  // Get a single config value
  const get = useCallback(<T = any>(module: string, key: string): T | null => {
    return configs[module]?.[key]?.value ?? null
  }, [configs])

  // Get all configs
  const getAll = useCallback(() => {
    return configs
  }, [configs])

  // Get all configs for a module
  const getModule = useCallback(<T = any>(module: string): Record<string, T> => {
    const moduleConfig = configs[module] || {}
    const result: Record<string, any> = {}
    for (const [key, config] of Object.entries(moduleConfig)) {
      result[key] = config.value
    }
    return result as Record<string, T>
  }, [configs])

  // Check if a module is enabled
  const isEnabled = useCallback((module: string): boolean => {
    const enabledModules = get<string[]>('ui', 'enabled_modules') || ['kanban', 'gantt', 'resources', 'risks', 'documents', 'analytics']
    return enabledModules.includes(module)
  }, [get])

  const value: ConfigContextType = {
    configs,
    loading,
    error,
    refresh: fetchConfigs,
    get,
    getAll,
    getModule,
    isEnabled,
  }

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}

// Hook to use config
export function useConfig(module?: string, key?: string) {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider')
  }

  if (module && key) {
    return context.get(module, key)
  }

  if (module) {
    return context.getModule(module)
  }

  return context.getAll()
}

// Hook to check if module is enabled
export function useIsModuleEnabled(moduleName: string): boolean {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useIsModuleEnabled must be used within ConfigProvider')
  }
  return context.isEnabled(moduleName)
}

// Hook to get app config
export function useAppConfig() {
  const get = useConfig()
  return {
    appName: get('general', 'app_name') || 'نظام ERP المقاولات',
    appVersion: get('general', 'app_version') || '4.0',
    currency: get('general', 'currency') || 'SAR',
    dateFormat: get('general', 'date_format') || 'DD/MM/YYYY',
    workDays: get('general', 'work_days') || [0, 1, 2, 3, 4],
  }
}
