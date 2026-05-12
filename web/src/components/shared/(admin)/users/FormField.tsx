"use client"

import { ReactNode } from "react"

interface FormInputProps {
    label: string;
    children: ReactNode;
    error?: string;
}

export default function FormField({ label, children, error }: FormInputProps) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 ml-4">
                {label}
            </label>
            <div className="relative">
                {children}
            </div>
            {error && (
                <p className="text-[10px] font-bold text-red-500 ml-4 animate-in fade-in slide-in-from-top-1 duration-300">
                    {error}
                </p>
            )}
        </div>
    )
}
