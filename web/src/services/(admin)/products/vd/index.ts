import { http } from "@/lib/http";
import { 
    ProductItemResponse, 
    ProductItemsResponse, 
    CreateProductItemRequest, 
    UpdateProductItemRequest 
} from "@/types/(admin)/products/vd/index";

export const adminProductItemService = {
    getProductItems: async (productId?: number): Promise<ProductItemsResponse> => {
        const query = productId ? `?id_product=${productId}` : "";
        return await http<ProductItemsResponse>(`/admin/product-items${query}`);
    },

    createProductItem: async (data: CreateProductItemRequest): Promise<ProductItemResponse> => {
        return await http<ProductItemResponse>("/admin/product-items", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    updateProductItem: async (id: number, data: UpdateProductItemRequest): Promise<ProductItemResponse> => {
        return await http<ProductItemResponse>(`/admin/product-items/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    deleteProductItem: async (id: number): Promise<{ ok: boolean }> => {
        return await http<{ ok: boolean }>(`/admin/product-items/${id}`, {
            method: "DELETE",
        });
    },
};
