"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft } from "lucide-react"
import FormField from "@/components/shared/(admin)/users/FormField"
import DualListbox from "./DualListbox"

interface Props {
    menus: { id_menu: string; nm_menu: string }[];
}

export default function AddRoleForm({ menus }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nm_users_level: "",
        permissions: [] as string[]
    })

    // Prepare permission options based on menus
    // Similar to vformadd.php: Menu {nm_menu} | Read and Menu {nm_menu} | Create/Update/Delete/etc
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Implementation for saving would go here
        console.log("Saving role:", formData)
        setTimeout(() => {
            setLoading(false)
            router.push("/admin/userroles")
        }, 1000)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 gap-6 max-w-md">
                <FormField label="Role Name">
                    <input
                        type="text"
                        required
                        className="w-full bg-[var(--foreground)]/5 border border-[var(--color-muted)]/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                        placeholder="Enter level name..."
                        value={formData.nm_users_level}
                        onChange={(e) => setFormData({ ...formData, nm_users_level: e.target.value })}
                    />
                </FormField>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 ml-4">
                    Permissions
                </label>
                <DualListbox
                    options={permissionOptions}
                    selectedIds={formData.permissions}
                    onChange={(ids) => setFormData({ ...formData, permissions: ids })}
                />
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-3 bg-[var(--foreground)] text-[var(--background)] px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    <Save size={18} />
                    {loading ? "Simpan..." : "Simpan Role"}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-3 bg-[var(--foreground)]/5 text-[var(--foreground)] px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[var(--foreground)]/10 transition-all"
                >
                    <ArrowLeft size={18} />
                    Kembali
                </button>
            </div>
        </form>
    )
}
