'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Toaster } from '@/components/ui/sonner'
import { ConfigProvider } from '@/providers/ConfigProvider'

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Create a client-side QueryClient instance
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new client
    return makeQueryClient()
  } else {
    // Browser: create a client once and reuse
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <div className="min-h-screen bg-slate-950 font-sans" dir="rtl">
          {/* Sidebar */}
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

          {/* Main Content */}
          <div
            className={`transition-all duration-300 ${
              sidebarCollapsed ? 'mr-20' : 'mr-72'
            }`}
          >
            <Header onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

            <main className="p-6">
              {children}
            </main>
          </div>

          {/* Toast Notifications */}
          <Toaster
            position="top-left"
            richColors
            closeButton
            dir="rtl"
          />
        </div>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
