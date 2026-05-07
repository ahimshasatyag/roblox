import { NextResponse } from "next/server"
import { API_URL } from "@/config"

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/products`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    const ct = res.headers.get("content-type") || ""
    const payload = ct.includes("application/json") ? await res.json() : await res.text()
    if (!res.ok) {
      const msg = typeof payload === "string" ? payload : payload?.error || "error"
      return NextResponse.json({ error: msg }, { status: res.status })
    }
    return NextResponse.json(payload, { status: res.status })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch_error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
