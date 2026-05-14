import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAdminApiAuth } from "@/lib/admin-auth"
import { normalizedProductSchema } from "@/lib/validations/product"

export async function GET() {
  const unauthorizedResponse = await requireAdminApiAuth()
  if (unauthorizedResponse) return unauthorizedResponse

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json({ products })
}

export async function POST(request: Request) {
  const unauthorizedResponse = await requireAdminApiAuth()
  if (unauthorizedResponse) return unauthorizedResponse

  try {
    const payload = await request.json()
    const data = normalizedProductSchema.parse(payload)

    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id: data.categoryId ?? undefined }, { nombre: data.categoria }]
      }
    })

    const product = await prisma.product.create({
      data: {
        ...data,
        categoryId: category?.id ?? null
      }
    })

    revalidateTag("products", "max")

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        message: "No se pudo crear el producto",
        error: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 400 }
    )
  }
}
