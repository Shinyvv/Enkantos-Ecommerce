import { redirect } from "next/navigation"
import { getAdminProducts, getCategories } from "@/lib/catalog"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { AdminProductManager } from "@/components/sections/admin-product-manager"

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    redirect("/admin/login")
  }

  const [products, categories] = await Promise.all([getAdminProducts(), getCategories()])

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-gold)]">Gestion interna</p>
      <AdminProductManager initialProducts={products} categories={categories} />
    </main>
  )
}