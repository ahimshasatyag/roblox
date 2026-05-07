 "use client"
 
 import SearchProduk from "@/components/shared/listProduk/SearchProduk"
 import ProductCard from "@/components/shared/listProduk/ProductCard"
 import { useListProduk } from "@/features/listProduk/use-list-produk"
 import { useRouter } from "next/navigation"
 
 export default function ListProdukPage() {
   const router = useRouter()
   const { query, setQuery, products, formatCurrency } = useListProduk()
  const handleBuy = (id: number) => {
    router.push(`/cart?product=${id}`)
  }
   return (
     <div className="min-h-screen container mx-auto px-4 py-10">
       <div className="mb-6 flex justify-center">
         <SearchProduk query={query} setQuery={setQuery} />
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {products.map(p => (
           <ProductCard key={p.id} product={p} onBuy={handleBuy} formatCurrency={formatCurrency} />
         ))}
       </div>
     </div>
   )
 }
