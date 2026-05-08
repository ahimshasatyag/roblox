"use client"

import { useEffect, useState } from "react"
import { 
  User, 
  Package, 
  Briefcase, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  LayoutDashboard,
  Search
} from "lucide-react"
import { applyTheme, themeColors } from "@/helper/theme"
import { http } from "@/lib/http"
import { useAdminAuth } from "@/stores/(admin)/auth/index"
import { useRouter } from "next/navigation"
import { MenuAdmin } from "@/types/(admin)/auth/index"
import { adminAuthService } from "@/services/(admin)/auth/auth"


export default function AdminDashboard() {
  const router = useRouter()
  const { token, userName } = useAdminAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [menus, setMenus] = useState<MenuAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    applyTheme(themeColors)
    
    // Tunggu token dimuat dari cookie/store
    if (token) {
      fetchMenus()
    } else if (typeof document !== "undefined" && !document.cookie.includes("admin_accessToken")) {
      // Jika token null dan cookie tidak ada, langsung ke login
      router.push("/admin/auth")
    }
  }, [token])

  const fetchMenus = async () => {
    try {
      const res = await adminAuthService.getMenus()
      setMenus(res.menus)
      
      // Auto-expand parent menus
      const initialExpanded: Record<string, boolean> = {}
      res.menus.forEach(m => {
        if (m.id_parent === "0") initialExpanded[m.id_menu] = true
      })
      setExpandedMenus(initialExpanded)
    } catch (e: any) {
      console.error("Failed to fetch menus:", e)
      if (e.message.includes("unauthorized") || e.message.includes("401") || e.message.includes("forbidden") || e.message.includes("403")) {
        router.push("/admin/auth")
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  
  const toggleExpand = (id: string) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Build hierarchical menu
  const rootMenus = menus.filter(m => m.id_parent === "0").sort((a, b) => a.no_urut - b.no_urut)
  const getChildren = (parentId: string) => menus.filter(m => m.id_parent === parentId).sort((a, b) => a.no_urut - b.no_urut)

  return (
    <div className="min-h-screen bg-[var(--background)] flex overflow-hidden font-['Lato',_sans-serif]">
      {/* FontAwesome for Database Icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css?family=Lato:300,400,400i,700" rel="stylesheet" />

      {/* SIDEBAR */}
      <aside 
        className={`fixed left-0 top-0 h-full z-50 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white transition-all duration-300 ease-in-out shadow-2xl ${isSidebarOpen ? "w-[300px]" : "w-[92px]"}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-8 h-20 mb-8">
            {isSidebarOpen && (
              <h3 className="text-2xl font-bold tracking-tight animate-in fade-in slide-in-from-left-4 duration-500">ShopMe Admin</h3>
            )}
            <button 
              onClick={toggleSidebar}
              className="p-2 bg-white rounded-full text-[var(--color-primary)] hover:scale-110 transition-transform shadow-lg"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* User Profile */}
          {isSidebarOpen && (
            <div className="flex flex-col items-center mb-12 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden mb-4 bg-white/20 flex items-center justify-center shadow-inner group">
                <User size={48} className="text-white/80 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-sm font-semibold tracking-wider opacity-90 uppercase">{userName || "Admin"}</h3>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 scrollbar-hide">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 opacity-50">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-xs uppercase tracking-widest">Loading Menus...</span>
              </div>
            ) : (
              <ul className="space-y-2">
                {rootMenus.map(menu => {
                  const children = getChildren(menu.id_menu)
                  const hasChildren = children.length > 0
                  const isOpen = expandedMenus[menu.id_menu]
                  const isActive = menu.id_menu === "101" // Dashboard active by default

                  return (
                    <li key={menu.id_menu} className="group/item">
                      <div 
                        onClick={() => hasChildren ? toggleExpand(menu.id_menu) : null}
                        className={`
                          flex items-center p-3 rounded-md cursor-pointer transition-all duration-200
                          ${isActive ? "border-l-4 border-white bg-white/10 shadow-sm" : "hover:bg-white/5 hover:translate-x-1"}
                          ${!isSidebarOpen && "justify-center px-0"}
                        `}
                      >
                        <div className="w-10 flex justify-center">
                          <i className={`${menu.nm_icon || "fas fa-circle"} text-2xl drop-shadow-md`}></i>
                        </div>
                        
                        {isSidebarOpen && (
                          <div className="flex-1 flex items-center justify-between ml-4">
                            <span className="text-lg font-semibold tracking-wide">{menu.nm_menu}</span>
                            {hasChildren && (
                              <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                                <ChevronDown size={16} className="opacity-60" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Submenus */}
                      {isSidebarOpen && hasChildren && isOpen && (
                        <ul className="mt-2 ml-12 space-y-1 animate-in slide-in-from-top-2 duration-300">
                          {children.map(child => (
                            <li key={child.id_menu}>
                              <a 
                                href={`/admin/${child.nm_folder}`}
                                className="block py-2 px-3 text-base opacity-75 hover:opacity-100 hover:text-white hover:translate-x-1 transition-all rounded-md"
                              >
                                {child.nm_menu}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </nav>

          {/* Footer */}
          {isSidebarOpen && (
            <footer className="p-6 text-center text-[10px] opacity-60 font-light italic">
              &copy; {new Date().getFullYear()} ShopMe Admin Panel
            </footer>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out min-h-screen ${isSidebarOpen ? "ml-[300px]" : "ml-[92px]"}`}
      >
        {/* Banner Header Area */}
        <div className="bg-[var(--background)] h-[275px] pt-24 pl-24 pr-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="max-w-6xl">
            <h1 className="text-5xl font-bold text-[var(--foreground)] mb-3 tracking-tight">Welcome back, Admin 😎</h1>
            <p className="text-xl text-[var(--foreground)]/60 font-light italic opacity-80">Here's what's happening with ShopMe today.</p>
          </div>
        </div>

        {/* Overview Dashboard Cards */}
        <div className="px-24 -mt-20 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl">
            {/* Products Card */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-10 rounded-[30px] text-white shadow-2xl transform hover:-translate-y-3 transition-all duration-300 group cursor-default">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-10 opacity-80 group-hover:opacity-100 transition-opacity">Total Products</h2>
              <div className="flex items-center justify-between">
                <div className="p-4 bg-white/10 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Package size={60} className="text-white" />
                </div>
                <div className="text-7xl font-bold tracking-tighter animate-in zoom-in duration-1000">124</div>
              </div>
            </div>

            {/* Users Card */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-10 rounded-[30px] text-white shadow-2xl transform hover:-translate-y-3 transition-all duration-300 group cursor-default">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-10 opacity-80 group-hover:opacity-100 transition-opacity">Active Users</h2>
              <div className="flex items-center justify-between">
                <div className="p-4 bg-white/10 rounded-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <User size={60} className="text-white" />
                </div>
                <div className="text-7xl font-bold tracking-tighter animate-in zoom-in duration-1000">8.2k</div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-10 rounded-[30px] text-white shadow-2xl transform hover:-translate-y-3 transition-all duration-300 group cursor-default">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-10 opacity-80 group-hover:opacity-100 transition-opacity">New Orders</h2>
              <div className="flex items-center justify-between">
                <div className="p-4 bg-white/10 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Briefcase size={60} className="text-white" />
                </div>
                <div className="text-7xl font-bold tracking-tighter animate-in zoom-in duration-1000">42</div>
              </div>
            </div>
          </div>

          {/* Quick Info / Recent Activity Placeholder */}
          <div className="mt-16 bg-white rounded-[30px] p-12 shadow-lg border border-gray-100 animate-in fade-in duration-1000">
            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6">Dashboard Analytics</h3>
            <div className="h-64 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 space-y-4">
              <LayoutDashboard size={48} className="opacity-20" />
              <p className="text-sm uppercase tracking-widest font-semibold">Real-time charts and metrics will appear here</p>
            </div>
          </div>
        </div>
      </main>

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
