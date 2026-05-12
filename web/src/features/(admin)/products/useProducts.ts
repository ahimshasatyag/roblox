import { useEffect } from "react"
import { useProductStore } from "@/stores/(admin)/products/index"

export const useProducts = () => {
    const { 
        products, 
        loading, 
        error, 
        fetchProducts, 
        createProduct, 
        updateProduct, 
        deleteProduct 
    } = useProductStore()

    useEffect(() => {
        fetchProducts()
    }, [])

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct
    }
}
