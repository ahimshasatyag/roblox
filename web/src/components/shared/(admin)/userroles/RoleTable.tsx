"use client"

import { UserRole } from "@/types/(admin)/users/index"
import { useRouter } from "next/navigation"

interface Props {
    roles: UserRole[];
}

export default function RoleTable({ roles }: Props) {
    const router = useRouter()
    return (
        <div className="overflow-x-auto rounded-[30px] border border-[var(--color-muted)]/10 bg-[var(--background)] shadow-sm">
            <table className="min-w-full border-separate border-spacing-0">
                <thead>
                    <tr className="bg-[var(--foreground)]/5">
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 border-b border-[var(--color-muted)]/10">Kode Roles (ID)</th>
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 border-b border-[var(--color-muted)]/10">Nama Roles</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-muted)]/5">
                    {roles.map((role) => (
                        <tr 
                            key={role.id} 
                            onClick={() => router.push(`/admin/userroles/edit?id=${role.id}&mode=view`)}
                            className="hover:bg-[var(--foreground)]/2 transition-colors group cursor-pointer"
                        >
                            <td className="px-8 py-6">
                                <div className="font-black text-[var(--foreground)] text-base tracking-tight">{role.id}</div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="text-xs font-bold text-[var(--foreground)]/60 tracking-wider uppercase">{role.role_name}</div>
                            </td>
                        </tr>
                    ))}
                    {roles.length === 0 && (
                        <tr>
                            <td colSpan={2} className="px-8 py-20 text-center">
                                <div className="text-[var(--foreground)]/20 font-black uppercase tracking-[0.3em] text-sm">No roles discovered in the system</div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
