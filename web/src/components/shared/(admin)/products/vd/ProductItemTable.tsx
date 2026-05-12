"use client"

import { ProductItem } from "@/types/(admin)/products/vd/index"
import { Edit2, Trash2, Package } from "lucide-react"

interface Props {
    items: ProductItem[];
    onEdit: (item: ProductItem) => void;
    onDelete: (id: number) => void;
}

export default function ProductItemTable({ items, onEdit, onDelete }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="overflow-x-auto rounded-[30px] border border-[var(--color-muted)]/10 bg-[var(--background)] shadow-sm">
            <table className="min-w-full border-separate border-spacing-0">
                <thead>
                    <tr className="bg-[var(--foreground)]/5">
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 border-b border-[var(--color-muted)]/10 w-16 text-center">#</th>
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 border-b border-[var(--color-muted)]/10">Item Name</th>
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 border-b border-[var(--color-muted)]/10">Price</th>
                        <th className="px-8 py-6 text-right text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 border-b border-[var(--color-muted)]/10">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-muted)]/5">
                    {items.map((item, index) => (
                        <tr 
                            key={item.id} 
                            className="hover:bg-[var(--foreground)]/2 transition-colors group"
                        >
                            <td className="px-8 py-6 text-center">
                                <span className="text-[10px] font-black text-[var(--foreground)]/20 uppercase tracking-widest">{index + 1}</span>
                            </td>
                            <td className="px-8 py-6">
                                <div className="font-black text-[var(--foreground)] text-base tracking-tight">{item.name}</div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="text-sm font-bold text-[var(--color-primary)] tracking-wide">{formatPrice(item.price)}</div>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onEdit(item)}
                                        className="p-3 hover:bg-[var(--foreground)]/5 rounded-2xl text-[var(--foreground)]/40 hover:text-[var(--color-primary)] transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(item.id)}
                                        className="p-3 hover:bg-red-500/5 rounded-2xl text-[var(--foreground)]/40 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-8 py-20 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-[var(--foreground)]/5 rounded-3xl flex items-center justify-center text-[var(--foreground)]/20">
                                        <Package size={32} />
                                    </div>
                                    <div className="text-[var(--foreground)]/20 font-black uppercase tracking-[0.3em] text-xs">Inventory empty for this category</div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
