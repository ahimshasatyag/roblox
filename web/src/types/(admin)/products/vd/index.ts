export interface ProductItem {
    id: number;
    id_product: number;
    name: string;
    price: number;
    created_at: string;
    updated_at: string;
}

export interface ProductItemsResponse {
    product_items: ProductItem[];
}

export interface ProductItemResponse {
    product_item: ProductItem;
}

export interface CreateProductItemRequest {
    id_product: number;
    name: string;
    price: number;
}

export interface UpdateProductItemRequest {
    name?: string;
    price?: number;
}
