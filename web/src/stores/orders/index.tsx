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
    setLoading(true)
    try {
      const items = await getMyOrders(undefined, token || undefined)
      setOrders(items)
    } catch {
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
