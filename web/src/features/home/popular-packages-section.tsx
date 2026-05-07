"use client"

import { useEffect, useState } from "react"
import PackageCard from "@/components/shared/home/PackageCard"
import { getRobuxes } from "@/services/robux"
import type { Robux } from "@/types/robux"

export default function PopularPackages() {
  const [robuxes, setRobuxes] = useState<Robux[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPackages() {
      try {
        const data = await getRobuxes()
        // Display only specific IDs requested: 1, 2, 3, 4, 5, 6
        const filtered = data.filter(p => p.id >= 1 && p.id <= 6)
        setRobuxes(filtered)
      } catch (error) {
        console.error("Failed to fetch robux packages:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  if (loading) {
    return (
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Paket Populer</h2>
        <p className="mt-4 text-[var(--foreground)]/70">Pilihan terbaik dan paling diminati.</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {robuxes.map((p) => (
          <PackageCard key={p.id} pkg={p} />
        ))}
      </div>
    </section>
  )
}
