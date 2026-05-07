"use client"

import { useEffect, useState } from "react"
import { Robux } from "@/features/robux/use-robux"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { PackageCheck, CircleDollarSign } from "lucide-react"

type Props = {
  items: Robux[]
  selectedId: number | null
  setSelectedId: (id: number) => void
  quantity: number
  setQuantity: (v: number) => void
  total: number
  formatCurrency: (n: number) => string
  onNext: () => void
  canNext: boolean
}

export default function RobuxGrid({
  items,
  selectedId,
  setSelectedId,
  quantity,
  setQuantity,
  total,
  formatCurrency,
  onNext,
  canNext,
}: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((it) => {
          const active = selectedId === it.id
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => setSelectedId(it.id)}
              className={`group rounded-lg border p-4 text-left transition-all duration-300 shadow-sm ${
                active
                  ? "border-[var(--color-primary)] bg-[var(--background)]"
                  : "border-[var(--color-muted)] bg-[var(--background)] hover:border-[var(--color-primary)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`text-2xl font-bold ${active ? "text-[var(--color-primary)]" : "text-[var(--color-dark)]"}`}>
                  {it.robux_amount} Robux
                </div>
                <PackageCheck
                  size={20}
                  className={`${active ? "text-[var(--color-primary)] scale-110" : "text-[var(--color-muted)]"} transition-transform duration-300`}
                />
              </div>
              <div className="mt-2 text-lg font-semibold text-[var(--color-accent)]">
                {mounted ? formatCurrency(it.price) : "..."}
              </div>
            </button>
          )
        })}
      </div>
      <div className="rounded-lg border border-[var(--color-muted)] p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Input
              label="Jumlah Pembelian"
              name="quantity"
              placeholder="Masukkan jumlah"
              value={String(quantity)}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "")
                setQuantity(Math.max(1, Number(v || "1")))
              }}
              icon={<CircleDollarSign size={18} />}
            />
          </div>
          <div className="md:col-span-2 flex items-end justify-between">
            <div>
              <div className="text-sm text-[var(--foreground)]/70">Total harga</div>
              <div className="text-2xl font-extrabold text-[var(--color-primary)]">
                {mounted ? formatCurrency(total) : "..."}
              </div>
            </div>
            <div className="w-40">
              <Button
                text="Lanjut"
                type="button"
                variant="primary"
                disabled={!canNext}
                onClick={onNext}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
