import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request) {
    try {
        const { name, phone, busStopId } = await request.json()
        const newStudent = await prisma.student.create({
            data: {
                name,
                phone,
                busStopId
            }
        })
        return NextResponse.json(newStudent)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create student' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const students = await prisma.student.findMany({
            include: {
                busStop: true
            }
        })
        return NextResponse.json(students)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch students' },
            { status: 500 }
        )
    }
}