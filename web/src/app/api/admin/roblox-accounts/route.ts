import { NextResponse } from "next/server"
 import { API_URL } from "@/config"
 
export async function GET(req: Request) {
   try {
    const auth = req.headers.get("authorization") || ""
    const res = await fetch(`${API_URL}/admin/roblox_accounts`, {
      headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
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
 
 export async function POST(req: Request) {
   try {
     const body = await req.json()
    const auth = req.headers.get("authorization") || ""
    const res = await fetch(`${API_URL}/admin/roblox_accounts`, {
       method: "POST",
      headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
       credentials: "include",
       body: JSON.stringify(body),
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
