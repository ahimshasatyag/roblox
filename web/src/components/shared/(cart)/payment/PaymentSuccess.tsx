"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Clock, Copy, CreditCard } from "lucide-react"
import { Button, FormCard } from "@/components/ui"
import { notifySuccess } from "@/components/ui/notify"

type Props = {
  method: string
  amount: string
  account: string
  invoice: string
}

export default function PaymentSuccess({ method, amount, account, invoice }: Props) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60) // 24 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}j ${m}m ${s}d`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    notifySuccess("Tersalin", "Nomor akun telah disalin ke clipboard")
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-[var(--foreground)]">Pesanan Berhasil Dibuat</h1>
        <p className="mt-2 text-[var(--foreground)]/60">Selesaikan pembayaran Anda segera.</p>
      </div>

      <FormCard className="w-full max-w-xl">
        <div className="space-y-6">
          <div className="rounded-lg bg-[var(--background)] p-4 border border-[var(--color-muted)]">
            <div className="flex items-center gap-3 text-[var(--foreground)]/70 text-sm mb-4">
              <Clock size={16} className="text-[var(--color-primary)]" />
              Selesaikan pembayaran dalam waktu
            </div>
            <div className="text-3xl font-bold text-center text-[var(--color-primary)] tracking-wider">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider">No. Invoice</div>
              <div className="text-lg font-mono font-bold text-[var(--color-primary)]">{invoice}</div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider">Metode Pembayaran</div>
              <div className="text-lg font-semibold text-[var(--foreground)]">{method}</div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-muted)]">
            <div className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider mb-2">Kirim Ke Nomor / Akun</div>
            <div className="flex items-center justify-between rounded-md bg-[var(--background)] p-3 border border-[var(--color-muted)]">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-[var(--foreground)]/40" />
                <span className="text-lg font-mono font-bold text-[var(--foreground)]">{account}</span>
              </div>
              <button 
                onClick={() => copyToClipboard(account)}
                className="p-2 hover:bg-[var(--foreground)]/5 rounded-full transition-colors text-[var(--color-primary)]"
                title="Salin"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              text="Cek Status Pesanan" 
              variant="primary" 
              className="w-full"
              onClick={() => window.location.href = "/pesanan"} 
            />
            <Button 
              text="Kembali ke Beranda" 
              variant="secondary" 
              className="w-full"
              onClick={() => router.push("/")} 
            />
          </div>
        </div>
      </FormCard>

      <div className="text-center text-sm text-[var(--foreground)]/50 max-w-md">
        Pastikan Anda mengirim nominal yang tepat untuk mempercepat proses verifikasi otomatis kami.
      </div>
    </div>
  )
}
