import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Fetch students with their bus stop information
    const students = await prisma.student.findMany({
      include: {
        busStop: true
      }
    })

    // Transform data for Excel export
    const exportData = students.map(student => ({
      Name: student.name,
      Phone: student.phone,
      'Bus Stop': student.busStop.name
    }))

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    })

    // Return Excel file
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