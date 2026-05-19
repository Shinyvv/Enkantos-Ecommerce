import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
const connectionString = process.env.DATABASE_URL
const isDatabaseDisabled = process.env.DISABLE_DATABASE === "true" || !connectionString

const prismaClient =
  globalForPrisma.prisma ??
  (isDatabaseDisabled
    ? (new Proxy({} as PrismaClient, {
        get() {
          throw new Error("DATABASE_URL no esta definida o la base de datos esta deshabilitada")
        }
      }) as PrismaClient)
    : new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
      }))

export const prisma = prismaClient

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient
}
