import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.payment_status === "paid") {
          const paymentId = session.metadata?.paymentId
          
          if (paymentId) {
            await prisma.payment.update({
              where: { id: paymentId },
              data: {
                status: "PAID",
                method: "STRIPE",
                stripeId: session.id,
              },
            })
          }
        }
        break

      case "payment_intent.payment_failed":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Buscar el pago por el payment_intent_id si está disponible
        if (paymentIntent.metadata?.paymentId) {
          await prisma.payment.update({
            where: { id: paymentIntent.metadata.paymentId },
            data: { status: "CANCELLED" },
          })
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}



