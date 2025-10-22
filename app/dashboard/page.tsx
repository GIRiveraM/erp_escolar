import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido, {session.user.name} {session.user.lastName}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Total Estudiantes</h3>
            </div>
            <div>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +12% desde el mes pasado
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Pagos Pendientes</h3>
            </div>
            <div>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                -8% desde el mes pasado
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Maestros Activos</h3>
            </div>
            <div>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +2 nuevos este mes
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Ingresos del Mes</h3>
            </div>
            <div>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-muted-foreground">
                +20.1% desde el mes pasado
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nuevo estudiante registrado</p>
                  <p className="text-xs text-muted-foreground">Juan Pérez - Grado 3°A</p>
                </div>
                <span className="text-xs text-muted-foreground">Hace 2 horas</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pago procesado</p>
                  <p className="text-xs text-muted-foreground">María García - $150.00</p>
                </div>
                <span className="text-xs text-muted-foreground">Hace 4 horas</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Calificación agregada</p>
                  <p className="text-xs text-muted-foreground">Matemáticas - Carlos López</p>
                </div>
                <span className="text-xs text-muted-foreground">Hace 6 horas</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Próximos Eventos</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xs font-bold">15</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Reunión de Padres</p>
                  <p className="text-xs text-muted-foreground">Grado 5° - 3:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">18</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Examen Final</p>
                  <p className="text-xs text-muted-foreground">Matemáticas - 9:00 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">22</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Entrega de Calificaciones</p>
                  <p className="text-xs text-muted-foreground">Todos los grados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}



