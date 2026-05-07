 "use client"
 
import { Check } from "lucide-react"
 
 type Props = {
   steps: string[]
   current: number
  className?: string
 }
 
export default function Stepper({ steps, current, className }: Props) {
   const pct = Math.min(Math.max(((current + 1) / steps.length) * 100, 0), 100)
   return (
     <div className="w-full">
      <div className={`relative ${className ?? "mx-auto max-w-3xl"}`}>
         <div className="flex items-center justify-between">
           {steps.map((s, i) => {
             const active = i <= current
             return (
               <div key={s} className="flex-1">
                 <div className="flex items-center gap-3">
                   <div
                     className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 ${
                       active
                         ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                         : "bg-[var(--background)] border-[var(--color-muted)] text-[var(--foreground)]"
                     }`}
                   >
                     {active && i < current ? <Check size={16} /> : i + 1}
                   </div>
                   <div
                     className={`text-sm font-medium transition-colors duration-300 ${
                       active ? "text-[var(--color-primary)]" : "text-[var(--foreground)]"
                     }`}
                   >
                     {s}
                   </div>
                 </div>
               </div>
             )
           })}
         </div>
         <div className="mt-4 h-1 w-full rounded-full bg-[var(--color-muted)]/40">
           <div
             className="h-1 rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
             style={{ width: `${pct}%` }}
           />
         </div>
       </div>
     </div>
   )
 }
