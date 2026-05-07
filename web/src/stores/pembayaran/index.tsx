"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getPembayaran } from "@/services/pembayaran"
import type { Pembayaran } from "@/types/pembayaran"

type PembayaranState = {
  pembayaran: Pembayaran[]
  loading: boolean
  currentParentId: number | null
  setParentId: (id: number | null) => void
  refresh: () => Promise<void>
}

const PembayaranContext = createContext<PembayaranState>({
  pembayaran: [],
  loading: false,
  currentParentId: null,
  setParentId: () => {},
  refresh: async () => {},
})

export function PembayaranProvider({ children }: { children: React.ReactNode }) {
  const [pembayaran, setPembayaran] = useState<Pembayaran[]>([])
  const [loading, setLoading] = useState(false)
  const [currentParentId, setCurrentParentId] = useState<number | null>(null)

  const refresh = async () => {
    setLoading(true)
    try {
      const items = await getPembayaran(currentParentId ?? undefined)
      setPembayaran(items)
    } finally {
      setLoading(false)
    }
  }

  const setParentId = (id: number | null) => {
    setCurrentParentId(id)
  }

  useEffect(() => {
    refresh()
  }, [currentParentId])

  const value = useMemo(
    () => ({ pembayaran, loading, currentParentId, setParentId, refresh }),
    [pembayaran, loading, currentParentId]
  )
  return <PembayaranContext.Provider value={value}>{children}</PembayaranContext.Provider>
}

export function usePembayaranStore() {
  return useContext(PembayaranContext)
}
