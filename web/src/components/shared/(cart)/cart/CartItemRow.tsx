"use client"
 
 import { Minus, Plus, Trash2 } from "lucide-react"
import { CartItem } from "@/features/(cart)/cart/use-cart"
import { useAuthToken } from "@/hooks/use-auth"
import { deleteMyOrder } from "@/services/orders"
 
 type Props = {
   item: CartItem
   onIncrease: (id: number) => void
   onDecrease: (id: number) => void
   onRemove: (id: number) => void
   formatCurrency: (n: number) => string
 }
 
 export default function CartItemRow({ item, onIncrease, onDecrease, onRemove, formatCurrency }: Props) {
  const token = useAuthToken()
  const handleRemove = async () => {
    try {
      if (item.orderId && token) {
        await deleteMyOrder(item.orderId, token)
      }
    } catch {
    } finally {
      onRemove(item.id)
    }
  }
   return (
     <div className="flex items-center justify-between py-4 border-b border-[var(--color-muted)]">
       <div className="flex-1">
         <div className="text-sm md:text-base font-medium text-[var(--foreground)]">{item.name}</div>
         {item.variant && <div className="text-xs text-[var(--foreground)]/60 mt-0.5">{item.variant}</div>}
         <div className="mt-3 flex items-center gap-2">
           <button
             type="button"
             onClick={() => onDecrease(item.id)}
             className="inline-flex h-8 w-8 items-center justify-center rounded border border-[var(--color-muted)] text-[var(--foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-300"
             aria-label="Decrease quantity"
           >
             <Minus size={16} />
           </button>
           <span className="min-w-[2rem] text-center text-sm font-medium text-[var(--foreground)]">{item.qty}</span>
           <button
             type="button"
             onClick={() => onIncrease(item.id)}
             className="inline-flex h-8 w-8 items-center justify-center rounded border border-[var(--color-muted)] text-[var(--foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-300"
             aria-label="Increase quantity"
           >
             <Plus size={16} />
           </button>
         </div>
       </div>
       <div className="flex items-center gap-4">
         <div className="text-sm md:text-base font-semibold text-[var(--foreground)]">
           {formatCurrency(item.price * item.qty)}
         </div>
         <button
           type="button"
          onClick={handleRemove}
           className="inline-flex h-9 w-9 items-center justify-center rounded border border-[var(--color-muted)] text-[var(--foreground)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors duration-300"
           aria-label="Remove item"
         >
           <Trash2 size={16} />
         </button>
       </div>
     </div>
   )
 }
