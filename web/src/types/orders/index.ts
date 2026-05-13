export type OrderHeaderDTO = {
  id: number
  order_id: number
  roblox_account_id: number
  invoice_number: string
  total: number
  status: string
  created_at?: string
  updated_at?: string
}

export type OrderHeader = {
  id: number
  orderId: number
  robloxAccountId: number
  invoiceNumber: string
  total: number
  status: string
  createdAt?: string
  updatedAt?: string
}

export type OrderDTO = {
  id: number
  invoice_number: string | null
  order_name: string
  order_date?: string
  quantity: number
  total: number
  status: "draft" | "belum_bayar" | "gagal" | "success"
  created_at?: string
  updated_at?: string
  user_account_id: number
  payment_method?: string | null
  payment_account?: string | null
  robuxes_id?: number | null
  pembayaran_id?: number | null
  order_header_id?: number | null
  header_total?: number | null
  roblox_username?: string | null
  header_date?: string | null
  id_product_items?: number | null
  header?: OrderHeaderDTO | null
}

export type Order = {
  id: number
  invoice: string | null
  name: string
  date?: string
  qty: number
  total: number
  status: "draft" | "belum_bayar" | "gagal" | "success"
  userAccountId: number
  paymentMethod?: string | null
  paymentAccount?: string | null
  robuxesId?: number | null
  pembayaranId?: number | null
  orderHeaderId?: number | null
  headerTotal?: number | null
  robloxUsername?: string | null
  headerDate?: string | null
  idProductItems?: number | null
  header?: OrderHeader | null
}

export function mapDTOToOrder(dto: OrderDTO): Order {
  return {
    id: dto.id,
    invoice: dto.invoice_number,
    name: dto.order_name,
    date: dto.order_date,
    qty: dto.quantity,
    total: dto.total,
    status: dto.status,
    userAccountId: dto.user_account_id,
    paymentMethod: dto.payment_method,
    paymentAccount: dto.payment_account,
    robuxesId: dto.robuxes_id,
    pembayaranId: dto.pembayaran_id,
    orderHeaderId: dto.order_header_id,
    headerTotal: dto.header_total,
    robloxUsername: dto.roblox_username,
    headerDate: dto.header_date,
    idProductItems: dto.id_product_items,
    header: dto.header ? {
      id: dto.header.id,
      orderId: dto.header.order_id,
      robloxAccountId: dto.header.roblox_account_id,
      invoiceNumber: dto.header.invoice_number,
      total: dto.header.total,
      status: dto.header.status,
      createdAt: dto.header.created_at,
      updatedAt: dto.header.updated_at,
    } : null
  }
}

export type DeleteOrderRes = { ok: boolean }
