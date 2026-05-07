import { NextResponse } from "next/server"
import { meClient } from "@/services/auth/auth"

export async function GET(req: Request) {
  const h = req.headers.get("authorization")
  if (!h || !h.startsWith("Bearer ")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const token = h.slice("Bearer ".length)
  try {
    const me = await meClient(token)
    return NextResponse.json(me, { status: 200 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "invalid_token"
    return NextResponse.json({ error: msg }, { status: 401 })
  }
}
