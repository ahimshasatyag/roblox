"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, UserPlus, Eye, EyeOff, Edit3, Save } from "lucide-react"
import AdminAppLayout from "@/components/layout/(admin)/AppLayout"
import { useUserStore } from "@/stores/(admin)/users/index"
import { useRoles } from "@/features/(admin)/users/useRoles"
import { adminUserService } from "@/services/(admin)/users/index"
import { User, UpdateUserRequest } from "@/types/(admin)/users/index"
import Link from "next/link"
import RoleSelect from "@/components/shared/(admin)/users/RoleSelect"
import FormField from "@/components/shared/(admin)/users/FormField"

function EditUserContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const userId = searchParams.get("id")
    const initialMode = searchParams.get("mode") === "edit"

    const { updateUser } = useUserStore()
    const { roles } = useRoles()
    
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [isEditMode, setIsEditMode] = useState(initialMode)
    const [showPassword, setShowPassword] = useState(false)

    const [userData, setUserData] = useState<User | null>(null)
    const [formData, setFormData] = useState<UpdateUserRequest>({
        fullname: "",
        username: "",
        email: "",
        role_id: 0,
    })

    useEffect(() => {
        if (userId) {
            fetchInitialData()
        }
    }, [userId])

    const fetchInitialData = async () => {
        setFetching(true)
        try {
            const userRes = await adminUserService.getUser(Number(userId))
            
            setUserData(userRes.user)
            setFormData({
                fullname: userRes.user.fullname,
                username: userRes.user.username,
                email: userRes.user.email || "",
                role_id: userRes.user.role_id || 0,
            })
        } catch (err) {
            console.error("Failed to fetch data:", err)
        } finally {
            setFetching(false)
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userId) return

        setLoading(true)
        try {
            await updateUser(Number(userId), formData)
            setIsEditMode(false)
            // Refresh local data
            fetchInitialData()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="text-center py-20">
                <Link href="/admin/users" className="mt-4 text-[var(--color-primary)] font-bold uppercase text-xs tracking-widest">Back</Link>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <Link
                href="/admin/users"
                className="flex items-center gap-2 text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors mb-10 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back</span>
            </Link>

            <div className="bg-[var(--background)] rounded-[50px] p-16 border border-[var(--color-muted)]/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-[var(--color-primary)]/20">
                                <UserPlus size={40} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black italic tracking-tighter uppercase text-[var(--foreground)] mb-1">
                                    {isEditMode ? "Modify Profile" : "User Detail"}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <FormField label="Full Name">
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullname}
                                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                        className="w-full px-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                                        placeholder="Full name..."
                                    />
                                ) : (
                                    <div className="px-8 py-5 bg-[var(--foreground)]/2 rounded-3xl text-[var(--foreground)] font-black text-sm border border-transparent italic">
                                        {userData.fullname}
                                    </div>
                                )}
                            </FormField>

                            {isEditMode ? (
                                <RoleSelect
                                    roles={roles}
                                    selectedRoleId={formData.role_id || 0}
                                    onChange={(id) => setFormData({ ...formData, role_id: id })}
                                />
                            ) : (
                                <FormField label="Roles">
                                    <div className="px-8 py-5 bg-[var(--foreground)]/2 rounded-3xl text-[var(--foreground)]/60 font-black text-sm border border-transparent uppercase tracking-widest">
                                        {roles.find(r => r.id === userData.role_id)?.role_name || "Unassigned"}
                                    </div>
                                </FormField>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <FormField label="Username">
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                                        placeholder="Username..."
                                    />
                                ) : (
                                    <div className="px-8 py-5 bg-[var(--foreground)]/2 rounded-3xl text-[var(--foreground)]/80 font-black text-sm border border-transparent italic">
                                        @{userData.username}
                                    </div>
                                )}
                            </FormField>

                            {isEditMode && (
                                <FormField label="New Password (Optional)">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password || ""}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                                        placeholder="Leave blank to keep current"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30 hover:text-[var(--foreground)] transition-colors p-2"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </FormField>
                            )}
                        </div>

                        <FormField label="Email Address">
                            {isEditMode ? (
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                                    placeholder="email@system.com"
                                />
                            ) : (
                                <div className="px-8 py-5 bg-[var(--foreground)]/2 rounded-3xl text-[var(--foreground)]/70 font-bold text-sm border border-transparent">
                                    {userData.email || "No email assigned"}
                                </div>
                            )}
                        </FormField>

                        {!isEditMode && (
                            <div className="pt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <button
                                    type="button"
                                    onClick={() => setIsEditMode(true)}
                                    className="w-full py-6 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-[0.5em] text-[10px] rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <Edit3 size={16} />
                                    Edit Mode
                                </button>
                            </div>
                        )}

                        {isEditMode && (
                            <div className="pt-10 flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                    {loading ? "Saving Changes..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function EditUserPage() {
    return (
        <AdminAppLayout>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            }>
                <EditUserContent />
            </Suspense>
        </AdminAppLayout>
    )
}
