import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        busStop: true
      }
    })

    const exportData = students.map(student => ({
      Name: student.name,
      Phone: student.phone,
      Year: student.year,
      'Bus Stop': student.busStop.name
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')

    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    })
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=students.xlsx'
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export students' }, 
      { status: 500 }
    )
  }
}