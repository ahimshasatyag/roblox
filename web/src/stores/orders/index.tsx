"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getMyOrders } from "@/services/orders"
import { useAuthToken } from "@/hooks/use-auth"
import type { Order } from "@/types/orders"

type OrdersState = {
  orders: Order[]
  loading: boolean
  refresh: () => Promise<void>
}

const OrdersContext = createContext<OrdersState>({
  orders: [],
  loading: false,
  refresh: async () => {},
})

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const token = useAuthToken()

  const refresh = async () => {
    if (!token) return
    
    // Check if it's an admin token (quick check)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload.scope === "admin") return // Don't fetch client orders for admin
    } catch {}

    setLoading(true)
    try {
      const items = await getMyOrders(undefined, token)
      setOrders(items)
    } catch (e: any) {
      console.error("Failed to fetch orders:", e)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [token])

  const value = useMemo(() => ({ orders, loading, refresh }), [orders, loading])
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrdersStore() {
  return useContext(OrdersContext)
}
