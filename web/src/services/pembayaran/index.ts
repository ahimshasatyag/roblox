import { http } from "@/lib/http"
import type { Pembayaran, PembayaranDTO } from "@/types/pembayaran"
import { mapDTOToPembayaran } from "@/types/pembayaran"

export async function getPembayaran(parentPaymentMethodId?: number): Promise<Pembayaran[]> {
  const path = parentPaymentMethodId ? `/pembayaran?parent_payment_method_id=${encodeURIComponent(String(parentPaymentMethodId))}` : "/pembayaran"
  const res = await http<{ pembayaran: PembayaranDTO[] }>(path)
  const items = Array.isArray(res.pembayaran) ? res.pembayaran : []
  return items.map(mapDTOToPembayaran)
}
