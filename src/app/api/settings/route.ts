import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidateTag as revalidate } from 'next/cache'

// Helper function to bypass type issues with revalidateTag
function revalidateTag(tag: string) {
  revalidate(tag as any, [] as any)
}

// GET /api/settings?module=X - Get all settings for a module
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const module = searchParams.get('module')

    const where: any = {}
    if (module) {
      where.module = module
    }

    const configs = await prisma.systemConfig.findMany({
      where,
      orderBy: [{ module: 'asc' }, { key: 'asc' }],
    })

    // Group by module and parse values
    const grouped: Record<string, Record<string, any>> = {}
    for (const config of configs) {
      if (!grouped[config.module]) {
        grouped[config.module] = {}
      }

      let parsedValue: any = config.value
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

    return NextResponse.json({
      success: true,
      configs: module ? grouped[module] || {} : grouped,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'فشل جلب الإعدادات', success: false },
      { status: 500 }
    )
  }
}

// PATCH /api/settings - Update settings
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { module, key, value } = body

    if (!module || !key) {
      return NextResponse.json(
        { error: 'module و key مطلوبان', success: false },
        { status: 400 }
      )
    }

    // Get existing config to determine type
    const existing = await prisma.systemConfig.findUnique({
      where: {
        module_key: { module, key },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'الإعداد غير موجود', success: false },
        { status: 404 }
      )
    }

    // Convert value to string based on type
    let stringValue: string
    if (existing.type === 'BOOLEAN') {
      stringValue = String(value === true || value === 'true')
    } else if (existing.type === 'NUMBER') {
      stringValue = String(Number(value))
    } else if (existing.type === 'JSON' || existing.type === 'LIST') {
      stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    } else {
      stringValue = String(value)
    }

    // Get user ID from session token
    const userId = (session as any)?.user?.id || 'system'

    // Update config
    const updated = await prisma.systemConfig.update({
      where: {
        module_key: { module, key },
      },
      data: {
        value: stringValue,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    })

    // Revalidate cache
    revalidateTag('config')
    revalidateTag(`config:${module}`)
    revalidateTag(`config:${module}:${key}`)

    return NextResponse.json({
      success: true,
      config: updated,
      message: 'تم تحديث الإعداد بنجاح',
    })
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json(
      { error: 'فشل تحديث الإعداد', success: false },
      { status: 500 }
    )
  }
}

// POST /api/settings - Update multiple settings at once
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { settings } = body // Array of { module, key, value }

    if (!Array.isArray(settings) || settings.length === 0) {
      return NextResponse.json(
        { error: 'settings array مطلوب', success: false },
        { status: 400 }
      )
    }

    // Get user ID from session token
    const userId = (session as any)?.user?.id || 'system'

    // Update all settings
    const updates = await Promise.all(
      settings.map(async ({ module, key, value }) => {
        const existing = await prisma.systemConfig.findUnique({
          where: {
            module_key: { module, key },
          },
        })

        if (!existing) return null

        let stringValue: string
        if (existing.type === 'BOOLEAN') {
          stringValue = String(value === true || value === 'true')
        } else if (existing.type === 'NUMBER') {
          stringValue = String(Number(value))
        } else if (existing.type === 'JSON' || existing.type === 'LIST') {
          stringValue = typeof value === 'string' ? value : JSON.stringify(value)
        } else {
          stringValue = String(value)
        }

        return prisma.systemConfig.update({
          where: {
            module_key: { module, key },
          },
          data: {
            value: stringValue,
            updatedBy: userId,
            updatedAt: new Date(),
          },
        })
      })
    )

    // Revalidate all config caches
    revalidateTag('config')

    return NextResponse.json({
      success: true,
      updated: updates.filter(Boolean).length,
      message: 'تم تحديث الإعدادات بنجاح',
    })
  } catch (error) {
    console.error('Error batch updating settings:', error)
    return NextResponse.json(
      { error: 'فشل تحديث الإعدادات', success: false },
      { status: 500 }
    )
  }
}
