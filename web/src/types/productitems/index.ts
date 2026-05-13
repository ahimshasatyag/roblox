export interface ProductItem {
    id: number;
    id_product: number;
    name: string;
    price: number;
    created_at?: string;
    updated_at?: string;
}

export interface ProductItemsResponse {
    product_items: ProductItem[];
}

export interface CreateProductItemOrderRequest {
    id_product_item: number;
    quantity: number;
    username: string;
    password?: string;
    phone: string;
    email: string;
}
