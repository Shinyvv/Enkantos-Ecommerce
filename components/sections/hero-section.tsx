"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getInstagramUrl, getWhatsAppUrl } from "@/lib/social-links"

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-gold-muted)]/40 bg-black/60">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/10 via-transparent to-transparent" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 md:py-12 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-6"
        >
          <Badge className="w-fit">Boutique Viral en Talagante</Badge>
          <div className="space-y-3">
            <h1 className="text-4xl leading-tight text-white sm:text-5xl">Tu proximo outfit esta aqui</h1>
            <p className="max-w-md text-base text-neutral-200">Moda viral que roba miradas</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/catalogo">Ver catalogo</Link>
            </Button>
            <Button size="lg" variant="socialInstagram" asChild>
              <a href={getInstagramUrl()} rel="noreferrer" target="_blank">
                Instagram
              </a>
            </Button>
            <Button size="lg" variant="socialWhatsApp" asChild>
              <a href={getWhatsAppUrl("Hola! Quiero conocer sus outfits")}
                rel="noreferrer" target="_blank">
                WhatsApp
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Carousel className="w-full">
            <CarouselContent>
              {HERO_IMAGES.map((image, index) => (
                <CarouselItem key={image}>
                  <div className="gold-glow relative overflow-hidden rounded-2xl">
                    <Image
                      src={image}
                      alt={`Look destacado ${index + 1}`}
                      width={1200}
                      height={1400}
                      priority={index === 0}
                      className="h-[27rem] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>
      </div>
    </section>
  )
}
