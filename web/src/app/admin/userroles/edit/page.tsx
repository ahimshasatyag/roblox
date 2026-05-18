"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ShieldCheck, Edit3, Save, Trash2 } from "lucide-react"
import AdminAppLayout from "@/components/layout/(admin)/AppLayout"
import { adminUserRolesService } from "@/services/(admin)/userroles/index"
import { adminAuthService } from "@/services/(admin)/auth/auth"
import { UserRole } from "@/types/(admin)/users/index"
import { MenuAdmin } from "@/types/(admin)/auth/index"
import Link from "next/link"
import FormField from "@/components/shared/(admin)/users/FormField"
import DualListbox from "@/components/shared/(admin)/userroles/DualListbox"

function EditRoleContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const roleId = searchParams.get("id")
    const initialMode = searchParams.get("mode") === "edit"

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [isEditMode, setIsEditMode] = useState(initialMode)
    const [menus, setMenus] = useState<MenuAdmin[]>([])

    const [roleData, setRoleData] = useState<UserRole | null>(null)
    const [formData, setFormData] = useState({
        role_name: "",
        permissions: [] as string[]
    })

    const fetchInitialData = useCallback(async () => {
        if (!roleId) return
        setFetching(true)
        try {
            // Fetch role data
            const roleRes = await adminUserRolesService.getRole(Number(roleId))
            // Fetch menus for permission options
            const menuRes = await adminAuthService.getMenus()

            setRoleData(roleRes.role)
            setMenus(menuRes.menus || [])

            setFormData({
                role_name: roleRes.role.role_name,
                // Assuming roleRes.role has permissions, if not we mock it for now
                permissions: (roleRes.role as any).permissions || []
            })
        } catch (err) {
            console.error("Failed to fetch data:", err)
        } finally {
            setFetching(false)
        }
    }, [roleId])

    useEffect(() => {
        fetchInitialData()
    }, [fetchInitialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!roleId) return

        setLoading(true)
        try {
            await adminUserRolesService.updateRole(Number(roleId), formData)
            setIsEditMode(false)
            fetchInitialData()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!roleId || !confirm("Are you sure you want to delete this role?")) return
        try {
            await adminUserRolesService.deleteRole(Number(roleId))
            router.push("/admin/userroles")
        } catch (err) {
            console.error(err)
        }
    }

    // Prepare permission options based on menus (excluding Dashboard)
    const powerOptions = [
        { id: "1", label: "Read" },
        { id: "2", label: "Create" },
        { id: "3", label: "Update" },
        { id: "4", label: "Delete" },
        { id: "5", label: "Print" }
    ]

    const permissionOptions = menus
        .filter(menu => !menu.nm_menu.toLowerCase().includes("dashboard"))
        .flatMap(menu =>
            powerOptions.map(power => ({
                id: `${menu.id_menu}${power.id}`,
                label: `${menu.nm_menu} | ${power.label}`
            }))
        )

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Fetching role configuration...</p>
            </div>
        )
    }

    if (!roleData) {
        return (
            <div className="text-center py-20">
                <p className="text-[var(--foreground)]/40 font-bold mb-4">Role not found</p>
                <Link href="/admin/userroles" className="text-[var(--color-primary)] font-black uppercase text-[10px] tracking-widest hover:underline">Back to List</Link>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <Link
                href="/admin/userroles"
                className="flex items-center gap-2 text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors mb-10 group inline-flex"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Roles</span>
            </Link>

            <div className="bg-[var(--background)] rounded-[50px] p-12 border border-[var(--color-muted)]/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-primary)]/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-[var(--color-primary)]/20">
                                <ShieldCheck size={40} />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-primary)] mb-1">Role Management</h2>
                                <h1 className="text-4xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">
                                    {isEditMode ? "Edit Role" : "Role Detail"}
                                </h1>
                            </div>
                        </div>

                        {!isEditMode && (
                            <button
                                onClick={handleDelete}
                                className="p-4 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all group"
                                title="Delete Role"
                            >
                                <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="max-w-md">
                            <FormField label="Nama Level">
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        required
                                        value={formData.role_name}
                                        onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                                        className="w-full px-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                                        placeholder="Level name..."
                                    />
                                ) : (
                                    <div className="px-8 py-5 bg-[var(--foreground)]/2 rounded-3xl text-[var(--foreground)] font-black text-sm border border-transparent italic">
                                        {roleData.role_name}
                                    </div>
                                )}
                            </FormField>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 ml-4">
                                Wewenang (Permissions)
                            </label>
                            {isEditMode ? (
                                <DualListbox
                                    options={permissionOptions}
                                    selectedIds={formData.permissions}
                                    onChange={(ids) => setFormData({ ...formData, permissions: ids })}
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {formData.permissions.length > 0 ? (
                                        formData.permissions.map(pid => {
                                            const opt = permissionOptions.find(o => o.id === pid)
                                            return (
                                                <div key={pid} className="px-5 py-3 bg-[var(--foreground)]/5 rounded-2xl text-[var(--foreground)]/60 font-bold text-[10px] uppercase tracking-wider border border-[var(--color-muted)]/5 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></div>
                                                    {opt ? opt.label : pid}
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="col-span-full py-10 bg-[var(--foreground)]/2 rounded-3xl border border-dashed border-[var(--color-muted)]/20 text-center text-[var(--foreground)]/20 text-[10px] font-black uppercase tracking-widest">
                                            No permissions assigned to this role
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="pt-6">
                            {!isEditMode ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditMode(true)}
                                    className="w-full py-6 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-[0.5em] text-[10px] rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <Edit3 size={16} />
                                    Edit
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditMode(false)}
                                        className="flex-1 py-6 bg-[var(--foreground)]/5 text-[var(--foreground)]/40 text-center font-black uppercase tracking-[0.4em] text-[10px] rounded-3xl hover:bg-[var(--foreground)]/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] py-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-black uppercase tracking-[0.5em] text-[10px] rounded-3xl shadow-2xl shadow-[var(--color-primary)]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        <Save size={16} />
                                        {loading ? "Saving Changes..." : "Save Role Configuration"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function EditUserRolePage() {
    return (
        <AdminAppLayout>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            }>
                <EditRoleContent />
            </Suspense>
        </AdminAppLayout>
    )
}
