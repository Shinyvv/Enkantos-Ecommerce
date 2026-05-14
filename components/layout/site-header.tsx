"use client"

import Link from "next/link"
import { Facebook, Instagram, Menu, MessageCircle, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { STORE_CONFIG } from "@/lib/constants"
import { getFacebookUrl, getInstagramUrl, getWhatsAppUrl } from "@/lib/social-links"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catalogo" },
  { href: "/novedades", label: "Novedades" }
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-gold-muted)]/40 bg-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="gold-glow rounded-full p-2">
            <Store className="size-4 text-[var(--color-gold)]" />
          </div>
          <div>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-[var(--color-gold)]">Enkantos</p>
            <p className="text-xs text-white/70">Boutique Social</p>
          </div>
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {NAV_LINKS.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-[var(--color-gold)]"
                    )}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-2.5 rounded-xl border border-[var(--color-gold-muted)]/40 bg-black/70 p-2 lg:flex">
          <Button variant="socialInstagram" size="sm" className="min-w-[126px]" asChild>
            <a href={getInstagramUrl()} rel="noreferrer" target="_blank">
              <Instagram className="size-4" />
              Instagram
            </a>
          </Button>
          <Button variant="socialFacebook" size="sm" className="min-w-[126px]" asChild>
            <a href={getFacebookUrl()} rel="noreferrer" target="_blank">
              <Facebook className="size-4" />
              Facebook
            </a>
          </Button>
          <Button variant="socialWhatsApp" size="sm" className="min-w-[126px]" asChild>
            <a href={getWhatsAppUrl("Quiero conocer sus novedades")} rel="noreferrer" target="_blank">
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[88vw] sm:w-[420px]">
            <SheetHeader>
              <SheetTitle className="font-display text-[var(--color-gold)]">Enkantos Boutique</SheetTitle>
              <SheetDescription>{STORE_CONFIG.location}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 grid gap-2">
              {NAV_LINKS.map((link) => (
                <Button key={link.href} variant="ghost" className="justify-start text-base" asChild>
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </div>
            <div className="mt-8 grid gap-2.5 rounded-xl border border-[var(--color-gold-muted)]/40 bg-black/70 p-2">
              <Button variant="socialInstagram" asChild>
                <a href={getInstagramUrl()} rel="noreferrer" target="_blank">
                  <Instagram className="size-4" />
                  Abrir Instagram
                </a>
              </Button>
              <Button variant="socialFacebook" asChild>
                <a href={getFacebookUrl()} rel="noreferrer" target="_blank">
                  <Facebook className="size-4" />
                  Abrir Facebook
                </a>
              </Button>
              <Button variant="socialWhatsApp" asChild>
                <a href={getWhatsAppUrl("Quiero conocer sus productos")} rel="noreferrer" target="_blank">
                  <MessageCircle className="size-4" />
                  Escribir por WhatsApp
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
