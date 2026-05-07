"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Robux } from "@/types/robux"

type Props = {
  pkg: Robux
}

export default function PackageCard({ pkg }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)

  // Logic for best seller is based on package IDs
  const isBestSeller = pkg.id === 5 || pkg.id === 6

  return (
    <div className="group relative rounded-xl border border-[var(--color-muted)] bg-[var(--background)] p-6 shadow-sm transition-transform duration-300 hover:shadow-md hover:scale-[1.01]">
       {isBestSeller && (
         <span className="absolute right-4 top-4 rounded-md bg-[var(--color-primary)] px-2 py-1 text-xs font-semibold text-white">
           Best Seller
         </span>
       )}
       <div className="text-2xl font-bold text-[var(--color-dark)]">{pkg.amount} Robux</div>
       <div className="mt-2 text-lg font-semibold text-[var(--color-primary)]">
         {mounted ? formatIDR(pkg.price) : "..."}
       </div>
       <div className="mt-6">
         <Link
           href={`/robux?robuxId=${pkg.id}&qty=1`}
           className="block w-full rounded-md bg-[var(--color-primary)] px-4 py-2 text-center text-white hover:bg-[var(--color-accent)] transition-transform duration-300 hover:scale-[1.02]"
         >
           Top Up
         </Link>
       </div>
     </div>
   )
}
