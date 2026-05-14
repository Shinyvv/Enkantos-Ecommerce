"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold text-[var(--color-gold)]">Ups, algo salio mal</h1>
      <p className="text-neutral-300">No pudimos cargar esta vista. Intenta de nuevo en unos segundos.</p>
      <Button onClick={reset}>Reintentar</Button>
    </main>
  )
}