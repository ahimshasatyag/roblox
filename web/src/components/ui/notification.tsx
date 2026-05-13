"use client"

import React, { useState } from 'react'
import { Bell, Package, User, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false)

    const notifications = [
        {
            id: 1,
            title: "New Order #8821",
            desc: "Robux 1,000 package purchased",
            time: "2 mins ago",
            icon: <Package className="text-blue-500" size={16} />,
            isRead: false
        },
        {
            id: 2,
            title: "User Verification",
            desc: "New admin account requested",
            time: "1 hour ago",
            icon: <User className="text-purple-500" size={16} />,
            isRead: false
        },
        {
            id: 3,
            title: "System Alert",
            desc: "API latency is higher than normal",
            time: "5 hours ago",
            icon: <AlertCircle className="text-amber-500" size={16} />,
            isRead: true
        }
    ]

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--foreground)]/50 hover:bg-[var(--foreground)]/10 transition-all relative group"
            >
                <i className="fas fa-bell text-lg group-hover:scale-110 transition-transform"></i>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-primary)] rounded-full border-2 border-[var(--background)] shadow-[0_0_10px_rgba(166,3,17,0.5)] animate-pulse"></span>
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute top-full right-0 mt-4 w-80 bg-[var(--background)] border border-[var(--color-muted)]/10 rounded-[30px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-6 border-b border-[var(--color-muted)]/5 flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]">Notifications</h3>
                            <span className="bg-[var(--color-primary)] text-white text-[8px] font-black px-2 py-0.5 rounded-full">2 NEW</span>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.map((n) => (
                                <div 
                                    key={n.id}
                                    className={`p-6 border-b border-[var(--color-muted)]/5 hover:bg-[var(--foreground)]/5 cursor-pointer transition-colors relative ${!n.isRead ? "bg-[var(--foreground)]/[0.02]" : ""}`}
                                >
                                    {!n.isRead && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-primary)]"></div>
                                    )}
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--foreground)]/5 flex items-center justify-center shrink-0">
                                            {n.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-[var(--foreground)] uppercase tracking-wider">{n.title}</p>
                                            <p className="text-[10px] font-medium text-[var(--foreground)]/40 leading-relaxed">{n.desc}</p>
                                            <p className="text-[8px] font-black uppercase text-[var(--color-primary)]/60 pt-1">{n.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-[var(--foreground)]/[0.02] text-center border-t border-[var(--color-muted)]/5">
                            <button className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/30 hover:text-[var(--color-primary)] transition-colors">
                                View All Notifications
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
