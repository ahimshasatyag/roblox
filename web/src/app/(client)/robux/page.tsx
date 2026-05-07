 "use client"
 
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { applyTheme, themeColors } from "@/helper/theme"
 import FormCard from "@/components/ui/form-card"
 import { Stepper } from "@/components/ui"
import { notifyError, notifySuccess, confirmLoginRequired } from "@/components/ui"
import { useAuthToken } from "@/hooks/use-auth"
 import { useRobux } from "@/features/robux/use-robux"
 import RobuxGrid from "@/components/shared/robux/RobuxGrid"
 import AccountForm from "@/components/shared/robux/AccountForm"
 import ContactForm from "@/components/shared/robux/ContactForm"
 
 export default function RobuxPage() {
  const router = useRouter()
  const token = useAuthToken()
   const {
     step,
     steps,
     items,
     loading,
     error,
     selectedId,
     setSelectedId,
     quantity,
     setQuantity,
     selected,
     total,
     username,
     setUsername,
     password,
     setPassword,
     email,
     setEmail,
     phone,
     setPhone,
     canNextFromStep1,
     canNextFromStep2,
    canAddToCart,
     formatCurrency,
     next,
     back,
    addToCart,
   } = useRobux()
 
   useEffect(() => {
     applyTheme(themeColors)
   }, [])
 
   const summary = {
     nominal: selected ? `${selected.robux_amount} Robux` : "-",
     qty: quantity,
     totalText: formatCurrency(total),
   }
 
   return (
    <div className="min-h-screen container mx-auto px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Stepper steps={[...steps]} current={step} className="mx-auto max-w-5xl px-2" />
       </div>
       <div className="mt-8 flex justify-center">
        <FormCard className="max-w-5xl">
           <div className={`transition-all duration-300 ${step === 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 hidden"}`}>
             {loading ? (
               <div className="py-6 text-center text-[var(--foreground)]/70">Memuat data...</div>
             ) : error ? (
               <div className="py-6 text-center text-[var(--color-accent)]">{error}</div>
             ) : (
               <RobuxGrid
                 items={items}
                 selectedId={selectedId}
                 setSelectedId={setSelectedId}
                 quantity={quantity}
                 setQuantity={(v) => setQuantity(v)}
                 total={total}
                 formatCurrency={formatCurrency}
                 onNext={() => {
                   if (canNextFromStep1) next()
                 }}
                 canNext={canNextFromStep1}
               />
             )}
           </div>
           <div className={`transition-all duration-300 ${step === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 hidden"}`}>
             <AccountForm
               username={username}
               setUsername={setUsername}
               password={password}
               setPassword={setPassword}
               onBack={back}
               onNext={() => {
                 if (canNextFromStep2) next()
               }}
               canNext={canNextFromStep2}
             />
           </div>
           <div className={`transition-all duration-300 ${step === 2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 hidden"}`}>
             <ContactForm
               email={email}
               setEmail={setEmail}
               phone={phone}
               setPhone={setPhone}
               onBack={back}
            onAddToCart={async () => {
              if (!canAddToCart || !selected) return
              if (!token) {
                const r = await confirmLoginRequired()
                if (r.isConfirmed) router.push("/auth/login")
                return
              }
              let createdOrder: { id: number } | null = null
              try {
                const order = await addToCart()
                createdOrder = { id: order.id }
                await notifySuccess("Berhasil", "Pesanan ditambahkan ke keranjang")
              } catch (e) {
                const msg = e instanceof Error ? e.message : "error"
                await notifyError("Gagal", msg)
                return
              }
               const params = new URLSearchParams()
               params.set("robuxId", String(selected.id))
               params.set("qty", String(quantity))
               if (createdOrder) params.set("orderId", String(createdOrder.id))
               router.push(`/cart?${params.toString()}`)
             }}
              canPay={canAddToCart}
               summary={summary}
             />
           </div>
         </FormCard>
       </div>
     </div>
   )
 }
