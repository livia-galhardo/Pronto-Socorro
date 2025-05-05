"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, UserRound } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [patientId, setPatientId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Verificar se o ID está no formato correto
    if (!patientId.startsWith("PS") || patientId.length < 7) {
      setError("Formato de ID inválido. O ID deve começar com 'PS' seguido de números.")
      setLoading(false)
      return
    }

    // Buscar pacientes do localStorage
    const storedPatientsJSON = localStorage.getItem("patients")
    let validPatient = false

    if (storedPatientsJSON) {
      try {
        const patients = JSON.parse(storedPatientsJSON)
        validPatient = patients.some((patient: any) => patient.id === patientId)
      } catch (error) {
        console.error("Erro ao verificar pacientes:", error)
      }
    }

    // Lista de IDs de pacientes válidos para demonstração
    const demoPatientIds = ["PS12345", "PS67890", "PS54321", "PS24680", "PS13579"]

    setTimeout(() => {
      if (validPatient || demoPatientIds.includes(patientId)) {
        // Armazenar ID do paciente no localStorage
        localStorage.setItem("currentPatientId", patientId)
        // Redirecionar para a página do paciente
        router.push(`/paciente/${patientId}`)
      } else {
        setError("ID de paciente não encontrado. Por favor, verifique o número informado.")
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="patient-theme min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Pronto-Socorro de Birigui</h1>
          <p className="text-blue-600 mt-2">Sistema de Acompanhamento de Pacientes</p>
        </div>

        <Card className="border-2 border-blue-100 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-blue-100">
                <UserRound className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Acesso do Paciente</CardTitle>
            <CardDescription className="text-center">
              Digite o número de identificação do paciente fornecido na recepção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Número do Paciente</Label>
                  <Input
                    id="patientId"
                    placeholder="Ex: PS12345"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    className="text-lg py-6"
                  />
                  <p className="text-xs text-muted-foreground">
                    O número do paciente está no comprovante de atendimento
                  </p>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full py-6" disabled={loading}>
                  {loading ? "Verificando..." : "Acessar"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-muted-foreground mt-2">
              Para fins de demonstração, use: PS12345, PS67890, PS54321
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => router.push("/")} className="text-blue-600">
            Voltar para a página inicial
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-blue-600">
          <p>Em caso de dificuldades, procure o balcão de atendimento</p>
          <p className="mt-1">© {new Date().getFullYear()} Secretaria de Saúde de Birigui</p>
        </div>
      </div>
    </div>
  )
}
