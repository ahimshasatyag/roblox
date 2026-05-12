"use client"

import { useEffect, useState } from "react"
import AdminAppLayout from "@/components/layout/(admin)/AppLayout"
import AddRoleForm from "@/components/shared/(admin)/userroles/AddRoleForm"
import { adminAuthService } from "@/services/(admin)/auth/auth"
import { MenuAdmin } from "@/types/(admin)/auth/index"

export default function AddUserRolePage() {
    const [menus, setMenus] = useState<MenuAdmin[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await adminAuthService.getMenus()
                setMenus(res.menus || [])
            } catch (err) {
                console.error("Failed to fetch menus:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchMenus()
    }, [])

    return (
        <AdminAppLayout>
            <div className="max-w-7xl mx-auto pb-20">
                <div className="mb-12">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-primary)] mb-2">Security Control</h2>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">Add New Role</h1>
                </div>

                <div className="bg-[var(--background)] rounded-[40px] border border-[var(--color-muted)]/10 p-10 shadow-sm relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-accent)]/5 blur-[100px] -ml-32 -mb-32 rounded-full"></div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Synchronizing Permissions...</p>
                        </div>
                    ) : (
                        <AddRoleForm menus={menus} />
                    )}
                </div>
            </div>
        </AdminAppLayout>
    )
}
