 "use client"
 
 import { useEffect, useMemo, useState } from "react"
 import { useSearchParams } from "next/navigation"
 import { http } from "@/lib/http"
import type { OrderDTO } from "@/types/orders"
import type { RobloxAccountDTO } from "@/types/robloxAccount"
import { useAuthToken } from "@/hooks/use-auth"
 
 export type Robux = {
   id: number
   robux_amount: number
   price: number
 }
 
 export type RobuxRes = { robuxes: Robux[] }
 
 function formatCurrency(n: number) {
   return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
 }
 
 export function useRobux() {
   const search = useSearchParams()
   const [step, setStep] = useState(0)
   const [items, setItems] = useState<Robux[]>([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)
 
   const [selectedId, setSelectedId] = useState<number | null>(() => {
     const id = search.get("robuxId")
     return id ? Number(id) : null
   })
   const [quantity, setQuantity] = useState(() => {
     const q = search.get("qty")
     return q ? Math.max(1, Number(q)) : 1
   })
 
   const [username, setUsername] = useState("")
   const [password, setPassword] = useState("")
 
   const [email, setEmail] = useState("")
   const [phone, setPhone] = useState("")
 
   useEffect(() => {
     let mounted = true
     setLoading(true)
     ;(async () => {
       try {
         const res = await http<RobuxRes>("/robuxes")
         if (!mounted) return
         setItems(res.robuxes || [])
         setError(null)
       } catch (e) {
         if (!mounted) return
         setItems([])
         setError(e instanceof Error ? e.message : "error")
       } finally {
         if (mounted) setLoading(false)
       }
     })()
     return () => {
       mounted = false
     }
   }, [])
 
   const selected = useMemo(() => items.find(it => it.id === selectedId) || null, [items, selectedId])
   const total = useMemo(() => (selected ? selected.price * quantity : 0), [selected, quantity])
 
   const canNextFromStep1 = !!selected && quantity > 0
   const canNextFromStep2 = username.trim().length >= 3 && password.trim().length >= 4
   const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
   const validPhone = /^[0-9+\s-]{6,}$/.test(phone.trim())
   const canPay = canNextFromStep1 && canNextFromStep2 && validEmail && validPhone
  const canAddToCart = canNextFromStep1 && canNextFromStep2
  const token = useAuthToken()
 
   const next = () => setStep(s => Math.min(s + 1, 2))
   const back = () => setStep(s => Math.max(s - 1, 0))
 
  const addToCart = async () => {
    if (!selected) throw new Error("no_selection")
    if (!validEmail) throw new Error("Email tidak valid")
    if (!validPhone) throw new Error("Nomor HP tidak valid")
    const title = `Top Up Robux ${selected.robux_amount}`
    const o = await http<{ order: OrderDTO }>("/client/orders", {
      method: "POST",
      body: JSON.stringify({ order_name: title, quantity, robuxes_id: selected.id }),
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    await http<{ roblox_account: RobloxAccountDTO }>("/client/roblox_accounts", {
      method: "POST",
      body: JSON.stringify({
        order_id: o.order.id,
        username,
        password,
        phone,
        email,
      }),
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    return o.order
  }

   return {
     step,
     setStep,
     steps: ["Pilih Nominal", "Masukkan Akun", "Detail Kontak"] as const,
     items,
     loading,
     error,
     selectedId,
     setSelectedId,
     quantity,
     setQuantity,
     selected,
     total,
     username,
     setUsername,
     password,
     setPassword,
     email,
     setEmail,
     phone,
     setPhone,
     canNextFromStep1,
     canNextFromStep2,
     canPay,
    canAddToCart,
     formatCurrency,
     next,
     back,
    addToCart,
   }
 }
