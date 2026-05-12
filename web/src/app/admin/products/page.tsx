"use client"

import { useState } from "react"
import { Plus, Tag } from "lucide-react"
import AdminAppLayout from "@/components/layout/(admin)/AppLayout"
import ProductCard from "@/components/shared/(admin)/products/ProductCard"
import ProductDialog from "@/components/shared/(admin)/products/ProductDialog"
import { useProducts } from "@/features/(admin)/products/useProducts"
import { Product, CreateProductRequest } from "@/types/(admin)/products/index"
import { useRouter } from "next/navigation"

export default function ProductsPage() {
    const router = useRouter()
    const { 
        products, 
        loading, 
        createProduct, 
        updateProduct, 
        deleteProduct 
    } = useProducts()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editData, setEditData] = useState<Product | null>(null)

    const handleAdd = () => {
        setEditData(null)
        setIsDialogOpen(true)
    }

    const handleEdit = (item: Product) => {
        setEditData(item)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id)
            } catch (err) {
                alert("Failed to delete product")
            }
        }
    }

    const handleSubmit = async (data: CreateProductRequest) => {
        try {
            if (editData) {
                await updateProduct(editData.id, data)
            } else {
                await createProduct(data)
            }
            setIsDialogOpen(false)
        } catch (err) {
            alert("Operation failed")
        }
    }

    return (
        <AdminAppLayout>
            <div className="max-w-7xl mx-auto pb-20 px-6">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[var(--foreground)] text-[var(--background)] rounded-[20px] flex items-center justify-center shadow-2xl">
                            <Tag size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">Product Catalog</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 mt-1 ml-1">Items & Services</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-3 bg-[var(--foreground)] text-[var(--background)] px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        Add New Product
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="relative">
                    {loading && (
                        <div className="fixed inset-0 z-50 bg-[var(--background)]/40 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onItem={(id) => router.push(`/admin/products/vd?id=${id}`)}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {products.length === 0 && !loading && (
                        <div className="py-40 text-center bg-[var(--foreground)]/2 rounded-[40px] border-2 border-dashed border-[var(--foreground)]/5">
                            <div className="text-[var(--foreground)]/20 font-black uppercase tracking-[0.5em] text-sm">Empty Catalog</div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/10 mt-2">Start by launching your first product</p>
                        </div>
                    )}
                </div>

                <ProductDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSubmit={handleSubmit}
                    editData={editData}
                />
            </div>
        </AdminAppLayout>
    )
}
