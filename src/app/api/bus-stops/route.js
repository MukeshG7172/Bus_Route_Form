import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const busStops = await prisma.busStop.findMany()
    return NextResponse.json(busStops)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bus stops' }, 
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json()
    const newBusStop = await prisma.busStop.create({
      data: { name }
    })
    return NextResponse.json(newBusStop)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create bus stop' }, 
      { status: 500 }
    )
  }
}