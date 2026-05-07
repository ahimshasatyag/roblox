export type RobloxAccountDTO = {
   id: number
   order_id: number
  invoice_number: string | null
   username: string
   password: string
   phone: string
   email: string
   created_at?: string
   updated_at?: string
 }
 
 export type RobloxAccount = {
   id: number
   orderId: number
  invoice: string | null
   username: string
   password: string
   phone: string
   email: string
 }
 
 export function mapDTOToRobloxAccount(dto: RobloxAccountDTO): RobloxAccount {
   return {
     id: dto.id,
     orderId: dto.order_id,
     invoice: dto.invoice_number,
     username: dto.username,
     password: dto.password,
     phone: dto.phone,
     email: dto.email,
   }
 }
