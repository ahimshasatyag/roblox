"use client"

import { useEffect, useState } from "react"
import { Search, CheckCircle2, Clock, Copy, CreditCard, ExternalLink } from "lucide-react"
import { applyTheme, themeColors } from "@/helper/theme"
import { Button, Input, Modal, Badge } from "@/components/ui"
import { notifySuccess } from "@/components/ui/notify"
import OrdersTable from "@/components/shared/pesanan/OrdersTable"
import { usePesanan } from "@/features/pesanan/use-pesanan"
import type { Order, OrderDTO } from "@/types/orders"
import { mapDTOToOrder } from "@/types/orders"
import { http } from "@/lib/http"
import { useAuthToken } from "@/hooks/use-auth"
import PesananSkeleton from "@/components/skeleton/(client)/pesanan/page"
import TableSkeleton from "@/components/skeleton/(client)/pesanan/table"

function CountdownTimer({ createdAt, onExpire }: { createdAt: string; onExpire: () => void }) {
  const [timeLeft, setTimeLeft] = useState<string>("")

  useEffect(() => {
    const deadline = new Date(createdAt).getTime() + 24 * 60 * 60 * 1000

    const update = () => {
      const now = new Date().getTime()
      const distance = deadline - now

      if (distance < 0) {
        setTimeLeft("00:00:00")
        onExpire()
        return false
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      )
      return true
    }

    const hasTime = update()
    if (!hasTime) return

    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [createdAt, onExpire])

  return <span className="font-mono text-lg font-bold text-[var(--color-accent)]">{timeLeft}</span>
}

export default function PesananPage() {
  const token = useAuthToken()
  const { query, setQuery, loading, error, results, searched, search, formatCurrency, statusText, statusVariant, hasResults } =
    usePesanan()

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false)
  const [orderItems, setOrderItems] = useState<Order[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)

  const handleShowItems = async () => {
    if (!selectedOrder) return

    // Use orderHeaderId if exists (finalized), otherwise use id (draft)
    // But since this is for finalized orders in the modal, we use orderHeaderId
    const headerId = selectedOrder.orderHeaderId
    if (!headerId) return

    setItemsLoading(true)
    setIsItemsModalOpen(true)
    try {
      const res = await http<{ items: OrderDTO[] }>(`/client/orders/header/${headerId}/items`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      setOrderItems(res.items.map(mapDTOToOrder))
    } catch (e) {
      console.error("Failed to fetch items:", e)
    } finally {
      setItemsLoading(false)
    }
  }

  useEffect(() => {
    applyTheme(themeColors)
  }, [])

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    notifySuccess("Tersalin", "Nomor akun telah disalin ke clipboard")
  }

  if (loading && !searched) {
    return <PesananSkeleton />
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] text-center">Lacak Pesanan</h1>

      <div className="mt-8 mx-auto max-w-4xl">
        <div className="rounded-md border border-[var(--color-muted)] p-4 bg-[var(--background)]">
          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
            <Input
              label="Nomor Invoice"
              name="invoice"
              placeholder="Masukkan Nomor Invoice..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={<Search size={18} />}
            />
            <div className="mb-4 w-28 md:w-40">
              <Button text="Cari" type="button" variant="primary" onClick={search} disabled={loading} />
            </div>
          </div>
          {error && <div className="mt-3 text-sm text-[var(--color-accent)]">{error}</div>}
        </div>
      </div>

      <div className="mt-8">
        {!token ? (
          <div className="mx-auto max-w-4xl rounded-md border border-[var(--color-muted)] p-10 text-center bg-[var(--background)] shadow-sm">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Silakan Login Terlebih Dahulu</h2>
            <p className="text-[var(--foreground)]/60 mb-6">Anda harus masuk ke akun Anda untuk melihat riwayat pesanan.</p>
            <div className="max-w-xs mx-auto">
              <Button text="Login Sekarang" onClick={() => window.location.href = "/auth/login"} />
            </div>
          </div>
        ) : loading ? (
          <TableSkeleton />
        ) : searched && !hasResults ? (
          <div className="mx-auto max-w-4xl rounded-md border border-[var(--color-muted)] p-6 text-center text-[var(--foreground)]/70">
            Pesanan tidak ditemukan. Periksa kembali nomor invoice Anda.
          </div>
        ) : hasResults ? (
          <OrdersTable
            orders={results.filter(o => o.status === "belum_bayar")}
            formatCurrency={formatCurrency}
            statusText={statusText}
            statusVariant={statusVariant}
            onViewDetail={handleViewDetail}
          />
        ) : null}
      </div>

      {/* Detail Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detail Pesanan"
        maxWidth="max-w-xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center pb-4 border-b border-[var(--color-muted)]">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full mb-4 ${selectedOrder.status === "success" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                }`}>
                {selectedOrder.status === "success" ? <CheckCircle2 size={32} /> : <Clock size={32} />}
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">{selectedOrder.name}</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-[var(--foreground)]/60">Status:</span>
                <Badge text={statusText(selectedOrder.status)} color={statusVariant(selectedOrder.status)} />
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider">No. Invoice</div>
                <div className="text-base font-mono font-bold text-[var(--color-primary)]">
                  {selectedOrder.header?.invoiceNumber || selectedOrder.invoice || "-"}
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider">Total Bayar</div>
                <div className="text-base font-bold text-[var(--foreground)]">
                  {formatCurrency(selectedOrder.header?.total ?? selectedOrder.total)}
                </div>
              </div>
            </div>

            {selectedOrder.status === "belum_bayar" && (
              <div className="space-y-4 rounded-lg bg-[var(--foreground)]/5 p-4 border border-[var(--color-muted)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider">Metode Pembayaran</div>
                    <div className="text-sm font-semibold text-[var(--foreground)]">{selectedOrder.paymentMethod || "Menunggu..."}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider">Batas Waktu</div>
                    <div className="text-sm font-semibold text-orange-500">
                      {selectedOrder.headerDate ? (
                        <CountdownTimer
                          createdAt={selectedOrder.headerDate}
                          onExpire={() => setSelectedOrder(prev => prev ? { ...prev, status: "gagal" } : null)}
                        />
                      ) : "24 Jam"}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider mb-2">Kirim Ke Nomor / Akun</div>
                  <div className="flex items-center justify-between rounded-md bg-[var(--background)] p-3 border border-[var(--color-muted)]">
                    <div className="flex items-center gap-3">
                      <CreditCard size={18} className="text-[var(--foreground)]/40" />
                      <span className="text-base font-mono font-bold text-[var(--foreground)]">{selectedOrder.paymentAccount || "-"}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedOrder.paymentAccount || "")}
                      className="p-1.5 hover:bg-[var(--foreground)]/5 rounded-full transition-colors text-[var(--color-primary)]"
                      title="Salin"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 space-y-3">
              <Button
                text={itemsLoading ? "Memuat..." : "Lihat Detail Halaman"}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleShowItems}
                disabled={itemsLoading || !selectedOrder.orderHeaderId}
              >
                {!itemsLoading && <ExternalLink size={16} />}
              </Button>
            </div>

            <p className="text-center text-xs text-[var(--foreground)]/40">
              ID Pesanan: {selectedOrder.id} • Dibuat pada: {selectedOrder.headerDate ? new Date(selectedOrder.headerDate).toLocaleString("id-ID") : selectedOrder.date ? new Date(selectedOrder.date).toLocaleString("id-ID") : "-"}
            </p>
          </div>
        )}
      </Modal>

      {/* Items Detail Modal */}
      <Modal
        isOpen={isItemsModalOpen}
        onClose={() => setIsItemsModalOpen(false)}
        title="Daftar Item Pesanan"
        maxWidth="max-w-3xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-muted)] text-[var(--foreground)]/50 text-xs uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Robux</th>
                <th className="py-3 px-4 font-semibold text-right">Harga</th>
                <th className="py-3 px-4 font-semibold text-center">Qty</th>
                <th className="py-3 px-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-muted)]">
              {orderItems.length > 0 ? (
                orderItems.map((item) => (
                  <tr key={item.id} className="text-sm text-[var(--foreground)]">
                    <td className="py-4 px-4 font-medium">{item.name}</td>
                    <td className="py-4 px-4 text-right font-mono">{formatCurrency(item.total / (item.qty || 1))}</td>
                    <td className="py-4 px-4 text-center">{item.qty}</td>
                    <td className="py-4 px-4 text-right font-bold text-[var(--color-primary)]">{formatCurrency(item.total)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[var(--foreground)]/50 italic">
                    {itemsLoading ? "Memuat item..." : "Tidak ada detail item."}
                  </td>
                </tr>
              )}
            </tbody>
            {orderItems.length > 0 && (
              <tfoot>
                <tr className="bg-[var(--foreground)]/5 font-bold">
                  <td colSpan={3} className="py-4 px-4 text-right uppercase text-xs tracking-widest text-[var(--foreground)]/50">Sub Total</td>
                  <td className="py-4 px-4 text-right text-lg text-[var(--color-primary)]">
                    {formatCurrency(orderItems.reduce((acc, curr) => acc + curr.total, 0))}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Modal>
    </div>
  )
}
