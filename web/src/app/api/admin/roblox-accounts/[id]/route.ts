import { NextResponse } from "next/server"
 import { API_URL } from "@/config"
 
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
   try {
    const { id } = await context.params
     const body = await req.json()
    const auth = req.headers.get("authorization") || ""
    const res = await fetch(`${API_URL}/admin/roblox_accounts/${id}`, {
       method: "PUT",
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
 
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
   try {
    const { id } = await context.params
    const auth = req.headers.get("authorization") || ""
    const res = await fetch(`${API_URL}/admin/roblox_accounts/${id}`, {
       method: "DELETE",
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
