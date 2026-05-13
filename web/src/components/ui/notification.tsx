"use client"

import React, { useState, useEffect } from 'react'
import { Bell, Package, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { http } from '@/lib/http'

interface Notification {
    id: number
    title: string
    content: string
    icon: string
    is_read: boolean
    created_at: string
}

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(false)

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const res = await http<Notification[]>("/admin/notifications")
            setNotifications(res || [])
        } catch (e) {
            console.error("Failed to fetch notifications:", e)
            setNotifications([])
        } finally {
            setLoading(false)
        }
    }

    const markAllAsRead = async () => {
        try {
            await http("/admin/notifications/read-all", { method: "PUT" })
            setNotifications(prev => (prev || []).map(n => ({ ...n, is_read: true })))
        } catch (e) {
            console.error("Failed to mark all as read:", e)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchNotifications()
            markAllAsRead()
        }
    }, [isOpen])

    const markAsRead = async (id: number) => {
        try {
            await http(`/admin/notifications/${id}/read`, { method: "PUT" })
            setNotifications(prev => (prev || []).map(n => n.id === id ? { ...n, is_read: true } : n))
        } catch (e) {
            console.error("Failed to mark as read:", e)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "Package": return <Package className="text-blue-500" size={16} />
            case "User": return <User className="text-purple-500" size={16} />
            case "Alert": return <AlertCircle className="text-amber-500" size={16} />
            default: return <Bell className="text-gray-500" size={16} />
        }
    }

    const unreadCount = (notifications || []).filter(n => !n.is_read).length

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--foreground)]/50 hover:bg-[var(--foreground)]/10 transition-all relative group"
            >
                <i className="fas fa-bell text-lg group-hover:scale-110 transition-transform"></i>
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-primary)] rounded-full border-2 border-[var(--background)] shadow-[0_0_10px_rgba(166,3,17,0.5)] animate-pulse"></span>
                )}
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
                            {unreadCount > 0 && (
                                <span className="bg-[var(--color-primary)] text-white text-[8px] font-black px-2 py-0.5 rounded-full">{unreadCount} NEW</span>
                            )}
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                <div className="p-10 flex flex-col items-center justify-center gap-4">
                                    <Loader2 size={24} className="animate-spin text-[var(--color-primary)]" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/20">Loading...</p>
                                </div>
                            ) : notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id}
                                        onClick={() => !n.is_read && markAsRead(n.id)}
                                        className={`p-6 border-b border-[var(--foreground)]/5 hover:bg-[var(--foreground)]/5 cursor-pointer transition-colors relative ${!n.is_read ? "bg-[var(--foreground)]/[0.02]" : ""}`}
                                    >
                                        {!n.is_read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-primary)]"></div>
                                        )}
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--foreground)]/5 flex items-center justify-center shrink-0">
                                                {getIcon(n.icon)}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-[var(--foreground)] uppercase tracking-wider">{n.title}</p>
                                                <p className="text-[10px] font-medium text-[var(--foreground)]/40 leading-relaxed">{n.content}</p>
                                                <p className="text-[8px] font-black uppercase text-[var(--color-primary)]/60 pt-1">
                                                    {new Date(n.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[10px] font-black uppercase tracking-widest text-white/20">
                                    No notifications yet
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-[var(--foreground)]/[0.02] text-center border-t border-[var(--foreground)]/5">
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
