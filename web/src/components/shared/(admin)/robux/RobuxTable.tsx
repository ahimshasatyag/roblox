"use client"

import { Robux } from "@/types/(admin)/robux/index"
import { Edit2, Trash2 } from "lucide-react"

interface Props {
    robuxes: Robux[];
    onEdit: (robux: Robux) => void;
    onDelete: (id: number) => void;
}

export default function RobuxTable({ robuxes, onEdit, onDelete }: Props) {
    return (
        <div className="overflow-x-auto rounded-[30px] border border-[var(--color-muted)]/10 bg-[var(--background)] shadow-sm">
            <table className="min-w-full border-separate border-spacing-0">
                <thead>
                    <tr className="bg-[var(--foreground)]/5">
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 border-b border-[var(--color-muted)]/10">Robux Amount</th>
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 border-b border-[var(--color-muted)]/10">Price</th>
                        <th className="px-8 py-6 text-right text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 border-b border-[var(--color-muted)]/10">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-muted)]/5">
                    {robuxes.map((item) => (
                        <tr key={item.id} className="hover:bg-[var(--foreground)]/2 transition-colors group">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="font-black text-[var(--foreground)] text-lg tracking-tight italic">
                                        {item.robux_amount.toLocaleString()} <span className="text-[10px] uppercase not-italic opacity-40 ml-1">Robux</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="text-sm font-black text-[var(--foreground)]/80 tracking-tight">
                                    Rp {item.price.toLocaleString('id-ID')}
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="p-3 bg-[var(--foreground)]/5 hover:bg-[var(--color-primary)] hover:text-white rounded-xl transition-all text-[var(--foreground)]/50"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="p-3 bg-[var(--foreground)]/5 hover:bg-red-500 hover:text-white rounded-xl transition-all text-[var(--foreground)]/50"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {robuxes.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-8 py-20 text-center">
                                <div className="text-[var(--foreground)]/20 font-black uppercase tracking-[0.3em] text-sm">No robux packages available</div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
