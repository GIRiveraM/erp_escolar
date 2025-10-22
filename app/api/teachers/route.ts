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

    let teachers

    if (session.user.role === "ADMIN") {
      teachers = await prisma.teacher.findMany({
        include: {
          user: true,
          classes: {
            include: {
              enrollments: {
                include: { student: true }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    } else {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}



