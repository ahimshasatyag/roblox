 "use client"
 
 import Input from "@/components/ui/input"
 import { Search } from "lucide-react"
 
 type Props = {
   query: string
   setQuery: (v: string) => void
 }
 
 export default function SearchProduk({ query, setQuery }: Props) {
   return (
     <div className="mx-auto max-w-2xl">
       <Input
         label=""
         name="search"
         placeholder="Cari produk..."
         value={query}
         onChange={e => setQuery(e.target.value)}
         icon={<Search size={18} />}
       />
     </div>
   )
 }
