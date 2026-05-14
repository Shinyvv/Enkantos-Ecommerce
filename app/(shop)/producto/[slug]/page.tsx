import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product/product-card"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductSocialActions } from "@/components/social/product-social-actions"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog"
import { formatPrice } from "@/lib/utils"

export const revalidate = 300

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: "Producto no encontrado" }
  }

  return {
    title: product.nombre,
    description: product.descripcion,
    openGraph: {
      title: product.nombre,
      description: product.descripcion,
      images: product.imagenes.slice(0, 1)
    }
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || !product.visible) {
    notFound()
  }

  const related = await getRelatedProducts(product.categoria, product.slug)

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <ProductGallery images={product.imagenes} productName={product.nombre} />

        <div className="space-y-5">
          <div className="space-y-2">
            <Badge>{product.categoria}</Badge>
            <h1 className="text-4xl text-white">{product.nombre}</h1>
            <p className="text-2xl font-semibold text-[var(--color-gold)]">{formatPrice(product.precio)}</p>
          </div>

          <Separator />

          <Tabs defaultValue="descripcion" className="w-full">
            <TabsList>
              <TabsTrigger value="descripcion">Descripcion</TabsTrigger>
              <TabsTrigger value="tallas">Tallas</TabsTrigger>
              <TabsTrigger value="disponibilidad">Disponibilidad</TabsTrigger>
            </TabsList>
            <TabsContent value="descripcion" className="text-neutral-300">
              {product.descripcion}
            </TabsContent>
            <TabsContent value="tallas" className="text-neutral-300">
              {product.tallas.join(" - ")}
            </TabsContent>
            <TabsContent value="disponibilidad" className="text-neutral-300">
              {product.disponible ? "Disponible para consulta inmediata" : "Agotado por ahora"}
            </TabsContent>
          </Tabs>

          <ProductSocialActions productName={product.nombre} />
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl text-white">Outfits relacionados</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} compact />
          ))}
        </div>
      </section>
    </main>
  )
}