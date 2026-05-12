export interface User {
    id: number;
    role_id: number | null;
    fullname: string;
    username: string;
    created_at: string;
    email: string | null;
}

export interface CreateUserRequest {
    role_id?: number;
    fullname: string;
    username: string;
    password: string;
    email?: string;
}

export interface UpdateUserRequest {
    role_id?: number;
    fullname?: string;
    username?: string;
    password?: string;
    email?: string;
}

export interface UserRole {
    id: number;
    role_name: string;
}

export interface UserResponse {
    user: User;
}

export interface UsersResponse {
    users: User[];
}

export interface RolesResponse {
    roles: UserRole[];
}
