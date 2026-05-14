import { Facebook, Instagram, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFacebookUrl, getInstagramUrl, getWhatsAppUrl } from "@/lib/social-links"

type ProductSocialActionsProps = {
  productName: string
  className?: string
}

export function ProductSocialActions({ productName, className }: ProductSocialActionsProps) {
  return (
    <div className={className}>
      <div className="grid gap-2.5 rounded-xl border border-[var(--color-gold-muted)]/35 bg-black/60 p-2.5 md:grid-cols-3">
        <Button
          variant="socialInstagram"
          className="h-11 min-w-0 justify-start px-4 text-left whitespace-normal leading-tight sm:justify-center sm:text-center"
          asChild
        >
          <a href={getInstagramUrl(productName)} rel="noreferrer" target="_blank">
            <Instagram className="size-4" />
            Consultar Instagram
          </a>
        </Button>
        <Button
          variant="socialFacebook"
          className="h-11 min-w-0 justify-start px-4 text-left whitespace-normal leading-tight sm:justify-center sm:text-center"
          asChild
        >
          <a href={getFacebookUrl(productName)} rel="noreferrer" target="_blank">
            <Facebook className="size-4" />
            Consultar Facebook
          </a>
        </Button>
        <Button
          variant="socialWhatsApp"
          className="h-11 min-w-0 justify-start px-4 text-left whitespace-normal leading-tight sm:justify-center sm:text-center"
          asChild
        >
          <a href={getWhatsAppUrl(productName)} rel="noreferrer" target="_blank">
            <MessageCircle className="size-4" />
            Consultar WhatsApp
          </a>
        </Button>
      </div>
    </div>
  )
}
