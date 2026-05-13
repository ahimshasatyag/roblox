"use client"

import React, { useState } from "react"
import { ProductItem } from "@/types/productitems/index"
import { X, Gift, LogIn, Send, User, Phone, Mail, Lock, Loader2 } from "lucide-react"
import { productService } from "@/services/productitems/index"
import { useRouter } from "next/navigation"
import { notifySuccess, notifyError } from "@/components/ui/notify"

interface Props {
    item: ProductItem;
    isOpen: boolean;
    onClose: () => void;
    quantity: number;
}

type Method = "gift" | "login"

export default function PurchaseModal({ item, isOpen, onClose, quantity }: Props) {
    const router = useRouter()
    const [method, setMethod] = useState<Method>("gift")
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        phone: "",
        email: ""
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await productService.createOrder({
                id_product_item: item.id,
                quantity: quantity,
                username: formData.username,
                password: method === "login" ? formData.password : undefined,
                phone: formData.phone,
                email: formData.email
            })
            await notifySuccess("Berhasil!", "Pesanan telah dimasukkan ke keranjang.")
            router.push("/cart")
            onClose()
        } catch (err) {
            console.error("Failed to create order:", err)
            notifyError("Gagal!", "Tidak dapat membuat pesanan. Silahkan coba lagi.")
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full bg-[var(--foreground)]/5 border border-[var(--color-muted)]/10 rounded-2xl px-6 py-4 text-sm font-bold text-[var(--foreground)] focus:border-[var(--color-primary)]/50 focus:ring-4 focus:ring-[var(--color-primary)]/5 outline-none transition-all placeholder:text-[var(--foreground)]/20"

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[var(--background)] w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-[var(--color-muted)]/10 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-[var(--color-muted)]/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">Konfirmasi Pesanan</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/30 mt-1">{item.name} x {quantity}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--foreground)]/5 hover:bg-red-500 hover:text-white transition-all group"
                    >
                        <X size={20} className="group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Method Selector */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setMethod("gift")}
                            className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 ${method === "gift"
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-xl shadow-[var(--color-primary)]/10"
                                : "border-[var(--color-muted)]/10 hover:border-[var(--color-primary)]/20"
                                }`}
                        >
                            <Gift size={24} className={method === "gift" ? "text-[var(--color-primary)]" : "text-[var(--foreground)]/30"} />
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${method === "gift" ? "text-[var(--color-primary)]" : "text-[var(--foreground)]/30"}`}>Via Gift</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMethod("login")}
                            className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 ${method === "login"
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-xl shadow-[var(--color-primary)]/10"
                                : "border-[var(--color-muted)]/10 hover:border-[var(--color-primary)]/20"
                                }`}
                        >
                            <LogIn size={24} className={method === "login" ? "text-[var(--color-primary)]" : "text-[var(--foreground)]/30"} />
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${method === "login" ? "text-[var(--color-primary)]" : "text-[var(--foreground)]/30"}`}>Via Login</span>
                        </button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--foreground)]/20 group-focus-within:text-[var(--color-primary)] transition-colors" />
                            <input
                                type="text"
                                placeholder="Roblox Username"
                                required
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                className={`${inputClass} pl-14`}
                            />
                        </div>

                        {method === "login" && (
                            <div className="relative group">
                                <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--foreground)]/20 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Roblox Password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className={`${inputClass} pl-14`}
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--foreground)]/20 group-focus-within:text-[var(--color-primary)] transition-colors" />
                            <input
                                type="tel"
                                placeholder="Nomor WhatsApp"
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className={`${inputClass} pl-14`}
                            />
                        </div>

                        <div className="relative group">
                            <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--foreground)]/20 group-focus-within:text-[var(--color-primary)] transition-colors" />
                            <input
                                type="email"
                                placeholder="Alamat Email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className={`${inputClass} pl-14`}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 bg-[var(--color-primary)] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] flex items-center justify-center gap-3 hover:bg-[var(--color-accent)] transition-all shadow-xl shadow-[var(--color-primary)]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                        {loading ? "Memproses..." : "Masukkan Keranjang"}
                    </button>
                </form>
            </div>
        </div>
    )
}
