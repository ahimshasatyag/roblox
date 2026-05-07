 "use client"
 
 import Input from "@/components/ui/input"
 import Button from "@/components/ui/button"
 
 type Props = {
   coupon: string
   setCoupon: (v: string) => void
   onApply: () => void
   onUpdate: () => void
 }
 
 export default function CouponField({ coupon, setCoupon, onApply, onUpdate }: Props) {
   return (
     <div className="mt-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
         <div className="md:col-span-2">
           <Input
             label="Coupon Code"
             name="coupon"
             placeholder="Masukkan kode kupon"
             value={coupon}
             onChange={e => setCoupon(e.target.value)}
           />
         </div>
         <div className="flex items-end">
           <Button text="Apply" variant="primary" type="button" onClick={onApply} />
         </div>
       </div>
       <div className="mt-3 w-[160px]">
         <Button text="Update Cart" variant="secondary" type="button" onClick={onUpdate} />
       </div>
     </div>
   )
 }
