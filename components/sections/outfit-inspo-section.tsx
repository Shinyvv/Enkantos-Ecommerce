"use client"

import Image from "next/image"
import { motion } from "motion/react"
import type { StoreProduct } from "@/lib/types"

type OutfitInspoSectionProps = {
  products: StoreProduct[]
}

export function OutfitInspoSection({ products }: OutfitInspoSectionProps) {
  const images = products.flatMap((product) => product.imagenes.slice(0, 2)).slice(0, 12)

  return (
    <section className="mx-auto max-w-7xl space-y-5 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-gold)]">Outfit inspo</p>
        <h2 className="text-3xl text-white">Inspo feed para tus proximos looks</h2>
      </div>
      <div className="fashion-masonry">
        {images.map((image, index) => (
          <motion.div
            key={`${image}-${index}`}
            className="fashion-masonry-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
          >
            <div className="overflow-hidden rounded-xl border border-[var(--color-gold-muted)]/40">
              <Image
                src={image}
                alt={`Inspo ${index + 1}`}
                width={700}
                height={900}
                className="h-auto w-full object-cover transition duration-300 hover:scale-105"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}