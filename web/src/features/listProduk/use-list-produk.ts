"use client"
 
import { useEffect, useMemo, useState } from "react"
import { getProducts } from "@/services/products"
 
 export type Product = {
   id: number
  title: string
  basePrice: number
  image?: string
 }
 
 function formatCurrency(n: number) {
   return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
 }
 
 export function useListProduk() {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const items = await getProducts()
        if (mounted) setProducts(items)
      } catch {
        if (mounted) setProducts([])
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.title.toLowerCase().includes(q))
  }, [query, products])
  return { query, setQuery, products: filtered, formatCurrency }
 }
