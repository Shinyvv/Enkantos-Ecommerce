"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function AdminLoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    startTransition(async () => {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        toast({
          title: "Acceso denegado",
          description: "Credenciales invalidas.",
          variant: "destructive"
        })
        return
      }

      toast({
        title: "Sesion iniciada",
        description: "Bienvenida al panel de administracion."
      })

      router.replace("/admin")
      router.refresh()
    })
  }

  return (
    <Card className="w-full max-w-md border-[var(--color-gold-muted)]/60 bg-black/85">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 text-[var(--color-gold)]">
          <LockKeyhole className="size-4" />
          <span className="text-xs uppercase tracking-[0.2em]">Zona privada</span>
        </div>
        <CardTitle className="text-2xl text-white">Ingreso admin</CardTitle>
        <CardDescription>Ingresa con tus credenciales para gestionar productos.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-username">Usuario</Label>
            <Input
              id="admin-username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Contrasena</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
            />
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Entrar al panel
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}