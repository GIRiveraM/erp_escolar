import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { studentId, amount, month, year } = await request.json()

    // Verificar que el estudiante existe
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 })
    }

    // Verificar que no existe un pago para el mismo mes/año
    const existingPayment = await prisma.payment.findFirst({
      where: {
        studentId,
        month,
        year
      }
    })

    if (existingPayment) {
      return NextResponse.json({ error: "Ya existe un pago para este mes" }, { status: 400 })
    }

    // Crear el pago
    const payment = await prisma.payment.create({
      data: {
        studentId,
        amount,
        month,
        year,
        status: "PENDING"
      }
    })

    return NextResponse.json({ 
      message: "Pago creado exitosamente",
      payment 
    })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}