"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getProducts } from "@/services/products"
import type { Product } from "@/types/products"

type ProductsState = {
  products: Product[]
  loading: boolean
  refresh: () => Promise<void>
}

const ProductsContext = createContext<ProductsState>({
  products: [],
  loading: false,
  refresh: async () => {},
})

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    setLoading(true)
    try {
      const items = await getProducts()
      setProducts(items)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const value = useMemo(() => ({ products, loading, refresh }), [products, loading])
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProductsStore() {
  return useContext(ProductsContext)
}
