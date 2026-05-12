import { http } from "@/lib/http";
import { User, CreateUserRequest, UpdateUserRequest, UserResponse, UsersResponse, RolesResponse } from "@/types/(admin)/users/index";

export const adminUserService = {
    /**
     * Get list of users
     */
    getUsers: async (): Promise<UsersResponse> => {
        return await http<UsersResponse>("/admin/users");
    },

    /**
     * Get single user
     */
    getUser: async (id: number): Promise<UserResponse> => {
        return await http<UserResponse>(`/admin/users/${id}`);
    },

    /**
     * Get list of roles
     */
    getRoles: async (): Promise<RolesResponse> => {
        return await http<RolesResponse>("/admin/roles");
    },

    /**
     * Create a new user
     */
    createUser: async (data: CreateUserRequest): Promise<UserResponse> => {
        return await http<UserResponse>("/admin/users", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    /**
     * Update an existing user
     */
    updateUser: async (id: number, data: UpdateUserRequest): Promise<UserResponse> => {
        return await http<UserResponse>(`/admin/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    /**
     * Delete a user
     */
    deleteUser: async (id: number): Promise<{ ok: boolean }> => {
        return await http<{ ok: boolean }>(`/admin/users/${id}`, {
            method: "DELETE",
        });
    },
};
