"use client"

import { Plus, ShieldCheck } from "lucide-react"
import AdminAppLayout from "@/components/layout/(admin)/AppLayout"
import RoleTable from "@/components/shared/(admin)/userroles/RoleTable"
import { useRoles } from "@/features/(admin)/userroles/useRoles"
import Link from "next/link"

export default function UserRolesPage() {
    const {
        roles,
        loading,
    } = useRoles()

    return (
        <AdminAppLayout>
            <div className="max-w-7xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">User Roles</h1>
                    <Link
                        href="/admin/userroles/add"
                        className="flex items-center gap-3 bg-[var(--foreground)] text-[var(--background)] px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        Add Role
                    </Link>
                </div>

                {/* Main Table Area */}
                <div className="relative">
                    {loading && (
                        <div className="absolute inset-0 z-10 bg-[var(--background)]/40 backdrop-blur-sm flex items-center justify-center rounded-[30px]">
                            <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <RoleTable
                        roles={roles}
                    />
                </div>
            </div>
        </AdminAppLayout>
    )
}
