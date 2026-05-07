"use client"

import Image from "next/image"
import { PaymentMethodCard } from "@/components/ui"
import type { PaymentGroup } from "@/features/(cart)/payment/use-payment"

type Props = {
  groups: PaymentGroup[]
  selected?: number | null
  onSelect: (id: number) => void
}

export default function PaymentOptions({ groups, selected, onSelect }: Props) {
  return (
    <div className="space-y-6">
      {groups.map(group => (
        <div key={group.name}>
          <div className="mb-2 text-sm font-semibold text-[var(--foreground)]">{group.name}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {group.items.map(it => (
              <PaymentMethodCard
                key={it.id}
                label={it.label}
                description={it.desc || ""}
                selected={selected === it.id}
                onClick={() => onSelect(it.id)}
                icon={
                  it.img ? (
                    <Image src={it.img} alt={it.alt || it.label} width={36} height={36} className="rounded object-contain aspect-square" />
                  ) : undefined
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
