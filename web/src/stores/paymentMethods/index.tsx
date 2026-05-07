"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getPaymentMethods } from "@/services/paymentMethods"
import type { PaymentMethod } from "@/types/paymentMethods"

type PaymentMethodsState = {
  methods: PaymentMethod[]
  loading: boolean
  refresh: () => Promise<void>
}

const PaymentMethodsContext = createContext<PaymentMethodsState>({
  methods: [],
  loading: false,
  refresh: async () => {},
})

export function PaymentMethodsProvider({ children }: { children: React.ReactNode }) {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    setLoading(true)
    try {
      const items = await getPaymentMethods()
      setMethods(items)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const value = useMemo(() => ({ methods, loading, refresh }), [methods, loading])
  return <PaymentMethodsContext.Provider value={value}>{children}</PaymentMethodsContext.Provider>
}

export function usePaymentMethodsStore() {
  return useContext(PaymentMethodsContext)
}
