import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/project-templates - Get all templates
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templates = await prisma.projectTemplate.findMany({
      orderBy: [{ createdAt: 'desc' }],
    })

    return NextResponse.json({
      success: true,
      templates,
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'فشل جلب القوالب', success: false },
      { status: 500 }
    )
  }
}

// POST /api/project-templates - Create new template
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, icon, color, phases } = body

    if (!name || !phases || phases.length === 0) {
      return NextResponse.json(
        { error: 'الاسم والمراحل مطلوبان', success: false },
        { status: 400 }
      )
    }

    const template = await prisma.projectTemplate.create({
      data: {
        name,
        description,
        icon: icon || '🏗️',
        color: color || '#14b8a6',
        phases,
        isActive: true,
        usageCount: 0,
      },
    })

    return NextResponse.json({
      success: true,
      template,
      message: 'تم إنشاء القالب بنجاح',
    })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'فشل إنشاء القالب', success: false },
      { status: 500 }
    )
  }
}

// PUT /api/project-templates - Update template
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, name, description, icon, color, phases, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'معرف القالب مطلوب', success: false },
        { status: 400 }
      )
    }

    const template = await prisma.projectTemplate.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(icon && { icon }),
        ...(color && { color }),
        ...(phases && { phases }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json({
      success: true,
      template,
      message: 'تم تحديث القالب بنجاح',
    })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'فشل تحديث القالب', success: false },
      { status: 500 }
    )
  }
}
