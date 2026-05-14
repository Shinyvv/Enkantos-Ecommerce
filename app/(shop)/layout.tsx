import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { MobileSocialDock } from "@/components/layout/mobile-social-dock"

export const experimental_ppr = true

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="texture-overlay min-h-screen">{children}</div>
      <SiteFooter />
      <MobileSocialDock />
    </>
  )
}