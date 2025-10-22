"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Phone, Mail, CheckCircle, XCircle, Clock } from "lucide-react"

interface Message {
  id: string
  content: string
  type: "SMS" | "WHATSAPP" | "EMAIL"
  status: "PENDING" | "SENT" | "FAILED"
  sentAt?: string
  createdAt: string
  student: {
    firstName: string
    lastName: string
    studentId: string
  }
  parent: {
    firstName: string
    lastName: string
    phone: string
  }
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    studentId: "",
    type: "SMS",
    content: "",
    template: ""
  })

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages")
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ studentId: "", type: "SMS", content: "", template: "" })
        fetchMessages()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const handleTemplateChange = (template: string) => {
    const templates = {
      payment: "Estimado padre/madre, le recordamos que tiene un pago pendiente de mensualidad. Por favor, acérquese a la administración para regularizar su situación.",
      grades: "Estimado padre/madre, las calificaciones de su hijo/a ya están disponibles en el sistema. Puede consultarlas ingresando a su cuenta.",
      meeting: "Estimado padre/madre, le invitamos a la reunión de padres programada para el próximo viernes a las 3:00 PM en el auditorio principal.",
      absence: "Estimado padre/madre, le informamos que su hijo/a no asistió a clases hoy. Por favor, confirme si hay algún motivo especial.",
      general: "Estimado padre/madre, tenemos información importante que compartir con usted. Por favor, revise su cuenta en el sistema escolar."
    }

    setFormData(prev => ({
      ...prev,
      content: templates[template as keyof typeof templates] || "",
      template
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SENT":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return <Badge variant="default" className="bg-green-500">Enviado</Badge>
      case "FAILED":
        return <Badge variant="destructive">Fallido</Badge>
      case "PENDING":
        return <Badge variant="secondary">Pendiente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SMS":
        return <Phone className="h-4 w-4" />
      case "WHATSAPP":
        return <MessageSquare className="h-4 w-4" />
      case "EMAIL":
        return <Mail className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mensajes</h1>
          <p className="text-muted-foreground">Envía mensajes a padres de familia</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando mensajes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mensajes</h1>
        <p className="text-muted-foreground">Envía mensajes a padres de familia</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enviar Mensaje</CardTitle>
            <CardDescription>
              Envía mensajes SMS o WhatsApp a padres de familia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Estudiante</Label>
                <Select value={formData.studentId} onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student1">Juan Pérez - 3°A</SelectItem>
                    <SelectItem value="student2">María García - 3°B</SelectItem>
                    <SelectItem value="student3">Carlos López - 4°A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Mensaje</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Plantilla</Label>
                <Select value={formData.template} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Recordatorio de Pago</SelectItem>
                    <SelectItem value="grades">Calificaciones Disponibles</SelectItem>
                    <SelectItem value="meeting">Reunión de Padres</SelectItem>
                    <SelectItem value="absence">Inasistencia</SelectItem>
                    <SelectItem value="general">Mensaje General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Mensaje</Label>
                <Textarea
                  id="content"
                  placeholder="Escribe tu mensaje aquí..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Mensaje
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Mensajes</CardTitle>
            <CardDescription>
              Mensajes enviados recientemente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No hay mensajes</h3>
                  <p className="text-muted-foreground">
                    Los mensajes enviados aparecerán aquí.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {getTypeIcon(message.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">
                            {message.student.firstName} {message.student.lastName}
                          </p>
                          {getStatusBadge(message.status)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Para: {message.parent.firstName} {message.parent.lastName}
                      </p>
                      <p className="text-sm mt-2">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



