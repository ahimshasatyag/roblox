 "use client"
 
 import { ReactNode } from "react"
 
 type Props = {
   label: string
   description?: string
   selected?: boolean
   onClick?: () => void
   icon?: ReactNode
 }
 
 export default function PaymentMethodCard({ label, description, selected, onClick, icon }: Props) {
   const base =
    "flex items-center gap-3 rounded-lg border p-4 shadow-sm transition-colors duration-300 cursor-pointer select-none w-full"
   const colors = selected
     ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
     : "border-[var(--color-muted)] hover:border-[var(--color-primary)]"
   return (
     <div className={`${base} ${colors}`} onClick={onClick} role="button" aria-pressed={selected} tabIndex={0}>
      <div className="flex h-12 w-12 aspect-square flex-shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
         {icon}
       </div>
       <div className="flex-1">
         <div className="text-sm md:text-base font-semibold text-[var(--foreground)]">{label}</div>
         {description && <div className="text-xs text-[var(--foreground)]/60 mt-0.5">{description}</div>}
       </div>
       <div
          className={`h-4 w-4 md:h-5 md:w-5 aspect-square flex-shrink-0 rounded-full border ${
           selected ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-muted)]"
         }`}
       />
     </div>
   )
 }
