"use client"

import { 
  User, 
  Package, 
  Briefcase
} from "lucide-react"
import AdminAppLayout from "@/components/layout/(admin)/AppLayout"

export default function AdminDashboard() {
  return (
    <AdminAppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Banner Area */}
        <div className="mb-16">
          <h1 className="text-6xl font-black text-[var(--foreground)] mb-4 tracking-tighter italic">Welcome back, Admin 😎</h1>
          <p className="text-2xl text-[var(--foreground)]/40 font-medium tracking-tight">System analysis and operations are stable.</p>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Products Card */}
          <div className="bg-[var(--background)] p-10 rounded-[40px] shadow-sm border border-[var(--color-muted)]/10 transform hover:-translate-y-2 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-10">
              <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-500 shadow-[0_10px_20px_rgba(166,3,17,0.3)]">
                <Package size={32} />
              </div>
              <span className="text-4xl font-black text-[var(--foreground)] italic">124</span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)]/30">Total Live Products</h3>
          </div>

          {/* Users Card */}
          <div className="bg-[var(--background)] p-10 rounded-[40px] shadow-sm border border-[var(--color-muted)]/10 transform hover:-translate-y-2 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-10">
              <div className="w-16 h-16 bg-[var(--color-secondary)] rounded-2xl flex items-center justify-center text-white group-hover:-rotate-12 transition-transform duration-500 shadow-[0_10px_20px_rgba(115,2,12,0.3)]">
                <User size={32} />
              </div>
              <span className="text-4xl font-black text-[var(--foreground)] italic">8.2K</span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)]/30">Active Platform Users</h3>
          </div>

          {/* Orders Card */}
          <div className="bg-[var(--background)] p-10 rounded-[40px] shadow-sm border border-[var(--color-muted)]/10 transform hover:-translate-y-2 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-10">
              <div className="w-16 h-16 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-500 shadow-[0_10px_20px_rgba(140,3,3,0.3)]">
                <Briefcase size={32} />
              </div>
              <span className="text-4xl font-black text-[var(--foreground)] italic">42</span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)]/30">Incoming Orders Today</h3>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-16 bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-secondary)] rounded-[50px] p-16 text-white overflow-hidden relative group shadow-2xl">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-3xl font-black italic mb-2 uppercase tracking-tighter">Live Traffic Monitor</h3>
                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.4em]">Real-time statistics pipeline active</p>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-ping"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-40 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
                  <div className="w-12 h-1 border-b border-white/20 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminAppLayout>
  )
}
