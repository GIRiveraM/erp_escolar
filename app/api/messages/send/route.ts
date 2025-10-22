import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendSMS, sendWhatsApp } from "@/lib/messaging"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { studentId, type, content } = await request.json()

    // Obtener información del estudiante y padre
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        parent: true,
        user: true
      }
    })

    if (!student || !student.parent) {
      return NextResponse.json({ error: "Estudiante o padre no encontrado" }, { status: 404 })
    }

    // Crear registro del mensaje
    const message = await prisma.message.create({
      data: {
        studentId,
        parentId: student.parent.id,
        type,
        content,
        status: "PENDING"
      }
    })

    // Enviar mensaje según el tipo
    let result
    if (type === "SMS") {
      result = await sendSMS(student.parent.phone, content)
    } else if (type === "WHATSAPP") {
      result = await sendWhatsApp(student.parent.phone, content)
    }

    // Actualizar estado del mensaje
    if (result?.success) {
      await prisma.message.update({
        where: { id: message.id },
        data: {
          status: "SENT",
          sentAt: new Date()
        }
      })
    } else {
      await prisma.message.update({
        where: { id: message.id },
        data: { status: "FAILED" }
      })
    }

    return NextResponse.json({ 
      message: "Mensaje enviado exitosamente",
      messageId: message.id 
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}



