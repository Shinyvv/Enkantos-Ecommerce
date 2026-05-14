import { Suspense } from "react"
import type { Metadata } from "next"
import { FeaturedProductsSection } from "@/components/sections/featured-products-section"
import { HeroSection } from "@/components/sections/hero-section"
import { NewArrivalsSection } from "@/components/sections/new-arrivals-section"
import { OutfitInspoSection } from "@/components/sections/outfit-inspo-section"
import { SocialCtaSection } from "@/components/sections/social-cta-section"
import { Skeleton } from "@/components/ui/skeleton"
import { getFeaturedProducts, getLatestProducts } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Inicio"
}

export const experimental_ppr = true

async function LatestProductsBlock() {
  const products = await getLatestProducts()
  return (
    <>
      <NewArrivalsSection products={products} />
      <OutfitInspoSection products={products} />
    </>
  )
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <main>
      <HeroSection />
      <Suspense
        fallback={
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-44" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-80 w-full" />
              ))}
            </div>
          </section>
        }
      >
        <LatestProductsBlock />
      </Suspense>
      <FeaturedProductsSection products={featured} />
      <SocialCtaSection />
    </main>
  )
}