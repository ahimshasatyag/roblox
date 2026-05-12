"use client"

import { useState } from "react"
import { Plus, Box } from "lucide-react"
import AdminAppLayout from "@/components/layout/(admin)/AppLayout"
import RobuxTable from "@/components/shared/(admin)/robux/RobuxTable"
import RobuxDialog from "@/components/shared/(admin)/robux/RobuxDialog"
import { useRobux } from "@/features/(admin)/robux/useRobux"
import { Robux, CreateRobuxRequest } from "@/types/(admin)/robux/index"

export default function RobuxPage() {
    const {
        robuxes,
        loading,
        createRobux,
        updateRobux,
        deleteRobux
    } = useRobux()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editData, setEditData] = useState<Robux | null>(null)

    const handleAdd = () => {
        setEditData(null)
        setIsDialogOpen(true)
    }

    const handleEdit = (item: Robux) => {
        setEditData(item)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this package?")) {
            try {
                await deleteRobux(id)
            } catch (err) {
                alert("Failed to delete package")
            }
        }
    }

    const handleSubmit = async (data: CreateRobuxRequest) => {
        try {
            if (editData) {
                await updateRobux(editData.id, data)
            } else {
                await createRobux(data)
            }
            setIsDialogOpen(false)
        } catch (err) {
            alert("Operation failed")
        }
    }

    return (
        <AdminAppLayout>
            <div className="max-w-7xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">Robux</h1>

                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-3 bg-[var(--foreground)] text-[var(--background)] px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        Create New Package
                    </button>
                </div>

                {/* Main Table Area */}
                <div className="relative">
                    {loading && (
                        <div className="absolute inset-0 z-10 bg-[var(--background)]/40 backdrop-blur-sm flex items-center justify-center rounded-[30px]">
                            <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <RobuxTable
                        robuxes={robuxes}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                <RobuxDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSubmit={handleSubmit}
                    editData={editData}
                />
            </div>
        </AdminAppLayout>
    )
}
