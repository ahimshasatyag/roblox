"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { ProductItem } from "@/types/productitems/index"
import { productService } from "@/services/productitems/index"

interface ProductItemContextType {
    items: ProductItem[];
    loading: boolean;
    fetchItems: (productId: number) => Promise<void>;
}

const ProductItemContext = createContext<ProductItemContextType | undefined>(undefined);

export function ProductItemProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchItems = useCallback(async (productId: number) => {
        setLoading(true);
        try {
            const res = await productService.getProductItems(productId);
            setItems(res.product_items || []);
        } catch (err) {
            console.error("Failed to fetch product items:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <ProductItemContext.Provider value={{ items, loading, fetchItems }}>
            {children}
        </ProductItemContext.Provider>
    );
}

export function useProductItems() {
    const context = useContext(ProductItemContext);
    if (context === undefined) {
        throw new Error("useProductItems must be used within a ProductItemProvider");
    }
    return context;
}
