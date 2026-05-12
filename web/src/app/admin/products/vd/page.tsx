"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Package, ArrowLeft } from "lucide-react"
import Link from "next/link"
import AdminAppLayout from "@/components/layout/(admin)/AppLayout"
import ProductItemTable from "@/components/shared/(admin)/products/vd/ProductItemTable"
import ProductItemDialog from "@/components/shared/(admin)/products/vd/ProductItemDialog"
import { ProductItemProvider, useProductItems } from "@/stores/(admin)/products/vd/index"
import { ProductItem } from "@/types/(admin)/products/vd/index"
import { adminProductService } from "@/services/(admin)/products/index"

function ProductItemsContent() {
    const searchParams = useSearchParams()
    const productId = Number(searchParams.get("id"))
    
    const { items, loading, fetchItems, addItem, updateItem, removeItem } = useProductItems()
    const [productName, setProductName] = useState<string>("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editData, setEditData] = useState<ProductItem | null>(null)

    useEffect(() => {
        if (productId) {
            fetchItems(productId)
            
            // Fetch product name
            adminProductService.getProduct(productId)
                .then(res => setProductName(res.product.name))
                .catch(err => console.error("Failed to fetch product:", err))
        }
    }, [productId, fetchItems])

    const handleAdd = () => {
        setEditData(null)
        setIsDialogOpen(true)
    }

    const handleEdit = (item: ProductItem) => {
        setEditData(item)
        setIsDialogOpen(true)
    }

    const handleSubmit = async (data: any) => {
        if (editData) {
            await updateItem(editData.id, data)
        } else {
            await addItem(data)
        }
    }

    if (!productId) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-[30px] flex items-center justify-center text-red-500">
                    <Package size={40} />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[var(--foreground)]">Product ID Missing</h2>
                    <p className="text-[10px] font-bold text-[var(--foreground)]/30 uppercase tracking-[0.2em] mt-2">Please navigate from the product catalog</p>
                </div>
                <Link 
                    href="/admin/products"
                    className="flex items-center gap-3 bg-[var(--foreground)] text-[var(--background)] px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                    <ArrowLeft size={16} />
                    Back to Catalog
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-6">
                    <Link 
                        href="/admin/products"
                        className="w-12 h-12 bg-[var(--foreground)]/5 rounded-2xl flex items-center justify-center text-[var(--foreground)]/40 hover:bg-[var(--foreground)]/10 hover:text-[var(--foreground)] transition-all"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">Inventory Items</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/30 mt-1">{productName}</p>
                    </div>
                </div>
                
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-3 bg-[var(--foreground)] text-[var(--background)] px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    Add New Item
                </button>
            </div>

            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-[var(--background)]/40 backdrop-blur-sm flex items-center justify-center rounded-[30px]">
                        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                <ProductItemTable
                    items={items}
                    onEdit={handleEdit}
                    onDelete={removeItem}
                />
            </div>

            <ProductItemDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
                editData={editData}
                productId={productId}
            />
        </div>
    )
}

export default function ProductItemsPage() {
    return (
        <AdminAppLayout>
            <ProductItemProvider>
                <Suspense fallback={
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                }>
                    <ProductItemsContent />
                </Suspense>
            </ProductItemProvider>
        </AdminAppLayout>
    )
}
