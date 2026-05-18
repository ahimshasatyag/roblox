import { http } from "@/lib/http";
import { UserRole, RolesResponse } from "@/types/(admin)/users/index";

export const adminUserRolesService = {
    /**
     * Get list of roles
     */
    getRoles: async (): Promise<RolesResponse> => {
        return await http<RolesResponse>("/admin/roles");
    },

    /**
     * Get single role
     */
    getRole: async (id: number): Promise<{ role: UserRole }> => {
        // Fallback/Mock implementation or call to backend if it exists
        try {
            return await http<{ role: UserRole }>(`/admin/roles/${id}`);
        } catch (error) {
            // Mock response if backend doesn't exist yet to prevent crashes
            console.warn("Backend getRole might not exist, using mock", error);
            return { role: { id, role_name: "Mock Level" } };
        }
    },

    /**
     * Update an existing role
     */
    updateRole: async (id: number, data: any): Promise<{ role: UserRole }> => {
        return await http<{ role: UserRole }>(`/admin/roles/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    /**
     * Delete a role
     */
    deleteRole: async (id: number): Promise<{ ok: boolean }> => {
        return await http<{ ok: boolean }>(`/admin/roles/${id}`, {
            method: "DELETE",
        });
    },
};
