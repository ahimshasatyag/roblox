"use client"

import { create } from "zustand";
import { Product, CreateProductRequest, UpdateProductRequest } from "@/types/(admin)/products/index";
import { adminProductService } from "@/services/(admin)/products/index";

interface ProductStore {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    createProduct: (data: CreateProductRequest) => Promise<void>;
    updateProduct: (id: number, data: UpdateProductRequest) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const res = await adminProductService.getProducts();
            set({ products: res.products, loading: false });
        } catch (err: any) {
            set({ error: err.message || "Failed to fetch products", loading: false });
        }
    },

    createProduct: async (data: CreateProductRequest) => {
        set({ loading: true, error: null });
        try {
            const res = await adminProductService.createProduct(data);
            set((state) => ({
                products: [res.product, ...state.products],
                loading: false,
            }));
        } catch (err: any) {
            set({ error: err.message || "Failed to create product", loading: false });
            throw err;
        }
    },

    updateProduct: async (id: number, data: UpdateProductRequest) => {
        set({ loading: true, error: null });
        try {
            const res = await adminProductService.updateProduct(id, data);
            set((state) => ({
                products: state.products.map((p) => (p.id === id ? res.product : p)),
                loading: false,
            }));
        } catch (err: any) {
            set({ error: err.message || "Failed to update product", loading: false });
            throw err;
        }
    },

    deleteProduct: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await adminProductService.deleteProduct(id);
            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
                loading: false,
            }));
        } catch (err: any) {
            set({ error: err.message || "Failed to delete product", loading: false });
            throw err;
        }
    },
}));
