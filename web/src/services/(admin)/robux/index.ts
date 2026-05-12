import { http } from "@/lib/http"
import { Robux, CreateRobuxRequest, UpdateRobuxRequest } from "@/types/(admin)/robux/index"

export const adminRobuxService = {
    getRobuxes: async () => {
        return await http<{ robuxes: Robux[] }>("/admin/robuxes")
    },
    createRobux: async (data: CreateRobuxRequest) => {
        return await http<{ robux: Robux }>("/admin/robuxes", {
            method: "POST",
            body: JSON.stringify(data),
        })
    },
    updateRobux: async (id: number, data: UpdateRobuxRequest) => {
        return await http<{ robux: Robux }>(`/admin/robuxes/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        })
    },
    deleteRobux: async (id: number) => {
        return await http<{ ok: boolean }>(`/admin/robuxes/${id}`, {
            method: "DELETE",
        })
    }
}
