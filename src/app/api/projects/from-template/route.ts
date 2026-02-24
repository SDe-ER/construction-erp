import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/projects/from-template - Create project from template
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { templateId } = body

    if (!templateId) {
      return NextResponse.json(
        { error: 'معرف القالب مطلوب', success: false },
        { status: 400 }
      )
    }

    // Get template
    const template = await prisma.projectTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'القالب غير موجود', success: false },
        { status: 404 }
      )
    }

    // Create project from template
    const project = await prisma.$transaction(async (tx) => {
      // Calculate dates
      const startDate = new Date()
      let totalDuration = 0
      template.phases?.forEach((phase: any) => {
        totalDuration += phase.duration || 0
      })
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + totalDuration)

      // Create project
      const newProject = await tx.project.create({
        data: {
          name: template.name,
          code: `PRJ-${Date.now()}`,
          startDate,
          endDate,
          status: 'PLANNING',
          pricingType: 'METER',
          description: template.description,
          templateId: template.id,
        },
      })

      // Create phases and tasks
      let currentDate = new Date(startDate)
      for (const phase of template.phases || []) {
        const phaseEndDate = new Date(currentDate)
        phaseEndDate.setDate(phaseEndDate.getDate() + (phase.duration || 7))

        const newPhase = await tx.projectPhase.create({
          data: {
            projectId: newProject.id,
            name: phase.name,
            duration: phase.duration || 7,
            order: 0,
            color: template.color,
            icon: '📋',
            startDate: currentDate,
            endDate: phaseEndDate,
          },
        })

        // Create tasks for this phase
        for (const task of phase.tasks || []) {
          await tx.task.create({
            data: {
              projectId: newProject.id,
              phaseId: newPhase.id,
              title: task.title,
              priority: task.priority || 'MEDIUM',
              status: 'TODO',
            },
          })
        }

        currentDate = phaseEndDate
      }

      // Increment template usage count
      await tx.projectTemplate.update({
        where: { id: templateId },
        data: {
          usageCount: {
            increment: 1,
          },
        },
      })

      return newProject
    })

    return NextResponse.json({
      success: true,
      project,
      message: 'تم إنشاء المشروع بنجاح',
    })
  } catch (error) {
    console.error('Error creating project from template:', error)
    return NextResponse.json(
      { error: 'فشل إنشاء المشروع', success: false },
      { status: 500 }
    )
  }
}
