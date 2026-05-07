"use client"

import { useSearchParams } from "next/navigation"
import PaymentSuccess from "@/components/shared/(cart)/payment/PaymentSuccess"

export default function PaymentSuccessPage() {
  const search = useSearchParams()
  const method = search.get("method") || "-"
  const amount = search.get("amount") || "Rp 0"
  const account = search.get("account") || "-"
  const invoice = search.get("invoice") || "-"

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="container mx-auto">
        <PaymentSuccess 
          method={method}
          amount={amount}
          account={account}
          invoice={invoice}
        />
      </div>
    </div>
  )
}
