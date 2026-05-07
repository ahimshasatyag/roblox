 "use client"
 
 import Input from "@/components/ui/input"
 import Button from "@/components/ui/button"
 import { Mail, Phone } from "lucide-react"
 
 type Summary = {
   nominal: string
   qty: number
   totalText: string
 }
 
 type Props = {
   email: string
   setEmail: (v: string) => void
   phone: string
   setPhone: (v: string) => void
   onBack: () => void
  onAddToCart: () => void
   canPay: boolean
   summary: Summary
 }
 
 export default function ContactForm({
   email,
   setEmail,
   phone,
   setPhone,
   onBack,
  onAddToCart,
   canPay,
   summary,
 }: Props) {
   return (
     <div className="space-y-6">
       <div className="grid grid-cols-1 gap-4">
         <Input
           type="email"
           label="Email"
           name="email"
           placeholder="Masukkan email aktif"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           icon={<Mail size={18} />}
         />
         <Input
           type="tel"
           label="Nomor HP"
           name="phone"
           placeholder="Masukkan nomor HP"
           value={phone}
           onChange={(e) => setPhone(e.target.value)}
           icon={<Phone size={18} />}
         />
       </div>
       <div className="rounded-lg border border-[var(--color-muted)] p-4 shadow-sm">
         <div className="flex items-center justify-between">
           <div>
             <div className="text-sm text-[var(--foreground)]/70">Nominal Robux</div>
             <div className="text-base font-semibold text-[var(--foreground)]">{summary.nominal}</div>
           </div>
           <div>
             <div className="text-sm text-[var(--foreground)]/70">Jumlah</div>
             <div className="text-base font-semibold text-[var(--foreground)]">{summary.qty}</div>
           </div>
           <div>
             <div className="text-sm text-[var(--foreground)]/70">Total Pembayaran</div>
             <div className="text-xl font-extrabold text-[var(--color-primary)]">{summary.totalText}</div>
           </div>
         </div>
       </div>
       <div className="mt-4 flex items-center justify-between">
         <div className="w-40">
           <Button text="Kembali" type="button" variant="secondary" onClick={onBack} />
         </div>
         <div className="w-48">
           <Button text="Masukkan ke Keranjang" type="button" variant="primary" onClick={onAddToCart} disabled={!canPay} />
         </div>
       </div>
     </div>
   )
 }
