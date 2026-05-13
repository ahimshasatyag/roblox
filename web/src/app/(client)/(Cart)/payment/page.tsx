 "use client"
 
 import { useEffect } from "react"
 import { useRouter } from "next/navigation"
 import { ChevronLeft } from "lucide-react"
 import { Button, FormCard } from "@/components/ui"
 import PaymentOptions from "@/components/shared/(cart)/payment/PaymentOptions"
 import { usePayment } from "@/features/(cart)/payment/use-payment"
 import { useCart } from "@/features/(cart)/cart/use-cart"
 import { getRobuxes } from "@/services/robux"
 import { getMyOrders } from "@/services/orders"
 import { useAuthToken } from "@/hooks/use-auth"
 import { http } from "@/lib/http"
import { notifyError, notifySuccess, confirmLoginRequired } from "@/components/ui/notify"
 
 export default function PaymentPage() {
   const router = useRouter()
   const token = useAuthToken()
  const { groups, selected, select } = usePayment()
   const { items, subtotal, tax, total, formatCurrency, setCartItems } = useCart()
 
   useEffect(() => {
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
         }
       } catch {
         // ignore
       }
     })()
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
 
   const handlePay = async () => {
     if (!token) {
       const r = await confirmLoginRequired("Silakan login untuk melanjutkan pembayaran.")
       if (r.isConfirmed) router.push("/auth/login")
       return
     }
     if (!selected) {
       await notifyError("Pilih Metode", "Silakan pilih metode pembayaran terlebih dahulu.")
       return
     }
      try {
        // Finalize payment on backend
        const res = await http<{ invoice_number: string; total: number }>("/client/finalize", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ payment_method_id: selected })
        })

        let selectedItem: any = null
        for (const g of groups) {
          const it = g.items.find(i => i.id === selected)
          if (it) {
            selectedItem = it
            break
          }
        }
        
        if (selectedItem) {
          const params = new URLSearchParams()
          params.set("method", selectedItem.label)
          params.set("amount", formatCurrency(res.total))
          params.set("account", selectedItem.account || "-")
          params.set("invoice", res.invoice_number)
          router.push(`/payment/success?${params.toString()}`)
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Gagal memproses pembayaran"
        await notifyError("Gagal", msg)
      }
   }
 
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
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">Pembayaran</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
           <FormCard className="w-full">
             <h2 className="text-lg font-semibold text-[var(--foreground)]">Ringkasan Pesanan</h2>
             <div className="mt-4 space-y-3">
               {items.length === 0 ? (
                 <div className="py-6 text-center text-[var(--foreground)]/70">Tidak ada item dalam pesanan</div>
               ) : (
                 items.map(it => (
                   <div key={it.id} className="flex items-center justify-between border-b border-[var(--color-muted)] pb-3">
                     <div>
                       <div className="text-sm md:text-base font-medium text-[var(--foreground)]">{it.name}</div>
                       <div className="text-xs text-[var(--foreground)]/60 mt-0.5">Jumlah: {it.qty}</div>
                     </div>
                     <div className="text-sm md:text-base font-semibold text-[var(--foreground)]">
                       {formatCurrency(it.price * it.qty)}
                     </div>
                   </div>
                 ))
               )}
             </div>
             <div className="mt-4 space-y-2">
               <div className="flex items-center justify-between text-sm">
                 <span className="text-[var(--foreground)]/70">Harga Robux</span>
                 <span className="text-[var(--foreground)]">{formatCurrency(subtotal)}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-[var(--foreground)]/70">Tax</span>
                 <span className="text-[var(--foreground)]">{formatCurrency(tax)}</span>
               </div>
               <div className="flex items-center justify-between text-base border-t border-[var(--color-muted)] pt-3">
                 <span className="font-semibold text-[var(--foreground)]">Total Pembayaran</span>
                 <span className="font-bold text-[var(--foreground)]">{formatCurrency(total)}</span>
               </div>
             </div>
           </FormCard>
         </div>
        <div>
           <FormCard className="w-full">
             <h2 className="text-lg font-semibold text-[var(--foreground)]">Metode Pembayaran</h2>
             <div className="mt-4">
              <PaymentOptions groups={groups} selected={selected} onSelect={select} />
             </div>
             <div className="mt-6">
               <Button text="Bayar" variant="primary" type="button" disabled={!selected || items.length === 0} onClick={handlePay} />
             </div>
           </FormCard>
         </div>
       </div>
     </div>
   )
 }
