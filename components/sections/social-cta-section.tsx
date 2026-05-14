import { Facebook, Instagram, Share2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getFacebookUrl, getInstagramUrl, getWhatsAppUrl } from "@/lib/social-links"

const ctaBaseClass =
  "inline-flex h-11 items-center justify-center gap-2.5 rounded-lg px-7 text-sm font-semibold tracking-[0.01em] text-white transition-opacity hover:opacity-90"

export function SocialCtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[var(--color-gold-muted)]/40 bg-black/70 p-6">
        <h2 className="text-3xl text-white">Siguenos para ver los nuevos drops</h2>
        <p className="mt-2 max-w-2xl text-neutral-300">
          Publicamos outfits virales, combinaciones nuevas y prendas destacadas todos los dias.
        </p>
        <Separator className="my-5" />
        <div className="grid gap-2.5 rounded-xl border border-[var(--color-gold-muted)]/35 bg-black/60 p-2.5 sm:grid-cols-3">
          <a className={`${ctaBaseClass} bg-instagram`} href={getInstagramUrl()} rel="noreferrer" target="_blank">
            <Instagram className="size-4" />
            Seguir en Instagram
          </a>
          <a className={`${ctaBaseClass} bg-facebook`} href={getFacebookUrl()} rel="noreferrer" target="_blank">
            <Facebook className="size-4" />
            Ver Facebook
          </a>
          <a
            className={`${ctaBaseClass} bg-whatsapp`}
            href={getWhatsAppUrl("Hola! Quiero ver los nuevos drops")}
            rel="noreferrer"
            target="_blank"
          >
            <Share2 className="size-4" />
            Enviar DM por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
