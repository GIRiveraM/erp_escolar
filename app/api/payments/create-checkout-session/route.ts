import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { paymentId } = await request.json()

    // Obtener el pago
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        student: {
          include: { user: true }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 })
    }

    // Verificar que el usuario tiene acceso a este pago
    if (session.user.role === "STUDENT" && payment.student.userId !== session.user.id) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    if (session.user.role === "PARENT") {
      const parent = await prisma.parent.findUnique({
        where: { userId: session.user.id },
        include: { students: true }
      })
      
      if (!parent?.students.some(student => student.id === payment.studentId)) {
        return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
      }
    }

    // Crear sesión de checkout de Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Mensualidad ${payment.month}/${payment.year}`,
              description: `Pago de mensualidad para ${payment.student.user.email}`,
            },
            unit_amount: Math.round(payment.amount * 100), // Convertir a centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/payments?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/payments?canceled=true`,
      metadata: {
        paymentId: payment.id,
        studentId: payment.studentId,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}



