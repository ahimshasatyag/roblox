"use client"

import { useMemo, useState, useEffect } from "react"
import { useOrdersStore } from "@/stores/orders"
import type { Order } from "@/types/orders"

function formatCurrency(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
}

export function usePesanan() {
  const { orders, loading: storeLoading, refresh } = useOrdersStore()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Order[]>([])
  const [searched, setSearched] = useState(false)

  // Load initial orders if available
  useEffect(() => {
    if (!searched) {
      setResults(orders)
    }
  }, [orders, searched])

  const search = async () => {
    const q = query.trim()
    setSearched(true)
    setLoading(true)
    setError(null)
    
    try {
      // If query is empty, show all user orders
      if (!q) {
        setResults(orders)
        return
      }
      
      // Filter orders by invoice number
      const filtered = orders.filter(o => 
        (o.invoice || "").toLowerCase().includes(q.toLowerCase())
      )
      setResults(filtered)
    } catch {
      setError("Terjadi kesalahan saat mencari pesanan.")
    } finally {
      setLoading(false)
    }
  }

  const statusText = (s: Order["status"]) => {
    switch (s) {
      case "draft": return "Draft"
      case "belum_bayar": return "Belum Bayar"
      case "gagal": return "Gagal"
      case "success": return "Success"
      default: return s
    }
  }

  const statusVariant = (s: Order["status"]): "gray" | "red" | "green" => {
    switch (s) {
      case "success": return "green"
      case "gagal": return "red"
      default: return "gray"
    }
  }

  const hasResults = useMemo(() => results.length > 0, [results])

  return {
    query,
    setQuery,
    loading: loading || storeLoading,
    error,
    results,
    searched,
    search,
    formatCurrency,
    statusText,
    statusVariant,
    hasResults,
    refresh,
  }
}
