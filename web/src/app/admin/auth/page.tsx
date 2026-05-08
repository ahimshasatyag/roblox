"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, User, ShieldCheck } from "lucide-react"
import { applyTheme, themeColors } from "@/helper/theme"
import { Button, Input, FormCard } from "@/components/ui"
import { adminAuthService } from "@/services/(admin)/auth/auth"
import { notifySuccess, notifyError } from "@/components/ui/notify"
import { useAdminAuth } from "@/stores/(admin)/auth/index"

export default function AdminLoginPage() {
  const router = useRouter()
  const { setToken } = useAdminAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Apply project theme
    applyTheme(themeColors)
    
    // Add custom styles for the login page animations
    if (typeof document !== "undefined") {
      const style = document.createElement("style")
      style.id = "login-animations"
      style.textContent = `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `
      document.head.appendChild(style)
      return () => {
        const existingStyle = document.getElementById("login-animations")
        if (existingStyle) document.head.removeChild(existingStyle)
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      notifyError("Input Kosong", "Silakan masukkan username dan password")
      return
    }

    setLoading(true)
    try {
      // Menggunakan adminAuthService untuk login ke database users
      const res = await adminAuthService.login({ username, password })

      if (res.token) {
        setToken(res.token)
        notifySuccess("Login Berhasil", "Selamat datang di Panel Admin")
        // Redirect ke dashboard admin
        router.push("/admin/dashboard")
      }
    } catch (err: any) {
      notifyError("Login Gagal", err.message || "Username atau password salah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4 relative overflow-hidden font-['Lato',_sans-serif]">
      {/* Dynamic Background Elements using theme colors */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--color-primary)] opacity-5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--color-secondary)] opacity-10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      
      {/* Decorative Floating Shapes */}
      <div className="absolute top-[20%] left-[10%] w-12 h-12 border-4 border-[var(--color-primary)] opacity-20 rounded-lg animate-float rotate-12 hidden md:block"></div>
      <div className="absolute bottom-[20%] right-[10%] w-16 h-16 border-4 border-[var(--color-accent)] opacity-20 rounded-full animate-float delay-1000 hidden md:block"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Branding Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-10 duration-700">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_rgba(166,3,17,0.3)] mb-8 transform hover:scale-110 transition-transform duration-500 cursor-default group">
            <ShieldCheck className="text-white w-12 h-12 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tight uppercase italic underline decoration-[var(--color-primary)] decoration-4 underline-offset-8">
            Admin Portal
          </h1>
          <p className="text-[var(--foreground)]/50 mt-6 font-medium tracking-[0.2em] text-[10px] uppercase">
            Authorized System Access
          </p>
        </div>

        {/* Login Card */}
        <div className="animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500 delay-200">
          <FormCard className="backdrop-blur-xl bg-white/90 dark:bg-black/90 border border-[var(--color-muted)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] p-8">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-5">
                <Input
                  label="Admin Username"
                  name="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<User size={18} />}
                  disabled={loading}
                />
                
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={18} />}
                  disabled={loading}
                />
              </div>

              <div className="pt-2">
                <Button
                  text="Authorize & Sign In"
                  loading={loading}
                  disabled={loading}
                  className="w-full h-14 text-lg font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_10px_20px_rgba(166,3,17,0.4)] hover:translate-y-[-4px] active:translate-y-[0px]"
                />
              </div>

              {/* Status Indicators */}
              <div className="flex flex-col items-center justify-center pt-6 space-y-2 border-t border-[var(--color-muted)]">
                <p className="text-[9px] text-[var(--foreground)]/30 uppercase tracking-[0.4em] font-black">
                  Connected to Database Users
                </p>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce delay-300"></div>
                </div>
              </div>
            </form>
          </FormCard>
        </div>

        {/* Footer Attribution */}
        <div className="text-center mt-12 animate-in fade-in duration-1000 delay-500">
          <p className="text-[var(--foreground)]/30 text-[9px] font-bold uppercase tracking-[0.6em]">
            &copy; {new Date().getFullYear()} ShopMe Platform
          </p>
        </div>
      </div>
    </div>
  )
}
