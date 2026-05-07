 import { Zap, Wallet, ShieldCheck, Headphones } from "lucide-react"
 
 const items = [
   { icon: Zap, title: "Proses Instan", desc: "Robux masuk otomatis setelah pembayaran." },
   { icon: Wallet, title: "Pembayaran Lengkap", desc: "E-wallet, bank transfer, dan QRIS tersedia." },
   { icon: ShieldCheck, title: "Aman & Terpercaya", desc: "Transaksi terenkripsi dan verifikasi sistem." },
   { icon: Headphones, title: "Support 24/7", desc: "Tim dukungan siap membantu kapan pun." },
 ]
 
 export default function Features() {
   return (
     <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
       <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Keunggulan Layanan</h2>
        <p className="mt-4 text-[var(--foreground)]/70">Alasan memilih layanan kami untuk top up Robux.</p>
       </div>
       <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
         {items.map(({ icon: Icon, title, desc }, i) => (
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
