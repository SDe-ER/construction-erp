import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/attendance - Get attendance records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const projectId = searchParams.get('projectId')

    const where: any = {}

    if (date) {
      const dateObj = new Date(date)
      const nextDay = new Date(dateObj)
      nextDay.setDate(nextDay.getDate() + 1)

      where.date = {
        gte: dateObj,
        lt: nextDay
      }
    }

    if (projectId) {
      where.projectId = projectId
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        worker: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            profileImg: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

// POST /api/attendance - Record attendance (bulk or single)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { records } = body // Expecting array of attendance records

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: 'Invalid attendance records' },
        { status: 400 }
      )
    }

    // Create attendance records
    const attendance = await prisma.attendance.createMany({
      data: records.map((record: any) => ({
        workerId: record.workerId,
        date: new Date(record.date),
        status: record.status,
        projectId: record.projectId,
        notes: record.notes
      })),
      skipDuplicates: true
    })

    return NextResponse.json({
      success: true,
      count: attendance.count
    })
  } catch (error) {
    console.error('Error creating attendance:', error)
    return NextResponse.json(
      { error: 'Failed to create attendance records' },
      { status: 500 }
    )
  }
}
