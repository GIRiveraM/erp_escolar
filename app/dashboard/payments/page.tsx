"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Calendar, DollarSign, CheckCircle, XCircle, Clock } from "lucide-react"

interface Payment {
  id: string
  amount: number
  month: number
  year: number
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED"
  method?: "CASH" | "CARD" | "TRANSFER" | "STRIPE"
  createdAt: string
}

export default function PaymentsPage() {
  const { data: session } = useSession()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments")
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (paymentId: string) => {
    try {
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      }
    } catch (error) {
      console.error("Error creating payment session:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "OVERDUE":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge variant="default" className="bg-green-500">Pagado</Badge>
      case "OVERDUE":
        return <Badge variant="destructive">Vencido</Badge>
      case "PENDING":
        return <Badge variant="secondary">Pendiente</Badge>
      case "CANCELLED":
        return <Badge variant="outline">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMonthName = (month: number) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]
    return months[month - 1] || "Mes inválido"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pagos</h1>
          <p className="text-muted-foreground">Gestiona tus pagos de mensualidades</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando pagos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pagos</h1>
        <p className="text-muted-foreground">Gestiona tus pagos de mensualidades</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${payments.filter(p => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.status === "PAID").length} pagos completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === "PENDING").length}
            </div>
            <p className="text-xs text-muted-foreground">
              ${payments.filter(p => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0)} por pagar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {payments.filter(p => p.status === "OVERDUE").length}
            </div>
            <p className="text-xs text-muted-foreground">
              ${payments.filter(p => p.status === "OVERDUE").reduce((sum, p) => sum + p.amount, 0)} vencidos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            Lista de todos tus pagos de mensualidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No hay pagos registrados</h3>
                <p className="text-muted-foreground">
                  Los pagos aparecerán aquí una vez que se generen.
                </p>
              </div>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(payment.status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">
                          Mensualidad {getMonthName(payment.month)} {payment.year}
                        </h3>
                        {getStatusBadge(payment.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </span>
                        {payment.method && (
                          <span className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-1" />
                            {payment.method}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">${payment.amount}</div>
                    </div>
                    {payment.status === "PENDING" && (
                      <Button onClick={() => handlePayment(payment.id)}>
                        Pagar Ahora
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



