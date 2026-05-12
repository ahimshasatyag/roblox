import { useEffect } from "react"
import { useProductItems as useStore } from "@/stores/(admin)/products/vd/index"

export function useProductItemsFeature(productId?: number) {
    const store = useStore()

    useEffect(() => {
        store.fetchItems(productId)
    }, [productId, store.fetchItems])

    return store
}
