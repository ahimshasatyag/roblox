import { http, setAccessTokenCookie, clearAccessTokenCookie } from "@/lib/http"
import type {
  LoginClientReq,
  TokenRes,
  RegisterClientReq,
  UserAccount,
  MeClientRes,
  UpdateClientReq,
} from "@/types/auth/auth"
import { API_URL } from "@/config"


export async function loginClient(data: LoginClientReq) {
  const res = await http<TokenRes>("/client/login", {
    method: "POST",
    body: JSON.stringify(data),
  })
  setAccessTokenCookie(res.token)
  return res.token
}


export async function meClient(token: string) {
  return await http<MeClientRes>("/client/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function registerClient(data: RegisterClientReq) {
  return await http<{ user_account: UserAccount }>("/client/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function logoutClient() {
  try {
    await http<{ ok: boolean }>("/client/logout", { method: "POST" })
  } catch {}
  clearAccessTokenCookie("client")
}


export async function updateClientMe(token: string, data: UpdateClientReq) {
  return await http<{ user_account: UserAccount }>("/client/me", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function uploadClientAvatar(token: string, file: File) {
  const fd = new FormData()
  fd.append("file", file)
  const res = await fetch(`${API_URL}/client/me/avatar`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
    credentials: "include",
  })
  const ct = res.headers.get("content-type") || ""
  const payload = ct.includes("application/json") ? await res.json() : await res.text()
  if (!res.ok) {
    const msg = typeof payload === "string" ? payload : payload?.error || "upload_error"
    throw new Error(msg)
  }
  return payload as { user_account: UserAccount }
}
