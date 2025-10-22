"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Users, 
  GraduationCap, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  BookOpen,
  Calendar,
  BarChart3
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    id: string
    email: string
    role: string
    name: string
    lastName: string
  }
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()

  const getNavigationItems = () => {
    const baseItems = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
    ]

    switch (user.role) {
      case "ADMIN":
        return [
          ...baseItems,
          { name: "Estudiantes", href: "/dashboard/students", icon: Users },
          { name: "Maestros", href: "/dashboard/teachers", icon: GraduationCap },
          { name: "Pagos", href: "/dashboard/payments", icon: CreditCard },
          { name: "Mensajes", href: "/dashboard/messages", icon: MessageSquare },
          { name: "Reportes", href: "/dashboard/reports", icon: BarChart3 },
          { name: "Configuración", href: "/dashboard/settings", icon: Settings },
        ]
      case "TEACHER":
        return [
          ...baseItems,
          { name: "Mis Clases", href: "/dashboard/classes", icon: BookOpen },
          { name: "Calificaciones", href: "/dashboard/grades", icon: GraduationCap },
          { name: "Horarios", href: "/dashboard/schedule", icon: Calendar },
          { name: "Estudiantes", href: "/dashboard/students", icon: Users },
        ]
      case "STUDENT":
        return [
          ...baseItems,
          { name: "Mis Calificaciones", href: "/dashboard/grades", icon: GraduationCap },
          { name: "Horario", href: "/dashboard/schedule", icon: Calendar },
          { name: "Pagos", href: "/dashboard/payments", icon: CreditCard },
        ]
      case "PARENT":
        return [
          ...baseItems,
          { name: "Mis Hijos", href: "/dashboard/children", icon: Users },
          { name: "Calificaciones", href: "/dashboard/grades", icon: GraduationCap },
          { name: "Pagos", href: "/dashboard/payments", icon: CreditCard },
          { name: "Mensajes", href: "/dashboard/messages", icon: MessageSquare },
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold">ERP Escolar</h1>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user.name} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 justify-start"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold">ERP Escolar</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user.name} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 justify-start"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-64">
        {/* Header móvil */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">ERP Escolar</h1>
        </div>

        {/* Contenido */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}



