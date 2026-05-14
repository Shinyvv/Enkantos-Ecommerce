import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { AdminLoginForm } from "@/components/sections/admin-login-form"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export const metadata: Metadata = {
  title: "Login Admin"
}

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated()

  if (authenticated) {
    redirect("/admin")
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <AdminLoginForm />
    </main>
  )
}