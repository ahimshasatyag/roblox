"use client"

import { Product } from "@/types/(admin)/products/index"
import { Edit2, Trash2, Package, Maximize2 } from "lucide-react"

interface Props {
    product: Product;
    onItem: (id: number) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

import { API_URL } from "@/config"

export default function ProductCard({ product, onItem, onEdit, onDelete }: Props) {
    const getImageUrl = (url: string | null) => {
        if (!url) return null
        if (url.startsWith("http")) return url
        if (url.startsWith("/uploads")) return `${API_URL}${url}`
        if (url.startsWith("/")) return url
        
        // Handle absolute local paths by extracting the relative public path
        const publicImagesMatch = url.match(/public[\\/]images[\\/](.+)$/)
        if (publicImagesMatch) {
            const relativePath = publicImagesMatch[1].replace(/\\/g, "/")
            return `/images/${relativePath}`
        }

        return `/images/${url}`
    }

    const imageUrl = getImageUrl(product.image_url)

    return (
        <div className="bg-[var(--background)] rounded-[32px] border border-[var(--color-muted)]/10 overflow-hidden group shadow-xl hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 hover:-translate-y-2 transition-all duration-500">
            {/* Image Area */}
            <div className="relative aspect-video bg-[var(--foreground)]/5 overflow-hidden">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--foreground)]/10">
                        <Package size={64} strokeWidth={1} />
                    </div>
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                        onClick={() => onItem(product.id)}
                        className="p-4 bg-[var(--color-primary)] text-white rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                    >
                        <Maximize2 size={20} />
                    </button>
                    <button
                        onClick={() => onEdit(product)}
                        className="p-4 bg-white text-black rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                    >
                        <Edit2 size={20} />
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="p-4 bg-red-500 text-white rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Info Area */}
            <div className="p-8">
                <h3 className="text-xl font-black italic tracking-tighter uppercase text-[var(--foreground)] truncate">
                    {product.name}
                </h3>
            </div>
        </div>
    )
}
