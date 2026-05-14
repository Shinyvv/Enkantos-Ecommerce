import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { StoreProduct } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

type NewArrivalsSectionProps = {
  products: StoreProduct[]
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  return (
    <section className="mx-auto max-w-7xl space-y-5 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-gold)]">Nuevos ingresos</p>
        <h2 className="text-3xl text-white">Drop semanal recien llegado</h2>
      </div>

      {products.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <HoverCard key={product.id}>
              <HoverCardTrigger asChild>
                <Card className="overflow-hidden">
                  <Image
                    src={product.imagenes[0] ?? "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"}
                    alt={product.nombre}
                    width={900}
                    height={1200}
                    className="h-72 w-full object-cover"
                  />
                  <CardContent className="space-y-1 p-4">
                    <p className="line-clamp-1 font-semibold text-white">{product.nombre}</p>
                    <p className="text-sm text-neutral-400">{product.categoria}</p>
                    <p className="text-lg font-semibold text-[var(--color-gold)]">{formatPrice(product.precio)}</p>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent>
                <p className="text-sm text-neutral-200">{product.descripcion}</p>
                <p className="mt-2 text-xs text-[var(--color-gold)]">Tallas: {product.tallas.join(", ")}</p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )}
    </section>
  )
}
