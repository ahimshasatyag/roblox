export type PaymentMethodDTO = {
  id: number
  metode_pembayaran: string
  akun: string
  created_at?: string
  updated_at?: string
}

export type PaymentMethod = {
  id: number
  method: string
  account: string
}

export function mapDTOToPaymentMethod(dto: PaymentMethodDTO): PaymentMethod {
  return {
    id: dto.id,
    method: dto.metode_pembayaran,
    account: dto.akun,
  }
}
