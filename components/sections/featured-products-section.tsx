import { ProductCard } from "@/components/product/product-card"
import type { StoreProduct } from "@/lib/types"

type FeaturedProductsSectionProps = {
  products: StoreProduct[]
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <section className="mx-auto max-w-7xl space-y-5 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-gold)]">Destacados</p>
        <h2 className="text-3xl text-white">Prendas que estan rompiendo en redes</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}