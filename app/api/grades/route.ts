import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { studentId, subject, grade, type, comments } = await request.json()

    // Verificar que el maestro tiene acceso al estudiante
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id },
      include: {
        classes: {
          include: {
            enrollments: {
              where: { studentId }
            }
          }
        }
      }
    })

    const hasAccess = teacher?.classes.some(cls => 
      cls.enrollments.some(enrollment => enrollment.studentId === studentId)
    )

    if (!hasAccess) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    // Crear la calificación
    const newGrade = await prisma.grade.create({
      data: {
        studentId,
        teacherId: teacher.id,
        subject,
        grade,
        type,
        comments
      }
    })

    return NextResponse.json({ 
      message: "Calificación agregada exitosamente",
      grade: newGrade 
    })
  } catch (error) {
    console.error("Error creating grade:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}