 "use client"
 
 import Button from "@/components/ui/button"
 import { Product } from "@/features/listProduk/use-list-produk"
 import Image from "next/image"
 
 type Props = {
   product: Product
   onBuy: (id: number) => void
   formatCurrency: (n: number) => string
 }
 
 export default function ProductCard({ product, onBuy, formatCurrency }: Props) {
   return (
    <div className="rounded-lg border border-[var(--color-muted)] bg-[var(--background)] shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md">
       {product.image && (
         <div className="relative w-full rounded-t-lg overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
           <Image
             src={product.image}
             alt={product.title}
             fill
             className="object-cover"
             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
             priority={false}
           />
         </div>
       )}
       <div className="p-5">
        <h3 className="text-lg font-semibold text-[var(--color-title)]">{product.title}</h3>
        <div className="mt-1 flex items-baseline justify-between">
          <p className="text-xs text-[var(--foreground)]/70">Mulai dari</p>
          <div className="text-xl font-bold text-[var(--color-accent)] dark:text-[var(--foreground)]">{formatCurrency(product.basePrice)}</div>
        </div>
       </div>
       <div className="px-5 pb-5">
         <Button text="Beli Sekarang" type="button" variant="primary" onClick={() => onBuy(product.id)} />
       </div>
     </div>
   )
 }
