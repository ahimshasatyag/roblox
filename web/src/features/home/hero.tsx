import CtaButton from "@/components/shared/home/CtaButton"
 
 export default function Hero() {
   return (
     <section
       className="relative min-h-[60vh] overflow-hidden bg-cover bg-center bg-no-repeat"
       style={{
         backgroundImage:
           "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/images/roblox_background.jpg')",
       }}
     >
       <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
         <div className="mx-auto max-w-3xl text-center">
           <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
             Top Up Robux Resmi & Cepat
           </h1>
           <p className="mt-6 text-lg text-white/80">
             Aman, proses instan, harga terjangkau, dan siap dengan metode pembayaran lengkap.
           </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <CtaButton href="/auth/login" variant="primary">Top Up Sekarang</CtaButton>
            <CtaButton href="#pricing" variant="secondary">Cek Harga</CtaButton>
          </div>
         </div>
       </div>
     </section>
   )
 }
