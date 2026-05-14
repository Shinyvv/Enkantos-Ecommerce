import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminApiAuth } from "@/lib/admin-auth"
import { normalizedProductSchema } from "@/lib/validations/product"

const partialProductSchema = z.object({
  disponible: z.boolean().optional(),
  visible: z.boolean().optional(),
  destacado: z.boolean().optional()
})

type ProductRouteProps = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: ProductRouteProps) {
  const unauthorizedResponse = await requireAdminApiAuth()
  if (unauthorizedResponse) return unauthorizedResponse

  try {
    const { id } = await params
    const payload = await request.json()

    const isPartial =
      Object.keys(payload).every((key) => ["disponible", "visible", "destacado"].includes(key)) &&
      Object.keys(payload).length > 0

    if (isPartial) {
      const data = partialProductSchema.parse(payload)
      const product = await prisma.product.update({
        where: { id },
        data
      })
      revalidateTag("products", "max")
      return NextResponse.json({ product })
    }

    const data = normalizedProductSchema.parse(payload)

    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id: data.categoryId ?? undefined }, { nombre: data.categoria }]
      }
    })

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        categoryId: category?.id ?? null
      }
    })

    revalidateTag("products", "max")

    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json(
      {
        message: "No se pudo actualizar el producto",
        error: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 400 }
    )
  }
}

export async function DELETE(_: Request, { params }: ProductRouteProps) {
  const unauthorizedResponse = await requireAdminApiAuth()
  if (unauthorizedResponse) return unauthorizedResponse

  try {
    const { id } = await params

    await prisma.product.delete({ where: { id } })
    revalidateTag("products", "max")

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      {
        message: "No se pudo eliminar el producto",
        error: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 400 }
    )
  }
}
