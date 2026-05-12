"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, UserPlus, ChevronDown, Eye, EyeOff } from "lucide-react"
import AdminAppLayout from "@/components/layout/(admin)/AppLayout"
import { useUserStore } from "@/stores/(admin)/users/index"
import { useRoles } from "@/features/(admin)/users/useRoles"
import { CreateUserRequest } from "@/types/(admin)/users/index"
import Link from "next/link"

import RoleSelect from "@/components/shared/(admin)/users/RoleSelect"
import FormField from "@/components/shared/(admin)/users/FormField"

export default function AddUserPage() {
    const router = useRouter()
    const { createUser } = useUserStore()
    const { roles } = useRoles()
    
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState<CreateUserRequest>({
        fullname: "",
        username: "",
        email: "",
        password: "",
        role_id: 0,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.role_id === 0) {
            alert("Please select a role")
            return
        }

        setLoading(true)
        try {
            const newUser = await createUser(formData)
            router.push(`/admin/users/edit?id=${newUser.id}&mode=view`)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminAppLayout>
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
                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-[var(--color-primary)]/20">
                                <UserPlus size={40} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black italic tracking-tighter uppercase text-[var(--foreground)] mb-1">Create User</h1>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <FormField label="Full Name">
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullname}
                                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                        className="w-full px-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                                        placeholder="Enter full name..."
                                    />
                                </FormField>

                                <RoleSelect
                                    roles={roles}
                                    selectedRoleId={formData.role_id}
                                    onChange={(id) => setFormData({ ...formData, role_id: id })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <FormField label="Username">
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                                        placeholder="Enter username..."
                                    />
                                </FormField>

                                <FormField label="Password">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30 hover:text-[var(--foreground)] transition-colors p-2"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </FormField>
                            </div>

                            <FormField label="Email">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                                    placeholder="operator@system.io"
                                />
                            </FormField>

                            <div className="pt-10 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-black uppercase tracking-[0.5em] text-[10px] rounded-3xl shadow-2xl shadow-[var(--color-primary)]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminAppLayout>
    )
}
