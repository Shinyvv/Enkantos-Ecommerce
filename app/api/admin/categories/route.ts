import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminApiAuth } from "@/lib/admin-auth"

export async function GET() {
  const unauthorizedResponse = await requireAdminApiAuth()
  if (unauthorizedResponse) return unauthorizedResponse

  const categories = await prisma.category.findMany({
    orderBy: { nombre: "asc" }
  })

  return NextResponse.json({ categories })
}
