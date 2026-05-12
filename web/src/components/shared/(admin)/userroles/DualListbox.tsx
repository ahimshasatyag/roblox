"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, Search } from "lucide-react"

interface Option {
    id: string;
    label: string;
}

interface Props {
    options: Option[];
    selectedIds: string[];
    onChange: (selectedIds: string[]) => void;
    leftLabel?: string;
    rightLabel?: string;
}

export default function DualListbox({ 
    options, 
    selectedIds, 
    onChange,
    leftLabel = "Available Permissions",
    rightLabel = "Selected Permissions"
}: Props) {
    const [leftSearch, setLeftSearch] = useState("")
    const [rightSearch, setRightSearch] = useState("")

    const availableOptions = options.filter(opt => !selectedIds.includes(opt.id))
    const selectedOptions = options.filter(opt => selectedIds.includes(opt.id))

    const filteredAvailable = availableOptions.filter(opt => 
        opt.label.toLowerCase().includes(leftSearch.toLowerCase())
    )
    const filteredSelected = selectedOptions.filter(opt => 
        opt.label.toLowerCase().includes(rightSearch.toLowerCase())
    )

    const handleMoveToRight = (id: string) => {
        onChange([...selectedIds, id])
    }

    const handleMoveToLeft = (id: string) => {
        onChange(selectedIds.filter(sid => sid !== id))
    }

    const handleMoveAllToRight = () => {
        onChange(options.map(opt => opt.id))
    }

    const handleMoveAllToLeft = () => {
        onChange([])
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            {/* Left Box */}
            <div className="flex flex-col h-[400px] bg-[var(--foreground)]/2 border border-[var(--color-muted)]/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-[var(--color-muted)]/10 bg-[var(--foreground)]/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">{leftLabel}</span>
                    <div className="relative mt-2">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/20" />
                        <input 
                            type="text"
                            placeholder="Filter..."
                            className="w-full bg-[var(--background)] border border-[var(--color-muted)]/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30"
                            value={leftSearch}
                            onChange={(e) => setLeftSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {filteredAvailable.map(opt => (
                        <div 
                            key={opt.id}
                            onClick={() => handleMoveToRight(opt.id)}
                            className="p-3 text-xs font-bold text-[var(--foreground)]/70 hover:bg-[var(--foreground)]/5 rounded-xl cursor-pointer transition-colors flex justify-between items-center group"
                        >
                            {opt.label}
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                    {filteredAvailable.length === 0 && (
                        <div className="p-8 text-center text-[var(--foreground)]/20 text-[10px] uppercase font-black tracking-widest">
                            No matches
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Controls */}
            <div className="flex md:flex-col gap-2 justify-center">
                <button 
                    onClick={handleMoveAllToRight}
                    className="p-2 rounded-xl bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/40 transition-colors"
                    title="Move All Right"
                >
                    <ChevronsRight size={18} />
                </button>
                <button 
                    onClick={handleMoveAllToLeft}
                    className="p-2 rounded-xl bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/40 transition-colors"
                    title="Move All Left"
                >
                    <ChevronsLeft size={18} />
                </button>
            </div>

            {/* Right Box */}
            <div className="flex flex-col h-[400px] bg-[var(--foreground)]/2 border border-[var(--color-muted)]/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-[var(--color-muted)]/10 bg-[var(--foreground)]/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">{rightLabel}</span>
                    <div className="relative mt-2">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/20" />
                        <input 
                            type="text"
                            placeholder="Filter..."
                            className="w-full bg-[var(--background)] border border-[var(--color-muted)]/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30"
                            value={rightSearch}
                            onChange={(e) => setRightSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {filteredSelected.map(opt => (
                        <div 
                            key={opt.id}
                            onClick={() => handleMoveToLeft(opt.id)}
                            className="p-3 text-xs font-bold text-[var(--foreground)]/70 hover:bg-[var(--foreground)]/5 rounded-xl cursor-pointer transition-colors flex justify-between items-center group"
                        >
                            <ChevronLeft size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            {opt.label}
                        </div>
                    ))}
                    {filteredSelected.length === 0 && (
                        <div className="p-8 text-center text-[var(--foreground)]/20 text-[10px] uppercase font-black tracking-widest">
                            Nothing selected
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
