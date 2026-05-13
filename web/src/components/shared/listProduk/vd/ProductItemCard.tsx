"use client"

import React from "react"
import { ProductItem } from "@/types/productitems/index"
import { ShoppingCart, Zap, Plus, Minus } from "lucide-react"

interface Props {
    item: ProductItem;
    onSelect?: (item: ProductItem, quantity: number) => void;
}

export default function ProductItemCard({ item, onSelect }: Props) {
    const [quantity, setQuantity] = React.useState(1);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="group relative bg-[var(--background)] rounded-[40px] p-8 border border-[var(--color-muted)]/10 hover:border-[var(--color-primary)]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-primary)]/5 overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[var(--color-primary)]/10 transition-colors"></div>
            
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <Zap size={24} />
                    </div>
                    <div className="px-4 py-2 bg-[var(--foreground)]/5 rounded-xl">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Ready Stock</span>
                    </div>
                </div>

                <h3 className="text-xl font-black italic tracking-tighter uppercase text-[var(--foreground)] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {item.name}
                </h3>
                
                <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl font-black italic tracking-tighter text-[var(--foreground)]">
                        {formatPrice(item.price)}
                    </span>

                    <div className="flex items-center bg-[var(--foreground)]/5 rounded-2xl p-1 gap-3">
                        <button 
                            type="button"
                            onClick={() => quantity > 1 && setQuantity(prev => prev - 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[var(--foreground)]/10 transition-colors text-[var(--foreground)]"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="text-sm font-black text-[var(--foreground)] min-w-[1ch] text-center">
                            {quantity}
                        </span>
                        <button 
                            type="button"
                            onClick={() => setQuantity(prev => prev + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[var(--foreground)]/10 transition-colors text-[var(--foreground)]"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                <button 
                    onClick={() => onSelect?.(item, quantity)}
                    className="w-full py-5 bg-[var(--color-primary)] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-[var(--color-accent)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-[var(--color-primary)]/20"
                >
                    <ShoppingCart size={16} />
                    Beli Sekarang
                </button>
            </div>
        </div>
    )
}
