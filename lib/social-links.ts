import { STORE_CONFIG } from "@/lib/constants"

function createSocialMessage(productName: string): string {
  return `Hola! Me interesa este producto: ${productName}`
}

export function getInstagramUrl(productName?: string): string {
  if (!productName) return STORE_CONFIG.instagram
  return `${STORE_CONFIG.instagram}?utm_source=web&utm_medium=social&utm_campaign=${encodeURIComponent(productName)}`
}

export function getFacebookUrl(productName?: string): string {
  if (!productName) return STORE_CONFIG.facebook
  return `${STORE_CONFIG.facebook}?utm_source=web&utm_medium=social&utm_campaign=${encodeURIComponent(productName)}`
}

export function getWhatsAppUrl(productName: string): string {
  const message = encodeURIComponent(createSocialMessage(productName))
  return `https://wa.me/${STORE_CONFIG.whatsappPhone}?text=${message}`
}