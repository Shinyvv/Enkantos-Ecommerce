"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ProductSocialActions } from "@/components/social/product-social-actions"
import type { StoreProduct } from "@/lib/types"
import { cn, formatPrice } from "@/lib/utils"

type ProductCardProps = {
  product: StoreProduct
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const primaryImage =
    product.imagenes[0] ?? "https://images.unsplash.com/photo-1483985988355-763728e1935b"

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden bg-black/95">
        <Link href={`/producto/${product.slug}`} className="relative block overflow-hidden">
          <Image
            src={primaryImage}
            alt={product.nombre}
            width={900}
            height={1200}
            className="h-[20rem] w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            {product.destacado ? <Badge>Trending</Badge> : null}
            {!product.disponible ? <Badge variant="secondary">Agotado</Badge> : null}
          </div>
        </Link>

        <CardContent className={cn("space-y-3 p-4", compact && "p-3")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="line-clamp-1 text-base font-semibold text-white">{product.nombre}</p>
              <p className="text-xs uppercase tracking-wide text-neutral-400">{product.categoria}</p>
            </div>
            <p className="text-lg font-semibold text-[var(--color-gold)]">{formatPrice(product.precio)}</p>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/producto/${product.slug}`}>
                    <Eye className="size-4" />
                    Ver detalle
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Explora fotos, tallas y consulta por redes</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!compact ? <ProductSocialActions productName={product.nombre} /> : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}
