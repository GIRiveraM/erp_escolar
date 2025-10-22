import twilio from "twilio"

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendSMS(to: string, message: string) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    })
    
    return { success: true, messageId: result.sid }
  } catch (error) {
    console.error("Error sending SMS:", error)
    return { success: false, error: error.message }
  }
}

export async function sendWhatsApp(to: string, message: string) {
  try {
    // Formatear número para WhatsApp (remover + y agregar whatsapp:)
    const whatsappNumber = `whatsapp:${to.replace("+", "")}`
    const fromNumber = `whatsapp:${process.env.TWILIO_PHONE_NUMBER?.replace("+", "")}`
    
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: whatsappNumber,
    })
    
    return { success: true, messageId: result.sid }
  } catch (error) {
    console.error("Error sending WhatsApp:", error)
    return { success: false, error: error.message }
  }
}



