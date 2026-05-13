"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
 import { ChevronLeft } from "lucide-react"
 import CartItemRow from "@/components/shared/(cart)/cart/CartItemRow"
 import CartSummary from "@/components/shared/(cart)/cart/CartSummary"
 import CouponField from "@/components/shared/(cart)/cart/CouponField"
 import { useCart } from "@/features/(cart)/cart/use-cart"
import { getRobuxes } from "@/services/robux"
import { getMyOrders } from "@/services/orders"
import { useAuthToken } from "@/hooks/use-auth"
 
 export default function CartPage() {
   const router = useRouter()
  const search = useSearchParams()
  const initialized = useRef(false)
  const {
     items,
     subtotal,
     tax,
     total,
     coupon,
     setCoupon,
     increaseQty,
     decreaseQty,
     removeItem,
     applyCoupon,
     updateCart,
     formatCurrency,
    addItem,
    setCartItems,
   } = useCart()
  const token = useAuthToken()
 
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const idParam = search.get("robuxId")
    const qtyParam = search.get("qty")
    const orderParam = search.get("orderId")
    ;(async () => {
      try {
        const [robuxes, orders] = await Promise.all([getRobuxes(), token ? getMyOrders("draft", token) : Promise.resolve([])])
        if (orders.length > 0) {
          const priceMap = new Map<number, number>()
          robuxes.forEach(r => priceMap.set(r.amount, r.price))
          const toNumber = (name: string) => {
            const m = name.match(/(\d+)\s*Robux/i) || name.match(/Robux\s*(\d+)/i)
            return m ? Number(m[1]) : 0
          }
          const next = orders.map(o => {
            const amt = toNumber(o.name)
            let price = amt ? priceMap.get(amt) ?? 0 : 0
            if (price === 0 && o.qty > 0) {
              price = o.total / o.qty
            }
            return { id: o.id, name: o.name, qty: o.qty, price, orderId: o.id }
          })
          setCartItems(next)
          return
        }
        if (idParam) {
          const id = Number(idParam)
          const qty = Math.max(1, Number(qtyParam || "1"))
          const it = robuxes.find(r => r.id === id)
          if (it) addItem({ id: it.id, name: `${it.amount} Robux`, qty, price: it.price, orderId: orderParam ? Number(orderParam) : undefined })
        }
      } catch {
        // ignore
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
   return (
     <div className="min-h-screen container mx-auto px-4 py-10">
       <div className="mb-6 flex items-center justify-between">
         <button
           type="button"
           onClick={() => router.back()}
           className="inline-flex items-center gap-2 rounded border border-[var(--color-muted)] px-3 py-1 text-sm text-[var(--foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-300"
         >
           <ChevronLeft size={16} />
           Back
         </button>
       </div>
       <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">Shop</h1>
       <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2">
           <div className="rounded-md border border-[var(--color-muted)] p-4">
             {items.length === 0 ? (
               <div className="py-10 text-center text-[var(--foreground)]/70">Keranjang kosong</div>
             ) : (
               items.map(it => (
                 <CartItemRow
                   key={it.id}
                   item={it}
                   onIncrease={increaseQty}
                   onDecrease={decreaseQty}
                   onRemove={removeItem}
                   formatCurrency={formatCurrency}
                 />
               ))
             )}
           </div>
           <CouponField coupon={coupon} setCoupon={setCoupon} onApply={applyCoupon} onUpdate={updateCart} />
         </div>
         <div>
           <CartSummary
             tax={tax}
             subtotal={subtotal}
             total={total}
             formatCurrency={formatCurrency}
           />
         </div>
       </div>
     </div>
   )
 }
