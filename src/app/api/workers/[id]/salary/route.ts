import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/workers/[id]/salary - Pay monthly salary
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { month, year, overtimeTotal, deductions, absenceDays } = body

    // Get current user
    const session = await getServerSession(authOptions)

    // Get worker data
    const worker = await prisma.worker.findUnique({
      where: { id }
    })

    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 })
    }

    // Check if salary already exists for this month
    const existingSalary = await prisma.salary.findUnique({
      where: {
        workerId_month_year: {
          workerId: id,
          month,
          year
        }
      }
    })

    if (existingSalary) {
      return NextResponse.json(
        { error: 'تم صرف راتب هذا الشهر بالفعل' },
        { status: 400 }
      )
    }

    // Calculate salary
    const dailyRate = worker.baseSalary / 30
    const absenceDeduction = absenceDays * dailyRate
    const netSalary = worker.baseSalary + worker.foodAllowance + overtimeTotal - deductions - absenceDeduction

    // Get admin user for createdById if session not available
    let createdById = session?.user?.id
    if (!createdById) {
      const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      })
      createdById = admin?.id || '00000000-0000-0000-0000-000000000000'
    }

    const salary = await prisma.salary.create({
      data: {
        workerId: id,
        month,
        year,
        baseSalary: worker.baseSalary,
        foodAllowance: worker.foodAllowance,
        overtimeTotal: overtimeTotal || 0,
        deductions: deductions || 0,
        absenceDays: absenceDays || 0,
        absenceDeduction,
        netSalary,
        isPaid: true,
        paidAt: new Date(),
        createdById
      }
    })

    return NextResponse.json(salary)
  } catch (error) {
    console.error('Error creating salary:', error)
    return NextResponse.json(
      { error: 'Failed to create salary' },
      { status: 500 }
    )
  }
}
