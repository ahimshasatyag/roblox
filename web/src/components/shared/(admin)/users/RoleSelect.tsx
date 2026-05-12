"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { UserRole } from "@/types/(admin)/users/index"

interface RoleSelectProps {
    roles: UserRole[];
    selectedRoleId: number;
    onChange: (roleId: number) => void;
    label?: string;
    placeholder?: string;
}

export default function RoleSelect({ 
    roles, 
    selectedRoleId, 
    onChange, 
    label = "Roles", 
    placeholder = "Select Roles" 
}: RoleSelectProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredRoles = roles.filter(role =>
        role.role_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const selectedRole = roles.find(r => r.id === selectedRoleId)

    return (
        <div className="space-y-3">
            {label && <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 ml-4">{label}</label>}
            <div className="relative">
                <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`
                        w-full px-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl font-bold cursor-pointer flex items-center justify-between transition-all hover:bg-[var(--foreground)]/10 group shadow-inner
                        ${!selectedRole ? "text-[var(--foreground)]/30" : "text-[var(--foreground)]"}
                    `}
                >
                    <span>
                        {selectedRole ? selectedRole.role_name : placeholder}
                    </span>
                    <ChevronDown size={18} className={`text-[var(--foreground)]/30 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </div>

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-[var(--background)] border border-[var(--color-muted)]/10 rounded-[30px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="p-4 border-b border-[var(--color-muted)]/5">
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-3 bg-[var(--foreground)]/5 border-transparent rounded-2xl text-sm font-bold outline-none focus:border-[var(--color-primary)] transition-all"
                                placeholder="Search roles..."
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {filteredRoles.length > 0 ? (
                                filteredRoles.map(role => (
                                    <div
                                        key={role.id}
                                        onClick={() => {
                                            onChange(role.id)
                                            setIsDropdownOpen(false)
                                            setSearchQuery("")
                                        }}
                                        className={`
                                            px-8 py-4 cursor-pointer font-bold text-sm transition-all
                                            ${selectedRoleId === role.id ? "bg-[var(--color-primary)] text-white" : "text-[var(--foreground)]/60 hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]"}
                                        `}
                                    >
                                        {role.role_name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-8 py-6 text-center text-xs font-black uppercase tracking-widest text-[var(--foreground)]/20">
                                    No matching roles
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
