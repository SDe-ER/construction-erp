import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/workers/[id]/overtime - Get overtime records
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const overtimeRecords = await prisma.overtimePay.findMany({
      where: { workerId: id },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(overtimeRecords)
  } catch (error) {
    console.error('Error fetching overtime:', error)
    return NextResponse.json(
      { error: 'Failed to fetch overtime records' },
      { status: 500 }
    )
  }
}

// POST /api/workers/[id]/overtime - Add overtime payment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const overtime = await prisma.overtimePay.create({
      data: {
        workerId: id,
        amount: body.amount,
        date: new Date(body.date),
        projectId: body.projectId,
        description: body.description
      }
    })

    return NextResponse.json(overtime, { status: 201 })
  } catch (error) {
    console.error('Error creating overtime:', error)
    return NextResponse.json(
      { error: 'Failed to create overtime record' },
      { status: 500 }
    )
  }
}
