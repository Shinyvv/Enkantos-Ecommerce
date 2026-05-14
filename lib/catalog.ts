import { unstable_cache } from "next/cache"
import type { StoreCategory, StoreProduct } from "@/lib/types"
import { prisma } from "@/lib/prisma"

export type CatalogFilters = {
  query?: string
  categoria?: string
  onlyAvailable?: boolean
  page?: number
  pageSize?: number
}

const FALLBACK_CATEGORIES: StoreCategory[] = [
  { id: "cat-vestidos", nombre: "Vestidos", slug: "vestidos" },
  { id: "cat-conjuntos", nombre: "Conjuntos", slug: "conjuntos" },
  { id: "cat-jeans", nombre: "Jeans", slug: "jeans" },
  { id: "cat-tops", nombre: "Tops", slug: "tops" },
  { id: "cat-blazers", nombre: "Blazers", slug: "blazers" }
]

const FALLBACK_PRODUCTS: StoreProduct[] = [
  {
    id: "prd-1",
    nombre: "Vestido Noche Rebel",
    slug: "vestido-noche-rebel",
    descripcion: "Vestido negro ajustado con brillo sutil para una salida impactante.",
    precio: 32990,
    categoria: "Vestidos",
    imagenes: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
      "https://images.unsplash.com/photo-1464863979621-258859e62245"
    ],
    tallas: ["S", "M", "L"],
    disponible: true,
    visible: true,
    destacado: true,
    createdAt: new Date("2026-05-08T12:00:00.000Z")
  },
  {
    id: "prd-2",
    nombre: "Set Urbano Goldline",
    slug: "set-urbano-goldline",
    descripcion: "Set de dos piezas con fit comodo y look viral de feed.",
    precio: 38990,
    categoria: "Conjuntos",
    imagenes: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
    ],
    tallas: ["M", "L", "XL"],
    disponible: true,
    visible: true,
    destacado: true,
    createdAt: new Date("2026-05-07T12:00:00.000Z")
  },
  {
    id: "prd-3",
    nombre: "Jean Push-Up Skyline",
    slug: "jean-push-up-skyline",
    descripcion: "Jean high waist con stretch premium y silueta marcada.",
    precio: 27990,
    categoria: "Jeans",
    imagenes: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
      "https://images.unsplash.com/photo-1445205170230-053b83016050",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105"
    ],
    tallas: ["36", "38", "40", "42"],
    disponible: true,
    visible: true,
    destacado: false,
    createdAt: new Date("2026-05-06T12:00:00.000Z")
  },
  {
    id: "prd-4",
    nombre: "Top Satin Lux",
    slug: "top-satin-lux",
    descripcion: "Top satinado con caida ligera y detalle dorado minimal.",
    precio: 19990,
    categoria: "Tops",
    imagenes: [
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc"
    ],
    tallas: ["S", "M", "L"],
    disponible: true,
    visible: true,
    destacado: false,
    createdAt: new Date("2026-05-05T12:00:00.000Z")
  },
  {
    id: "prd-5",
    nombre: "Blazer Midnight City",
    slug: "blazer-midnight-city",
    descripcion: "Blazer estructurado para elevar outfits casuales y de noche.",
    precio: 42990,
    categoria: "Blazers",
    imagenes: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598"
    ],
    tallas: ["M", "L", "XL"],
    disponible: true,
    visible: true,
    destacado: true,
    createdAt: new Date("2026-05-04T12:00:00.000Z")
  },
  {
    id: "prd-6",
    nombre: "Vestido Street Spark",
    slug: "vestido-street-spark",
    descripcion: "Vestido corto con actitud urbana y ajuste comodo.",
    precio: 30990,
    categoria: "Vestidos",
    imagenes: [
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e",
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93"
    ],
    tallas: ["S", "M"],
    disponible: false,
    visible: true,
    destacado: false,
    createdAt: new Date("2026-05-03T12:00:00.000Z")
  }
]

function logCatalogFallback(error: unknown): void {
  const message = error instanceof Error ? error.message : "Error desconocido"
  const now = Date.now()
  const globalState = globalThis as unknown as {
    catalogFallbackLastLogAt?: number
    catalogFallbackLastMessage?: string
  }

  const shouldLog =
    globalState.catalogFallbackLastMessage !== message ||
    !globalState.catalogFallbackLastLogAt ||
    now - globalState.catalogFallbackLastLogAt > 60_000

  if (shouldLog) {
    console.error(`[catalog] Fallback activo por error de base de datos: ${message}`)
    globalState.catalogFallbackLastLogAt = now
    globalState.catalogFallbackLastMessage = message
  }
}

async function withDatabaseFallback<T>(operation: () => Promise<T>, fallback: () => T): Promise<T> {
  if (process.env.DISABLE_DATABASE === "true") {
    return fallback()
  }

  try {
    return await operation()
  } catch (error) {
    logCatalogFallback(error)
    return fallback()
  }
}

function applyLocalFilters(
  products: StoreProduct[],
  { query, categoria, onlyAvailable }: Pick<CatalogFilters, "query" | "categoria" | "onlyAvailable">
): StoreProduct[] {
  const normalizedQuery = query?.trim().toLowerCase()

  return products.filter((product) => {
    if (!product.visible) return false
    if (categoria && categoria !== "all" && product.categoria !== categoria) return false
    if (onlyAvailable && !product.disponible) return false
    if (!normalizedQuery) return true
    return (
      product.nombre.toLowerCase().includes(normalizedQuery) ||
      product.descripcion.toLowerCase().includes(normalizedQuery)
    )
  })
}

export const getCategories = unstable_cache(
  async () =>
    withDatabaseFallback(
      () =>
        prisma.category.findMany({
          select: { id: true, nombre: true, slug: true },
          orderBy: { nombre: "asc" }
        }),
      () => FALLBACK_CATEGORIES
    ),
  ["categories"],
  { revalidate: 3600, tags: ["categories"] }
)

export const getFeaturedProducts = unstable_cache(
  async () =>
    withDatabaseFallback(
      () =>
        prisma.product.findMany({
          where: { visible: true, destacado: true },
          select: {
            id: true,
            nombre: true,
            slug: true,
            descripcion: true,
            precio: true,
            categoria: true,
            imagenes: true,
            tallas: true,
            disponible: true,
            visible: true,
            destacado: true,
            createdAt: true
          },
          orderBy: { createdAt: "desc" },
          take: 8
        }),
      () => FALLBACK_PRODUCTS.filter((product) => product.destacado).slice(0, 8)
    ),
  ["featured-products"],
  { revalidate: 300, tags: ["products"] }
)

export const getLatestProducts = unstable_cache(
  async () =>
    withDatabaseFallback(
      () =>
        prisma.product.findMany({
          where: { visible: true },
          select: {
            id: true,
            nombre: true,
            slug: true,
            descripcion: true,
            precio: true,
            categoria: true,
            imagenes: true,
            tallas: true,
            disponible: true,
            visible: true,
            destacado: true,
            createdAt: true
          },
          orderBy: { createdAt: "desc" },
          take: 12
        }),
      () => [...FALLBACK_PRODUCTS].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 12)
    ),
  ["latest-products"],
  { revalidate: 300, tags: ["products"] }
)

export async function getCatalogProducts({
  query,
  categoria,
  onlyAvailable,
  page = 1,
  pageSize = 12
}: CatalogFilters): Promise<{ products: StoreProduct[]; total: number }> {
  return withDatabaseFallback(
    async () => {
      const where = {
        visible: true,
        ...(query
          ? {
              OR: [
                { nombre: { contains: query, mode: "insensitive" as const } },
                { descripcion: { contains: query, mode: "insensitive" as const } }
              ]
            }
          : {}),
        ...(categoria && categoria !== "all" ? { categoria } : {}),
        ...(onlyAvailable ? { disponible: true } : {})
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          select: {
            id: true,
            nombre: true,
            slug: true,
            descripcion: true,
            precio: true,
            categoria: true,
            imagenes: true,
            tallas: true,
            disponible: true,
            visible: true,
            destacado: true,
            createdAt: true
          },
          orderBy: [{ destacado: "desc" }, { createdAt: "desc" }],
          skip: (page - 1) * pageSize,
          take: pageSize
        }),
        prisma.product.count({ where })
      ])

      return { products, total }
    },
    () => {
      const filtered = applyLocalFilters(FALLBACK_PRODUCTS, { query, categoria, onlyAvailable })
      const sorted = [...filtered].sort((a, b) => {
        if (a.destacado === b.destacado) return b.createdAt.getTime() - a.createdAt.getTime()
        return a.destacado ? -1 : 1
      })
      const start = (page - 1) * pageSize
      return { products: sorted.slice(start, start + pageSize), total: sorted.length }
    }
  )
}

export async function getProductBySlug(slug: string): Promise<StoreProduct | null> {
  return withDatabaseFallback(
    () =>
      prisma.product.findUnique({
        where: { slug },
        select: {
          id: true,
          nombre: true,
          slug: true,
          descripcion: true,
          precio: true,
          categoria: true,
          imagenes: true,
          tallas: true,
          disponible: true,
          visible: true,
          destacado: true,
          createdAt: true
        }
      }),
    () => FALLBACK_PRODUCTS.find((product) => product.slug === slug) ?? null
  )
}

export async function getRelatedProducts(categoria: string, currentSlug: string): Promise<StoreProduct[]> {
  return withDatabaseFallback(
    () =>
      prisma.product.findMany({
        where: {
          visible: true,
          categoria,
          slug: { not: currentSlug }
        },
        select: {
          id: true,
          nombre: true,
          slug: true,
          descripcion: true,
          precio: true,
          categoria: true,
          imagenes: true,
          tallas: true,
          disponible: true,
          visible: true,
          destacado: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" },
        take: 4
      }),
    () =>
      FALLBACK_PRODUCTS.filter((product) => product.visible && product.categoria === categoria && product.slug !== currentSlug)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 4)
  )
}

export async function getAdminProducts(): Promise<StoreProduct[]> {
  return withDatabaseFallback(
    () =>
      prisma.product.findMany({
        select: {
          id: true,
          nombre: true,
          slug: true,
          descripcion: true,
          precio: true,
          categoria: true,
          imagenes: true,
          tallas: true,
          disponible: true,
          visible: true,
          destacado: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" }
      }),
    () => [...FALLBACK_PRODUCTS].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  )
}
