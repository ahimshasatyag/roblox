import { API_URL } from "@/config"

const ADMIN_COOKIE = "admin_accessToken"
const CLIENT_COOKIE = "client_accessToken"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function setAccessTokenCookie(token: string, scope?: "admin" | "client", maxAgeSeconds = 60 * 60 * 24) {
  if (typeof document === "undefined") return
  
  let detectedScope = scope
  if (!detectedScope) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      detectedScope = payload.scope === "admin" ? "admin" : "client"
    } catch {
      detectedScope = "client"
    }
  }

  const name = detectedScope === "admin" ? ADMIN_COOKIE : CLIENT_COOKIE
  document.cookie = `${name}=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`
}

export function clearAccessTokenCookie(scope: "admin" | "client") {
  if (typeof document === "undefined") return
  const name = scope === "admin" ? ADMIN_COOKIE : CLIENT_COOKIE
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}

export async function http<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  }
  if (!headers["Authorization"]) {
    const isAdmin = path.startsWith("/admin")
    const cookieName = isAdmin ? ADMIN_COOKIE : CLIENT_COOKIE
    const token = getCookie(cookieName)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      ...headers,
    },
    ...options,
    credentials: "include",
  })
  if (!res.ok) {
    const msg = await safeText(res)
    throw new Error(msg || `HTTP ${res.status}`)
  }
  const ct = res.headers.get("content-type") || ""
  if (ct.includes("application/json")) {
    return (await res.json()) as T
  }
  return (await res.text()) as unknown as T
}

async function safeText(res: Response) {
  try {
    return await res.text()
  } catch {
    return ""
  }
}
