import { NextResponse } from "next/server"
import { API_URL } from "@/config"

export async function POST(req: Request) {
  const body = await req.json()
  const res = await fetch(`${API_URL}/client/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const ct = res.headers.get("content-type") || ""
  const payload = ct.includes("application/json") ? await res.json() : await res.text()
  if (!res.ok) {
    const msg = typeof payload === "string" ? payload : payload?.error || "error"
    return NextResponse.json({ error: msg }, { status: res.status })
  }
  return NextResponse.json(payload, { status: res.status })
}
