"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui"
import type { Order } from "@/types/orders"

type Props = {
  orders: Order[]
  formatCurrency: (n: number) => string
  statusText: (s: Order["status"]) => string
  statusVariant: (s: Order["status"]) => "gray" | "red" | "green"
  onViewDetail?: (order: Order) => void
}

export default function OrdersTable({ orders, formatCurrency, statusText, statusVariant, onViewDetail }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="overflow-x-auto rounded-md border border-[var(--color-muted)]">
      <table className="min-w-full border-collapse">
        <thead className="bg-[var(--background)]">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--foreground)]/80 border-b border-[var(--color-muted)]">No</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--foreground)]/80 border-b border-[var(--color-muted)]">Invoice</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--foreground)]/80 border-b border-[var(--color-muted)]">Total</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--foreground)]/80 border-b border-[var(--color-muted)]">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, index) => (
            <tr key={o.id} className="even:bg-[var(--background)]/40">
              <td className="px-4 py-3 text-sm text-[var(--foreground)] border-b border-[var(--color-muted)]">
                <button 
                  onClick={() => onViewDetail?.(o)}
                  className="text-[var(--color-primary)] hover:underline font-medium"
                >
                  {index + 1}
                </button>
              </td>
              <td className="px-4 py-3 text-sm text-[var(--foreground)] border-b border-[var(--color-muted)]">
                {o.invoice || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-[var(--foreground)] border-b border-[var(--color-muted)]">
                {mounted ? formatCurrency(o.total) : "..."}
              </td>
              <td className="px-4 py-3 text-sm text-[var(--foreground)] border-b border-[var(--color-muted)]">
                <Badge text={statusText(o.status)} color={statusVariant(o.status)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
