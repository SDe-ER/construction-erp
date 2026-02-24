import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const module = searchParams.get('module')

    // Build where clause
    const where: any = {}
    if (module) {
      where.module = module
    }

    // Fetch configs
    const configs = await prisma.systemConfig.findMany({
      where,
      orderBy: [
        { module: 'asc' },
        { key: 'asc' },
      ],
    })

    // Return all configs - client will parse values based on type
    return NextResponse.json({
      success: true,
      configs,
      count: configs.length,
    })
  } catch (error) {
    console.error('Error fetching configs:', error)
    return NextResponse.json(
      { error: 'فشل جلب الإعدادات', success: false },
      { status: 500 }
    )
  }
}
