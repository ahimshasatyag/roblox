export interface Robux {
    id: number;
    robux_amount: number;
    price: number;
    created_at: string;
    updated_at: string;
}

export interface CreateRobuxRequest {
    robux_amount: number;
    price: number;
}

export interface UpdateRobuxRequest {
    robux_amount?: number;
    price?: number;
}
