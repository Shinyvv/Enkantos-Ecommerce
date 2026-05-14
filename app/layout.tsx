import type { Metadata } from "next"
import { Cinzel, Manrope } from "next/font/google"
import "@/app/globals.css"
import { Toaster } from "@/components/ui/toaster"

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display"
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
})

export const metadata: Metadata = {
  metadataBase: new URL("https://enkantos-boutique.cl"),
  title: {
    default: "Enkantos Boutique | Moda viral femenina",
    template: "%s | Enkantos Boutique"
  },
  description:
    "Boutique femenina en Talagante. Moda juvenil, trendy y viral. Descubre outfits y consulta por Instagram, Facebook y WhatsApp.",
  openGraph: {
    title: "Enkantos Boutique",
    description: "Tu proximo outfit esta aqui. Moda viral que roba miradas.",
    type: "website",
    locale: "es_CL",
    siteName: "Enkantos Boutique"
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${cinzel.variable} ${manrope.variable} bg-background text-foreground antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}