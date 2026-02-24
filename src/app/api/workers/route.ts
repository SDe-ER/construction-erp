import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { workerSchema } from '@/lib/validators'

// GET /api/workers - Get all workers with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const nationality = searchParams.get('nationality')
    const projectId = searchParams.get('projectId')
    const search = searchParams.get('search')

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (nationality) {
      where.nationality = nationality
    }

    if (projectId) {
      where.projectWorkers = {
        some: {
          projectId
        }
      }
    }

    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { idNumber: { contains: search } },
        { phone: { contains: search } }
      ]
    }

    const workers = await prisma.worker.findMany({
      where,
      include: {
        projectWorkers: {
          include: {
            project: {
              select: {
                id: true,
            name: true,
            code: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Add expiry warnings
    const workersWithWarnings = workers.map(worker => {
      const today = new Date()
      const residenceExpiry = worker.residenceExpiry ? new Date(worker.residenceExpiry) : null
      const idExpiry = worker.idExpiry ? new Date(worker.idExpiry) : null
      const licenseExpiry = worker.licenseExpiry ? new Date(worker.licenseExpiry) : null

      const getDaysUntil = (date: Date | null) => {
        if (!date) return null
        const diff = date.getTime() - today.getTime()
        return Math.ceil(diff / (1000 * 60 * 60 * 24))
      }

      return {
        ...worker,
        residenceDaysLeft: getDaysUntil(residenceExpiry),
        idDaysLeft: getDaysUntil(idExpiry),
        licenseDaysLeft: getDaysUntil(licenseExpiry),
        hasExpiryWarning: [
          getDaysUntil(residenceExpiry),
          getDaysUntil(idExpiry),
          getDaysUntil(licenseExpiry)
        ].some(days => days !== null && days < 90)
      }
    })

    return NextResponse.json(workersWithWarnings)
  } catch (error) {
    console.error('Error fetching workers:', error)
    return NextResponse.json({ error: 'Failed to fetch workers' }, { status: 500 })
  }
}

// POST /api/workers - Create new worker
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate with Zod
    const validatedData = workerSchema.parse(body)

    // Check if ID number already exists
    const existingWorker = await prisma.worker.findUnique({
      where: { idNumber: validatedData.idNumber }
    })

    if (existingWorker) {
      return NextResponse.json(
        { error: 'رقم الهوية مسجل بالفعل' },
        { status: 400 }
      )
    }

    const worker = await prisma.worker.create({
      data: {
        ...validatedData,
        joinDate: new Date(validatedData.joinDate),
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
        residenceExpiry: validatedData.residenceExpiry ? new Date(validatedData.residenceExpiry) : null,
        idExpiry: validatedData.idExpiry ? new Date(validatedData.idExpiry) : null,
        licenseExpiry: validatedData.licenseExpiry ? new Date(validatedData.licenseExpiry) : null,
      }
    })

    return NextResponse.json(worker, { status: 201 })
  } catch (error) {
    console.error('Error creating worker:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create worker' },
      { status: 500 }
    )
  }
}
