export type PembayaranDTO = {
  id: number
  parent_payment_method_id: number
  nama_pembayaran: string
  created_at?: string
  updated_at?: string
}

export type Pembayaran = {
  id: number
  parentPaymentMethodId: number
  name: string
}

export function mapDTOToPembayaran(dto: PembayaranDTO): Pembayaran {
  return {
    id: dto.id,
    parentPaymentMethodId: dto.parent_payment_method_id,
    name: dto.nama_pembayaran,
  }
}
