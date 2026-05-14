import { NextResponse } from "next/server"
import { z } from "zod"
import { areAdminCredentialsValid, setAdminSessionCookie } from "@/lib/admin-auth"

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { username, password } = loginSchema.parse(payload)

    if (!areAdminCredentialsValid(username, password)) {
      return NextResponse.json({ message: "Credenciales invalidas" }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    setAdminSessionCookie(response)
    return response
  } catch (error) {
    return NextResponse.json(
      {
        message: "Solicitud invalida",
        error: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 400 }
    )
  }
}