import { http } from "@/lib/http"
import type { PaymentMethod, PaymentMethodDTO } from "@/types/paymentMethods"
import { mapDTOToPaymentMethod } from "@/types/paymentMethods"

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const res = await http<{ payment_methods: PaymentMethodDTO[] }>("/payment_methods")
  const items = Array.isArray(res.payment_methods) ? res.payment_methods : []
  return items.map(mapDTOToPaymentMethod)
}
