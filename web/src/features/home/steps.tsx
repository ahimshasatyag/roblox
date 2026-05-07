 import { UserRound, Package, CreditCard } from "lucide-react"
 
 const steps = [
   { icon: UserRound, title: "Masukkan User ID", desc: "Isi User ID Roblox Anda dengan benar." },
   { icon: Package, title: "Pilih Paket Robux", desc: "Tentukan paket sesuai kebutuhan." },
   { icon: CreditCard, title: "Bayar & Robux Masuk", desc: "Selesaikan pembayaran, Robux masuk otomatis." },
 ]
 
 export default function Steps() {
   return (
     <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
       <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Cara Top Up</h2>
        <p className="mt-4 text-[var(--foreground)]/70">Tiga langkah sederhana untuk mendapatkan Robux.</p>
       </div>
       <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
         {steps.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-muted)] bg-[var(--background)] p-6 shadow-sm transition-transform duration-300 hover:shadow-md hover:scale-[1.01]"
          >
             <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
               <Icon size={20} />
             </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
            <p className="mt-2 text-sm text-[var(--foreground)]/70">{desc}</p>
           </div>
         ))}
       </div>
     </section>
   )
 }
