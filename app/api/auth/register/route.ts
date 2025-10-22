import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, role, phone, studentId, grade, section } = body

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 400 }
      )
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear usuario y perfil específico
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        ...(role === "STUDENT" && {
          student: {
            create: {
              firstName,
              lastName,
              studentId,
              grade,
              section,
              phone,
              birthDate: new Date(), // Se puede modificar después
            }
          }
        }),
        ...(role === "PARENT" && {
          parent: {
            create: {
              firstName,
              lastName,
              phone,
            }
          }
        }),
        ...(role === "TEACHER" && {
          teacher: {
            create: {
              firstName,
              lastName,
              phone,
              subject: "General", // Se puede modificar después
            }
          }
        }),
      },
    })

    return NextResponse.json(
      { message: "Usuario creado exitosamente", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}



