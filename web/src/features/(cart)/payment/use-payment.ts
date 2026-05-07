"use client"

import { useEffect, useState } from "react"
import { getPaymentMethods } from "@/services/paymentMethods"
import { getPembayaran } from "@/services/pembayaran"
import type { PaymentMethod as PM } from "@/types/paymentMethods"
import type { Pembayaran as PB } from "@/types/pembayaran"

export type PaymentItem = {
  id: number
  label: string
  desc?: string
  img?: string
  alt?: string
  account?: string
}

export type PaymentGroup = {
  name: string
  items: PaymentItem[]
}

function imgFor(name: string): { img?: string; alt?: string } {
  const n = name.toLowerCase()
  if (n.includes("bca")) return { img: "/images/pembayaran/bca.jpg", alt: "BCA" }
  if (n.includes("mandiri")) return { img: "/images/pembayaran/mandiri.jpg", alt: "Mandiri" }
  if (n.includes("bni")) return { img: "/images/pembayaran/bni.jpg", alt: "BNI" }
  if (n.includes("bri")) return { img: "/images/pembayaran/bri.jpg", alt: "BRI" }
  if (n.includes("shopee")) return { img: "/images/pembayaran/shopeepay.jpg", alt: "ShopeePay" }
  if (n.includes("gopay")) return { img: "/images/pembayaran/gopay.jpg", alt: "GoPay" }
  if (n.includes("qris")) return { img: "/images/pembayaran/qris.jpg", alt: "QRIS" }
  return {}
}

export function usePayment() {
  const [groups, setGroups] = useState<PaymentGroup[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const methods = await getPaymentMethods()
        const results: PaymentGroup[] = []
        for (const m of methods as PM[]) {
          const children = await getPembayaran(m.id)
          const items = (children as PB[]).map((p) => {
            const img = imgFor(p.name)
            return {
              id: p.id,
              label: p.name,
              desc: m.method,
              img: img.img,
              alt: img.alt,
              account: m.account,
            }
          })
          results.push({ name: m.method, items })
        }
        if (mounted) setGroups(results)
      } catch {
        if (mounted) setGroups([])
      }
    })()
    return () => {
      mounted = false
    }
  }, [])
  const select = (id: number) => setSelected(id)
  return {
    groups,
    selected,
    select,
  }
}
