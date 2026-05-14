import type { Metadata } from "next"
import { CatalogFilters } from "@/components/product/catalog-filters"
import { CatalogGrid } from "@/components/product/catalog-grid"
import { CatalogPagination } from "@/components/product/catalog-pagination"
import { Badge } from "@/components/ui/badge"
import { getCatalogProducts, getCategories } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Catalogo"
}

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const q = typeof params.q === "string" ? params.q : ""
  const categoria = typeof params.categoria === "string" ? params.categoria : "all"
  const onlyAvailable = params.disponibles === "1"
  const pageValue = Number(typeof params.page === "string" ? params.page : "1")
  const page = Number.isNaN(pageValue) ? 1 : Math.max(1, pageValue)

  const [categories, { products, total }] = await Promise.all([
    getCategories(),
    getCatalogProducts({
      query: q,
      categoria,
      onlyAvailable,
      page,
      pageSize: 12
    })
  ])

  const baseParams = new URLSearchParams()
  if (q) baseParams.set("q", q)
  if (categoria && categoria !== "all") baseParams.set("categoria", categoria)
  if (onlyAvailable) baseParams.set("disponibles", "1")

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-gold)]">Catalogo social</p>
          <h1 className="text-3xl text-white">Todo el feed de Enkantos Boutique</h1>
        </div>
        <Badge variant="outline">{total} prendas</Badge>
      </div>

      <CatalogFilters
        categories={categories}
        initialQuery={q}
        initialCategory={categoria}
        initialOnlyAvailable={onlyAvailable}
      />

      <CatalogGrid products={products} />

      <CatalogPagination total={total} page={page} pageSize={12} baseQuery={baseParams.toString()} />
    </main>
  )
}