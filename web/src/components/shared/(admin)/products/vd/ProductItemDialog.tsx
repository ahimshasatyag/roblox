"use client"

import { useState, useEffect } from "react"
import { ProductItem, CreateProductItemRequest } from "@/types/(admin)/products/vd/index"
import { X, Save, Tag, DollarSign } from "lucide-react"

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    editData: ProductItem | null;
    productId: number;
}

export default function ProductItemDialog({ isOpen, onClose, onSubmit, editData, productId }: Props) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<CreateProductItemRequest>>({
        name: "",
        price: 0,
        id_product: productId,
    })

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name,
                price: editData.price,
                id_product: editData.id_product,
            })
        } else {
            setFormData({
                name: "",
                price: 0,
                id_product: productId,
            })
        }
    }, [editData, isOpen, productId])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSubmit({ ...formData, id_product: productId })
            onClose()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[var(--background)] w-full max-w-lg rounded-[40px] shadow-2xl border border-[var(--color-muted)]/10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <div className="p-10 flex items-center justify-between border-b border-[var(--color-muted)]/5 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/20">
                            <Tag size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">
                                {editData ? "Modify Item" : "New Item"}
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/30">Inventory Management</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-[var(--foreground)]/5 rounded-2xl transition-colors">
                        <X size={20} className="text-[var(--foreground)]/40" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Name Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 ml-4">Item Name</label>
                        <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--foreground)]/20">
                                <Tag size={18} />
                            </div>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-16 pr-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                                placeholder="e.g. 1000 Robux Package"
                            />
                        </div>
                    </div>

                    {/* Price Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 ml-4">Item Price</label>
                        <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--foreground)]/20">
                                <DollarSign size={18} />
                            </div>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full pl-16 pr-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 bg-[var(--foreground)]/5 text-[var(--foreground)]/40 font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl hover:bg-[var(--foreground)]/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <Save size={16} />
                            {loading ? "Saving..." : editData ? "Update Item" : "Create Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
