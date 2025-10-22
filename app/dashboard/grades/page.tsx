"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, TrendingUp, Calendar, BookOpen } from "lucide-react"

interface Grade {
  id: string
  subject: string
  grade: number
  type: "EXAM" | "HOMEWORK" | "PROJECT" | "PARTICIPATION"
  comments?: string
  createdAt: string
}

export default function GradesPage() {
  const { data: session } = useSession()
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGrades()
  }, [])

  const fetchGrades = async () => {
    try {
      const response = await fetch("/api/grades")
      if (response.ok) {
        const data = await response.json()
        setGrades(data)
      }
    } catch (error) {
      console.error("Error fetching grades:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "EXAM":
        return <Badge variant="destructive">Examen</Badge>
      case "HOMEWORK":
        return <Badge variant="secondary">Tarea</Badge>
      case "PROJECT":
        return <Badge variant="default">Proyecto</Badge>
      case "PARTICIPATION":
        return <Badge variant="outline">Participación</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600"
    if (grade >= 80) return "text-blue-600"
    if (grade >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const calculateAverage = () => {
    if (grades.length === 0) return 0
    const sum = grades.reduce((acc, grade) => acc + grade.grade, 0)
    return (sum / grades.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Calificaciones</h1>
          <p className="text-muted-foreground">Consulta tus calificaciones</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando calificaciones...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calificaciones</h1>
        <p className="text-muted-foreground">Consulta tus calificaciones</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverage()}</div>
            <p className="text-xs text-muted-foreground">
              {grades.length} calificaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exámenes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {grades.filter(g => g.type === "EXAM").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {grades.filter(g => g.type === "EXAM").length > 0 
                ? `Promedio: ${(grades.filter(g => g.type === "EXAM").reduce((sum, g) => sum + g.grade, 0) / grades.filter(g => g.type === "EXAM").length).toFixed(1)}`
                : "Sin exámenes"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {grades.filter(g => g.type === "HOMEWORK").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {grades.filter(g => g.type === "HOMEWORK").length > 0 
                ? `Promedio: ${(grades.filter(g => g.type === "HOMEWORK").reduce((sum, g) => sum + g.grade, 0) / grades.filter(g => g.type === "HOMEWORK").length).toFixed(1)}`
                : "Sin tareas"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {grades.filter(g => g.type === "PROJECT").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {grades.filter(g => g.type === "PROJECT").length > 0 
                ? `Promedio: ${(grades.filter(g => g.type === "PROJECT").reduce((sum, g) => sum + g.grade, 0) / grades.filter(g => g.type === "PROJECT").length).toFixed(1)}`
                : "Sin proyectos"
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Calificaciones</CardTitle>
          <CardDescription>
            Todas tus calificaciones por materia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grades.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No hay calificaciones</h3>
                <p className="text-muted-foreground">
                  Las calificaciones aparecerán aquí una vez que los maestros las ingresen.
                </p>
              </div>
            ) : (
              grades.map((grade) => (
                <div
                  key={grade.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{grade.subject}</h3>
                        {getTypeBadge(grade.type)}
                      </div>
                      {grade.comments && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {grade.comments}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(grade.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getGradeColor(grade.grade)}`}>
                      {grade.grade}
                    </div>
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



