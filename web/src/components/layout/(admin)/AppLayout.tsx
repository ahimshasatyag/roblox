"use client"

import { useEffect, useState } from "react"
import {
    User,
    Package,
    Briefcase,
    Menu,
    X,
    ChevronDown,
    LayoutDashboard
} from "lucide-react"
import { applyTheme, themeColors } from "@/helper/theme"
import { useAdminAuth } from "@/stores/(admin)/auth/index"
import { useRouter, usePathname } from "next/navigation"
import { MenuAdmin } from "@/types/(admin)/auth/index"
import { adminAuthService } from "@/services/(admin)/auth/auth"
import Link from "next/link"

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { token, userName } = useAdminAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [menus, setMenus] = useState<MenuAdmin[]>([])
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})

    useEffect(() => {
        applyTheme(themeColors)

        if (token) {
            fetchMenus()
        } else {
            // Check cookie directly if token state is not yet hydrated
            const hasCookie = typeof document !== "undefined" && document.cookie.includes("admin_accessToken")

            if (!hasCookie) {
                router.push("/admin/auth")
            }
        }
    }, [token, router])

    const fetchMenus = async () => {
        try {
            const res = await adminAuthService.getMenus()
            setMenus(res.menus)

            // Initialize all dropdowns as closed by default
            setExpandedMenus({})
        } catch (err) {
            console.error("Failed to fetch menus:", err)
        }
    }

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const toggleExpand = (id: string) => {
        setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const handleLogout = async () => {
        await adminAuthService.logout()
        router.push("/admin/auth")
    }

    const parentMenus = menus.filter(m => m.id_parent === "0").sort((a, b) => a.no_urut - b.no_urut)

    return (
        <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] font-['Lato',_sans-serif]">
            {/* SIDEBAR */}
            <aside
                className={`
          fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
          bg-gradient-to-b from-[var(--color-dark)] via-[var(--color-secondary)] to-[var(--color-dark)] text-white shadow-2xl
          ${isSidebarOpen ? "w-[300px]" : "w-[92px]"}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Brand Logo Header */}
                    <div className="p-8 flex items-center justify-between border-b border-white/5">
                        {isSidebarOpen && (
                            <Link href="/admin/dashboard" className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                                    <span className="text-slate-900 font-black text-xl italic">R</span>
                                </div>
                                <h2 className="text-2xl font-black tracking-tighter uppercase italic">ROBLOX</h2>
                            </Link>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="p-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                        >
                            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>

                    {/* User Profile Info */}
                    {isSidebarOpen && (
                        <div className="flex flex-col items-center mt-10 mb-10 animate-in fade-in zoom-in duration-500 px-6">
                            <div className="w-24 h-24 rounded-3xl border-4 border-white/10 overflow-hidden mb-5 bg-white/5 flex items-center justify-center shadow-2xl group relative">
                                <User size={48} className="text-white/40 group-hover:scale-110 group-hover:text-white/80 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <h3 className="text-sm font-black tracking-[0.2em] opacity-90 uppercase text-center mb-1 text-white">{userName || "Admin"}</h3>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Master Administrator</p>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <nav className={`flex-1 px-4 py-4 scrollbar-hide ${isSidebarOpen ? "overflow-y-auto" : "overflow-visible"}`}>
                        <div className={`mb-6 px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ${!isSidebarOpen && "text-center"}`}>
                            {isSidebarOpen ? "MENU" : "•••"}
                        </div>

                        {menus.length > 0 && (
                            <ul className="space-y-2">
                                {parentMenus.map(menu => {
                                    const children = menus.filter(m => m.id_parent === menu.id_menu).sort((a, b) => a.no_urut - b.no_urut)
                                    const hasChildren = children.length > 0
                                    const isOpen = expandedMenus[menu.id_menu]

                                    // Perbaikan deteksi active state: Hanya fallback ke 'dashboard' jika memang menu Dashboard
                                    const isDashboardMenu = menu.nm_menu.toLowerCase().includes("dashboard")
                                    const folder = (menu.nm_folder && menu.nm_folder !== "" && menu.nm_folder !== "#")
                                        ? menu.nm_folder
                                        : (isDashboardMenu ? "dashboard" : menu.nm_folder)

                                    const menuPath = `/admin/${folder}`
                                    const isActive = pathname === menuPath || (hasChildren && children.some(c => pathname === `/admin/${c.nm_folder}`))

                                    return (
                                        <li key={menu.id_menu} className="group/item relative">
                                            <div
                                                onClick={() => {
                                                    if (hasChildren) {
                                                        toggleExpand(menu.id_menu)
                                                    } else {
                                                        router.push(menuPath)
                                                    }
                                                }}
                                                className={`
                          flex items-center p-3.5 rounded-xl cursor-pointer transition-all duration-300
                          ${isActive ? "bg-white/20 shadow-lg ring-1 ring-white/30" : "hover:bg-white/10"}
                          ${!isSidebarOpen && "justify-center px-0"}
                        `}
                                            >
                                                <div className={`w-10 flex justify-center ${isActive ? "text-white" : "text-white/50 group-hover/item:text-white"}`}>
                                                    <i className={`${menu.nm_icon || "fas fa-circle"} text-xl`}></i>
                                                </div>

                                                {isSidebarOpen && (
                                                    <div className="flex-1 flex items-center justify-between ml-3">
                                                        <span className={`font-bold tracking-wide ${isActive ? "text-white" : "text-white/70 group-hover/item:text-white"}`}>
                                                            {menu.nm_menu}
                                                        </span>
                                                        {hasChildren && (
                                                            <div className={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}>
                                                                <ChevronDown size={14} className="opacity-40" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Submenus (Droplist) - Desktop/Expanded */}
                                            {isSidebarOpen && (
                                                <div className={`
                          overflow-hidden transition-all duration-500 ease-in-out
                          ${hasChildren && isOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}
                        `}>
                                                    <ul className="ml-10 space-y-1">
                                                        {children.map(child => {
                                                            const childPath = `/admin/${child.nm_folder}`
                                                            const isChildActive = pathname === childPath
                                                            return (
                                                                <li key={child.id_menu}>
                                                                    <Link
                                                                        href={childPath}
                                                                        className={`
                                      block py-2.5 px-4 text-sm font-bold rounded-lg transition-all
                                      ${isChildActive ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"}
                                    `}
                                                                    >
                                                                        {child.nm_menu}
                                                                    </Link>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Dropdown Samping (Flyout) - Collapsed/Mini Mode */}
                                            {!isSidebarOpen && hasChildren && (
                                                <div className="absolute left-full top-0 ml-2 w-56 invisible group-hover/item:visible opacity-0 group-hover/item:opacity-100 transition-all duration-300 z-[100]">
                                                    <div className="bg-[var(--color-dark)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 p-3 overflow-hidden">
                                                        <div className="px-4 py-3 mb-2 border-b border-white/5 bg-white/5">
                                                            <span className="text-xs font-black uppercase tracking-widest text-white/70">{menu.nm_menu}</span>
                                                        </div>
                                                        <ul className="space-y-1">
                                                            {children.map(child => {
                                                                const childPath = `/admin/${child.nm_folder}`
                                                                const isChildActive = pathname === childPath
                                                                return (
                                                                    <li key={child.id_menu}>
                                                                        <Link
                                                                            href={childPath}
                                                                            className={`
                                          block py-2.5 px-4 text-sm font-bold rounded-lg transition-all
                                          ${isChildActive ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"}
                                        `}
                                                                        >
                                                                            {child.nm_menu}
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </nav>

                    {/* Sidebar Footer Logout */}
                    <div className="p-6 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className={`
                flex items-center gap-4 w-full p-3.5 rounded-xl text-white/50 hover:text-white hover:bg-red-500/20 transition-all duration-300
                ${!isSidebarOpen && "justify-center"}
              `}
                        >
                            <div className="w-6 flex justify-center">
                                <i className="fas fa-sign-out-alt text-lg"></i>
                            </div>
                            {isSidebarOpen && <span className="font-black uppercase tracking-widest text-[10px]">Terminate Session</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main
                className={`flex-1 transition-all duration-300 ease-in-out min-h-screen bg-[var(--background)] ${isSidebarOpen ? "ml-[300px]" : "ml-[92px]"}`}
            >
                {/* Top Header / Breadcrumb Bar */}
                <header className="h-20 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--color-muted)]/20 sticky top-0 z-30 px-12 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full"></div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40">Control Panel / <span className="text-[var(--foreground)]">Dashboard</span></h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="w-10 h-10 rounded-full bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--foreground)]/50 hover:bg-[var(--foreground)]/10 transition-colors">
                            <i className="fas fa-search"></i>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--foreground)]/50 hover:bg-[var(--foreground)]/10 transition-colors">
                            <i className="fas fa-bell"></i>
                        </button>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <div className="p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>

                {/* Global Footer */}
                <footer className="px-12 py-8 text-center text-[10px] font-black uppercase tracking-[0.5em] text-[var(--foreground)]/20 border-t border-[var(--color-muted)]/10">
                    &copy; {new Date().getFullYear()} ShopMe Multi-Tenant Platform / All Rights Reserved
                </footer>
            </main>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            <link href="https://fonts.googleapis.com/css?family=Lato:300,400,400i,700,900" rel="stylesheet" />

            <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    )
}
