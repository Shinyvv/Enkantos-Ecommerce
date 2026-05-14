"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function AdminSessionActions() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      const response = await fetch("/api/admin/auth/logout", { method: "POST" })

      if (!response.ok) {
        toast({ title: "No se pudo cerrar sesion", variant: "destructive" })
        return
      }

      toast({ title: "Sesion cerrada" })
      router.replace("/admin/login")
      router.refresh()
    })
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isPending}>
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      Cerrar sesion
    </Button>
  )
}