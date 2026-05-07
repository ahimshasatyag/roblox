 import { http } from "@/lib/http"
 import type { Order, OrderDTO } from "@/types/orders"
 import { mapDTOToOrder } from "@/types/orders"
 
 export async function getOrders(): Promise<Order[]> {
   const res = await http<{ orders: OrderDTO[] }>("/admin/orders")
   const items = Array.isArray(res.orders) ? res.orders : []
   return items.map(mapDTOToOrder)
 }
 
 export async function createOrder(payload: {
   order_name: string
   quantity: number
   total: number
   status: "draft" | "belum_bayar" | "gagal" | "success"
   user_account_id: number
 }): Promise<Order> {
   const res = await http<{ order: OrderDTO }>("/admin/orders", {
     method: "POST",
     body: JSON.stringify(payload),
   })
   return mapDTOToOrder(res.order)
 }
 
 export async function updateOrder(id: number, payload: Partial<{
   invoice_number: string
   order_name: string
   quantity: number
   total: number
   status: "draft" | "belum_bayar" | "gagal" | "success"
   user_account_id: number
 }>): Promise<Order> {
   const res = await http<{ order: OrderDTO }>(`/admin/orders/${id}`, {
     method: "PUT",
     body: JSON.stringify(payload),
   })
   return mapDTOToOrder(res.order)
 }
 
 export async function deleteOrder(id: number): Promise<{ ok: boolean }> {
   return http<{ ok: boolean }>(`/admin/orders/${id}`, { method: "DELETE" })
 }

export async function getMyOrders(status?: "draft" | "belum_bayar" | "gagal" | "success", token?: string): Promise<Order[]> {
  const path = status ? `/client/orders?status=${encodeURIComponent(status)}` : "/client/orders"
  const res = await http<{ orders: OrderDTO[] }>(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  const items = Array.isArray(res.orders) ? res.orders : []
  return items.map(mapDTOToOrder)
}

export async function deleteMyOrder(id: number, token?: string): Promise<{ ok: boolean }> {
  return http<{ ok: boolean }>(`/client/orders/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}
