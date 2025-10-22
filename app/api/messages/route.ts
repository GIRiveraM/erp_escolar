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

    const { studentId, parentId, type, content } = await request.json()

    // Verificar que el estudiante y padre existen
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: true }
    })

    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 })
    }

    if (!student.parent) {
      return NextResponse.json({ error: "Padre no encontrado" }, { status: 404 })
    }

    // Crear el mensaje
    const message = await prisma.message.create({
      data: {
        studentId,
        parentId: student.parent.id,
        type,
        content,
        status: "PENDING"
      }
    })

    return NextResponse.json({ 
      message: "Mensaje creado exitosamente",
      messageId: message.id 
    })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}