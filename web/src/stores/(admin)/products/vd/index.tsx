"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { ProductItem, CreateProductItemRequest, UpdateProductItemRequest } from "@/types/(admin)/products/vd/index"
import { adminProductItemService } from "@/services/(admin)/products/vd/index"

interface ProductItemContextType {
    items: ProductItem[];
    loading: boolean;
    fetchItems: (productId?: number) => Promise<void>;
    addItem: (data: CreateProductItemRequest) => Promise<void>;
    updateItem: (id: number, data: UpdateProductItemRequest) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
}

const ProductItemContext = createContext<ProductItemContextType | undefined>(undefined)

export function ProductItemProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ProductItem[]>([])
    const [loading, setLoading] = useState(false)

    const fetchItems = useCallback(async (productId?: number) => {
        setLoading(true)
        try {
            const res = await adminProductItemService.getProductItems(productId)
            setItems(res.product_items)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    const addItem = async (data: CreateProductItemRequest) => {
        const res = await adminProductItemService.createProductItem(data)
        setItems(prev => [...prev, res.product_item])
    }

    const updateItem = async (id: number, data: UpdateProductItemRequest) => {
        const res = await adminProductItemService.updateProductItem(id, data)
        setItems(prev => prev.map(i => i.id === id ? res.product_item : i))
    }

    const removeItem = async (id: number) => {
        await adminProductItemService.deleteProductItem(id)
        setItems(prev => prev.filter(i => i.id !== id))
    }

    return (
        <ProductItemContext.Provider value={{ items, loading, fetchItems, addItem, updateItem, removeItem }}>
            {children}
        </ProductItemContext.Provider>
    )
}

export function useProductItems() {
    const context = useContext(ProductItemContext)
    if (!context) throw new Error("useProductItems must be used within ProductItemProvider")
    return context
}
