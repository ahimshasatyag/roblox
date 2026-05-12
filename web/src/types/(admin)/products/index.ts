export interface Product {
    id: number;
    name: string;
    starting_price: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateProductRequest {
    name: string;
    starting_price: number;
    image_url: string | null;
}

export interface UpdateProductRequest {
    name?: string;
    starting_price?: number;
    image_url?: string | null;
}

export interface ProductsResponse {
    products: Product[];
}

export interface ProductResponse {
    product: Product;
}
