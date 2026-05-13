import { http } from "@/lib/http";
import { ProductItemsResponse, CreateProductItemOrderRequest } from "@/types/productitems/index";

export const productService = {
    getProductItems: async (productId: number): Promise<ProductItemsResponse> => {
        return await http<ProductItemsResponse>(`/product-items?id_product=${productId}`);
    },
    getProduct: async (productId: number): Promise<any> => {
        return await http<any>(`/products/${productId}`);
    },
    createOrder: async (data: CreateProductItemOrderRequest): Promise<any> => {
        return await http<any>("/client/orders/product-item", {
            method: "POST",
            body: JSON.stringify(data)
        });
    }
};
