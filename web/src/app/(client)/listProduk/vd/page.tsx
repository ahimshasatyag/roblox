"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Package, Sparkles } from "lucide-react"
import Link from "next/link"
import { ProductItemProvider, useProductItems } from "@/stores/productitems/index"
import { productService } from "@/services/productitems/index"
import ProductItemCard from "@/components/shared/listProduk/vd/ProductItemCard"
import PurchaseModal from "@/components/shared/listProduk/vd/PurchaseModal"
import { ProductItem } from "@/types/productitems/index"

function ProductItemsContent() {
    const searchParams = useSearchParams()
    const productId = Number(searchParams.get("id"))

    const { items, loading, fetchItems } = useProductItems()
    const [productName, setProductName] = useState<string>("")
    const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null)
    const [selectedQty, setSelectedQty] = useState<number>(1)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (productId) {
            fetchItems(productId)
            productService.getProduct(productId)
                .then(res => setProductName(res.product.name))
                .catch(err => console.error("Failed to fetch product:", err))
        }
    }, [productId, fetchItems])

    if (!productId) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-[40px] flex items-center justify-center text-red-500 shadow-2xl">
                    <Package size={48} />
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic text-[var(--foreground)]">Data Produk Tidak Ditemukan</h2>
                    <p className="text-[10px] font-bold text-[var(--foreground)]/30 uppercase tracking-[0.2em] mt-2">Silahkan pilih produk dari katalog utama</p>
                </div>
                <Link
                    href="/listProduk"
                    className="flex items-center gap-3 bg-[var(--color-primary)] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-[var(--color-primary)]/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <ArrowLeft size={16} />
                    Kembali Ke Katalog
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
                <div className="space-y-4">
                    <Link
                        href="/listProduk"
                        className="inline-flex items-center gap-3 text-[var(--foreground)]/40 hover:text-[var(--color-primary)] transition-colors group mb-4"
                    >
                        <div className="w-10 h-10 bg-[var(--foreground)]/5 rounded-xl flex items-center justify-center group-hover:bg-[var(--color-primary)]/10 transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Kembali</span>
                    </Link>

                    <div className="flex items-center gap-4 text-[var(--color-primary)]">
                        <Sparkles size={20} className="animate-pulse" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Available Items</h2>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-[var(--foreground)] max-w-2xl leading-[0.9]">
                        {productName || "Loading Items..."}
                    </h1>
                </div>
            </div>

            {/* Grid Section */}
            <div className="relative">
                {loading && (
                    <div className="py-40 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/30">Mencari Paket Terbaik...</p>
                    </div>
                )}

                {!loading && items.length === 0 && (
                    <div className="py-40 bg-[var(--foreground)]/2 rounded-[50px] border border-dashed border-[var(--color-muted)]/20 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/20">Maaf, saat ini paket belum tersedia untuk produk ini.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <ProductItemCard
                            key={item.id}
                            item={item}
                            onSelect={(item, qty) => {
                                setSelectedItem(item)
                                setSelectedQty(qty)
                                setIsModalOpen(true)
                            }}
                        />
                    ))}
                </div>
            </div>

            {selectedItem && (
                <PurchaseModal 
                    item={selectedItem}
                    quantity={selectedQty}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
}

export default function ProductItemsPage() {
    return (
        <ProductItemProvider>
            <Suspense fallback={
                <div className="flex items-center justify-center py-40">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            }>
                <ProductItemsContent />
            </Suspense>
        </ProductItemProvider>
    )
}
