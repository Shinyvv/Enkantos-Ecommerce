export const STORE_CONFIG = {
  name: process.env.NEXT_PUBLIC_STORE_NAME ?? "Enkantos Boutique",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/enkantos_talagante",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://facebook.com",
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "56900000000",
  location: "Av Bernardo O'Higgins 1010 Local 101, Talagante, Chile"
} as const

export const CATEGORY_ORDER = [
  "Vestidos",
  "Conjuntos",
  "Jeans",
  "Tops",
  "Blazers"
] as const

export const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "36", "38", "40", "42"] as const