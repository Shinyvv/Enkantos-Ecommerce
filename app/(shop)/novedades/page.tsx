import type { Metadata } from "next"
import { ProductCard } from "@/components/product/product-card"
import { getLatestProducts } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Novedades"
}

export default async function NovedadesPage() {
  const products = await getLatestProducts()

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-gold)]">Nuevos drops</p>
        <h1 className="text-3xl text-white">Lo mas nuevo de la semana</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}