import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/workers/[id] - Get single worker
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const worker = await prisma.worker.findUnique({
      where: { id },
      include: {
        projectWorkers: {
          include: {
            project: true
          }
        },
        salaries: {
          orderBy: [
            { year: 'desc' },
            { month: 'desc' }
          ],
          take: 12
        },
        overtimePays: {
          orderBy: { date: 'desc' },
          take: 20
        },
        attendanceRecords: {
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    })

    if (!worker) {
      return NextResponse.json(
        { error: 'Worker not found' },
        { status: 404 }
      )
    }

    // Calculate expiry warnings
    const today = new Date()
    const getDaysUntil = (date: Date | null) => {
      if (!date) return null
      const diff = new Date(date).getTime() - today.getTime()
      return Math.ceil(diff / (1000 * 60 * 60 * 24))
    }

    return NextResponse.json({
      ...worker,
      residenceDaysLeft: getDaysUntil(worker.residenceExpiry),
      idDaysLeft: getDaysUntil(worker.idExpiry),
      licenseDaysLeft: getDaysUntil(worker.licenseExpiry)
    })
  } catch (error) {
    console.error('Error fetching worker:', error)
    return NextResponse.json(
      { error: 'Failed to fetch worker' },
      { status: 500 }
    )
  }
}

// PUT /api/workers/[id] - Update worker
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const worker = await prisma.worker.update({
      where: { id },
      data: {
        ...body,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
        joinDate: body.joinDate ? new Date(body.joinDate) : undefined,
        residenceExpiry: body.residenceExpiry ? new Date(body.residenceExpiry) : undefined,
        idExpiry: body.idExpiry ? new Date(body.idExpiry) : undefined,
        licenseExpiry: body.licenseExpiry ? new Date(body.licenseExpiry) : undefined,
      }
    })

    return NextResponse.json(worker)
  } catch (error) {
    console.error('Error updating worker:', error)
    return NextResponse.json(
      { error: 'Failed to update worker' },
      { status: 500 }
    )
  }
}

// DELETE /api/workers/[id] - Delete worker
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.worker.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting worker:', error)
    return NextResponse.json(
      { error: 'Failed to delete worker' },
      { status: 500 }
    )
  }
}
