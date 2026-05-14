import { ProductCard } from "@/components/product/product-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { StoreProduct } from "@/lib/types"

type CatalogGridProps = {
  products: StoreProduct[]
}

export function CatalogGrid({ products }: CatalogGridProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="grid gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </ScrollArea>
  )
}