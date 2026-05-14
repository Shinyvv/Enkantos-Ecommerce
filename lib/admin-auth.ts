import { cookies } from "next/headers"
import { createHash, timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"

const ADMIN_SESSION_COOKIE = "enkantos_admin_session"
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12

type AdminConfig = {
  username: string
  password: string
  sessionSecret: string
}

function getAdminConfig(): AdminConfig {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "Enkantos2026!",
    sessionSecret: process.env.ADMIN_SESSION_SECRET ?? "enkantos-admin-session-secret"
  }
}

function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex")
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

function getExpectedSessionToken(): string {
  const config = getAdminConfig()
  return hashValue(`${config.username}:${config.password}:${config.sessionSecret}`)
}

export function areAdminCredentialsValid(username: string, password: string): boolean {
  const config = getAdminConfig()
  return safeCompare(username, config.username) && safeCompare(password, config.password)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  if (!cookieToken) {
    return false
  }

  return safeCompare(cookieToken, getExpectedSessionToken())
}

export function setAdminSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: getExpectedSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE
  })

  return response
}

export function clearAdminSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  })

  return response
}

export async function requireAdminApiAuth(): Promise<NextResponse | null> {
  const authenticated = await isAdminAuthenticated()

  if (authenticated) {
    return null
  }

  return NextResponse.json(
    {
      message: "No autorizado"
    },
    { status: 401 }
  )
}