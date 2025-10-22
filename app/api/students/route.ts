import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    let students

    if (session.user.role === "ADMIN") {
      students = await prisma.student.findMany({
        include: {
          user: true,
          parent: {
            include: { user: true }
          },
          grades: true,
          payments: true
        },
        orderBy: { createdAt: "desc" }
      })
    } else if (session.user.role === "TEACHER") {
      // Obtener estudiantes de las clases del maestro
      const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id },
        include: {
          classes: {
            include: {
              enrollments: {
                include: {
                  student: {
                    include: {
                      user: true,
                      parent: {
                        include: { user: true }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })
      
      students = teacher?.classes.flatMap(cls => 
        cls.enrollments.map(enrollment => enrollment.student)
      ) || []
    } else if (session.user.role === "PARENT") {
      const parent = await prisma.parent.findUnique({
        where: { userId: session.user.id },
        include: {
          students: {
            include: {
              user: true,
              grades: true,
              payments: true
            }
          }
        }
      })
      students = parent?.students || []
    } else {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}



