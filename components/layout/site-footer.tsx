import { Instagram, MapPin, MessageCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { STORE_CONFIG } from "@/lib/constants"
import { getInstagramUrl, getWhatsAppUrl } from "@/lib/social-links"

export function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-[var(--color-gold-muted)]/40 bg-black pb-28 pt-10 md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-3">
          <p className="font-display text-xl text-[var(--color-gold)]">Enkantos Boutique</p>
          <p className="max-w-md text-sm text-neutral-300">
            Moda femenina juvenil, trendy y social-first. Cada semana nuevos drops pensados para destacar en tu feed.
          </p>
        </div>
        <div className="space-y-2 text-sm text-neutral-300">
          <a className="flex items-center gap-2 transition-colors hover:text-white" href={getInstagramUrl()} rel="noreferrer" target="_blank">
            <Instagram className="size-4" />
            @enkantos_talagante
          </a>
          <a className="flex items-center gap-2 transition-colors hover:text-white" href={getWhatsAppUrl("Hola! Quiero visitar la tienda")}
            rel="noreferrer" target="_blank">
            <MessageCircle className="size-4" />
            WhatsApp directo
          </a>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4" />
            {STORE_CONFIG.location}
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Separator />
        <p className="pt-4 text-xs text-neutral-500">{new Date().getFullYear()} Enkantos Boutique. Social commerce femenino.</p>
      </div>
    </footer>
  )
}