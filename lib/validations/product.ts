import { z } from "zod"
import { slugify } from "@/lib/utils"

const imageValue = z.string().min(1)

export const productSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  slug: z.string().min(3).optional(),
  descripcion: z.string().min(10, "La descripcion debe tener al menos 10 caracteres"),
  precio: z.coerce.number().int().positive(),
  categoria: z.string().min(2),
  categoryId: z.string().nullable().optional(),
  imagenes: z.array(imageValue).min(1, "Debes subir al menos una imagen"),
  tallas: z.array(z.string()).min(1, "Debes seleccionar una talla"),
  disponible: z.boolean(),
  visible: z.boolean(),
  destacado: z.boolean()
})

export const normalizedProductSchema = productSchema.transform((data) => ({
  ...data,
  slug: slugify(data.slug?.trim() || data.nombre)
}))

export type ProductInput = z.input<typeof productSchema>
export type NormalizedProductInput = z.infer<typeof normalizedProductSchema>