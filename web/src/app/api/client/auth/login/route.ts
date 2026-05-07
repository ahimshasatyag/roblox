import { NextResponse } from "next/server"
import { loginClient } from "@/services/auth/auth"

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const token = await loginClient(body)
    return NextResponse.json({ token })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Login failed"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
