"use client"
 
import Button from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuthToken } from "@/hooks/use-auth"
import { confirmLoginRequired } from "@/components/ui/notify"
 
type Props = {
  tax: number
  subtotal: number
  total: number
  formatCurrency: (n: number) => string
}

export default function CartSummary({ tax, subtotal, total, formatCurrency }: Props) {
  const router = useRouter()
  const token = useAuthToken()

  const handleCheckout = async () => {
    if (!token) {
      const res = await confirmLoginRequired()
      if (res.isConfirmed) {
        router.push("/auth/login")
      }
    } else {
      router.push("/payment")
    }
  }

  return (
     <div className="rounded-md border border-[var(--color-muted)] p-4">
       <h3 className="text-lg font-semibold text-[var(--foreground)]">Cart Totals</h3>
       <div className="mt-4 space-y-3">
         <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--foreground)]/70">Harga Robux</span>
          <span className="text-[var(--foreground)]">{formatCurrency(subtotal)}</span>
         </div>
         <div className="flex items-center justify-between text-sm">
           <span className="text-[var(--foreground)]/70">Tax</span>
           <span className="text-[var(--foreground)]">{formatCurrency(tax)}</span>
         </div>
         <div className="flex items-center justify-between text-sm">
           <span className="text-[var(--foreground)]/70">Subtotal</span>
           <span className="text-[var(--foreground)]">{formatCurrency(subtotal)}</span>
         </div>
       </div>
       <div className="mt-4 flex items-center justify-between border-t border-[var(--color-muted)] pt-4">
         <span className="text-base font-semibold text-[var(--foreground)]">Total</span>
         <span className="text-base font-bold text-[var(--foreground)]">{formatCurrency(total)}</span>
       </div>
       <div className="mt-6 space-y-3">
        <Button text="Proceed to Checkout" variant="primary" type="button" onClick={handleCheckout} />
         <Button text="Continue Shopping" variant="secondary" type="button" />
       </div>
     </div>
   )
 }
