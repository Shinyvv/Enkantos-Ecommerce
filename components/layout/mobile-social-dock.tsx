import { Facebook, Instagram, MessageCircle } from "lucide-react"
import { getFacebookUrl, getInstagramUrl, getWhatsAppUrl } from "@/lib/social-links"

const dockBaseClass =
  "inline-flex h-10 items-center justify-center gap-2.5 rounded-lg px-3.5 text-sm font-semibold tracking-[0.01em] text-white transition-opacity hover:opacity-90"

export function MobileSocialDock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-gold-muted)]/50 bg-black/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2.5 rounded-xl border border-[var(--color-gold-muted)]/40 bg-black/70 p-2">
        <a className={`${dockBaseClass} bg-instagram`} href={getInstagramUrl()} rel="noreferrer" target="_blank">
          <Instagram className="size-4" />
          IG
        </a>
        <a className={`${dockBaseClass} bg-facebook`} href={getFacebookUrl()} rel="noreferrer" target="_blank">
          <Facebook className="size-4" />
          FB
        </a>
        <a
          className={`${dockBaseClass} bg-whatsapp`}
          href={getWhatsAppUrl("Hola! Me gustaria ver los nuevos drops")}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle className="size-4" />
          WA
        </a>
      </div>
    </div>
  )
}
