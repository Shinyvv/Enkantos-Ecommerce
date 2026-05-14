export type StoreProduct = {
  id: string
  nombre: string
  slug: string
  descripcion: string
  precio: number
  categoria: string
  imagenes: string[]
  tallas: string[]
  disponible: boolean
  visible: boolean
  destacado: boolean
  createdAt: Date
}

export type StoreCategory = {
  id: string
  nombre: string
  slug: string
}