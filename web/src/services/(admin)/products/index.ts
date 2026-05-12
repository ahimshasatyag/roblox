import { http } from "@/lib/http";
import { 
    ProductResponse, 
    ProductsResponse, 
    CreateProductRequest, 
    UpdateProductRequest 
} from "@/types/(admin)/products/index";

export const adminProductService = {
    getProducts: async (): Promise<ProductsResponse> => {
        return await http<ProductsResponse>("/admin/products");
    },

    getProduct: async (id: number): Promise<ProductResponse> => {
        return await http<ProductResponse>(`/admin/products/${id}`);
    },

    createProduct: async (data: CreateProductRequest): Promise<ProductResponse> => {
        return await http<ProductResponse>("/admin/products", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    updateProduct: async (id: number, data: UpdateProductRequest): Promise<ProductResponse> => {
        return await http<ProductResponse>(`/admin/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    deleteProduct: async (id: number): Promise<{ ok: boolean }> => {
        return await http<{ ok: boolean }>(`/admin/products/${id}`, {
            method: "DELETE",
        });
    },

    uploadImage: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await http<{ url: string }>("/admin/products/upload", {
            method: "POST",
            body: formData,
            // Header for FormData will be set by fetch automatically
            headers: {
                "Content-Type": "unset",
            },
        });
        return res;
    },
};
