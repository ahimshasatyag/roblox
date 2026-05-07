"use client"
 
 import { useMemo, useState } from "react"
import { http } from "@/lib/http"
import { useAuthToken } from "@/hooks/use-auth"
 
 export type CartItem = {
   id: number
   name: string
   variant?: string
   qty: number
   price: number
  orderId?: number
 }
 
 function formatCurrency(n: number) {
   return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
 }
 
 export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
   const [coupon, setCoupon] = useState("")
   const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const token = useAuthToken()
  const persistQty = async (orderId?: number, qty?: number) => {
    if (!orderId || !qty || !token) return
    try {
      await http<{ order: unknown }>(`/client/orders/${orderId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity: qty }),
      })
    } catch {}
  }
 
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items])
  const shipping = useMemo(() => 0, [])
   const tax = useMemo(() => Math.round(subtotal * 0.1), [subtotal])
   const discount = useMemo(() => (appliedCoupon ? Math.round(subtotal * 0.05) : 0), [appliedCoupon, subtotal])
   const total = useMemo(() => subtotal + shipping + tax - discount, [subtotal, shipping, tax, discount])
 
   const increaseQty = (id: number) => {
    setItems(prev => {
      const next = prev.map(it => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
      const t = next.find(it => it.id === id)
      void persistQty(t?.orderId, t?.qty)
      return next
    })
   }
   const decreaseQty = (id: number) => {
    setItems(prev => {
      const next = prev.map(it => (it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it)) as CartItem[]
      const t = next.find(it => it.id === id)
      void persistQty(t?.orderId, t?.qty)
      return next
    })
   }
   const removeItem = (id: number) => {
     setItems(prev => prev.filter(it => it.id !== id))
   }
  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(it => it.id === item.id)
      if (existing) {
        const next = prev.map(it => (it.id === item.id ? { ...it, qty: it.qty + item.qty, orderId: item.orderId ?? it.orderId } : it))
        const t = next.find(it => it.id === item.id)
        void persistQty(t?.orderId, t?.qty)
        return next
      }
      const next = [...prev, item]
      void persistQty(item.orderId, item.qty)
      return next
    })
  }
   const applyCoupon = () => {
     setAppliedCoupon(coupon.trim() ? coupon.trim() : null)
   }
   const updateCart = () => {}
 
   return {
     items,
     subtotal,
     shipping,
     tax,
     discount,
     total,
     coupon,
     setCoupon,
     appliedCoupon,
     increaseQty,
     decreaseQty,
     removeItem,
    addItem,
     applyCoupon,
     updateCart,
     formatCurrency,
    setCartItems: (next: CartItem[]) => setItems(next),
   }
 }
