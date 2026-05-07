 import { http } from "@/lib/http"
 import type { RobloxAccount, RobloxAccountDTO } from "@/types/robloxAccount"
 import { mapDTOToRobloxAccount } from "@/types/robloxAccount"
 
 export async function getRobloxAccounts(): Promise<RobloxAccount[]> {
   const res = await http<{ roblox_accounts: RobloxAccountDTO[] }>("/admin/roblox_accounts")
   const items = Array.isArray(res.roblox_accounts) ? res.roblox_accounts : []
   return items.map(mapDTOToRobloxAccount)
 }
 
 export async function createRobloxAccount(payload: {
   order_id: number
   invoice_number: string
   username: string
   password: string
   phone: string
   email: string
 }): Promise<RobloxAccount> {
   const res = await http<{ roblox_account: RobloxAccountDTO }>("/admin/roblox_accounts", {
     method: "POST",
     body: JSON.stringify(payload),
   })
   return mapDTOToRobloxAccount(res.roblox_account)
 }
 
 export async function updateRobloxAccount(id: number, payload: Partial<{
   order_id: number
   invoice_number: string
   username: string
   password: string
   phone: string
   email: string
 }>): Promise<RobloxAccount> {
   const res = await http<{ roblox_account: RobloxAccountDTO }>(`/admin/roblox_accounts/${id}`, {
     method: "PUT",
     body: JSON.stringify(payload),
   })
   return mapDTOToRobloxAccount(res.roblox_account)
 }
 
 export async function deleteRobloxAccount(id: number): Promise<{ ok: boolean }> {
   return http<{ ok: boolean }>(`/admin/roblox_accounts/${id}`, { method: "DELETE" })
 }
