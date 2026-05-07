 "use client"
 
 import { useEffect, useState } from "react"
 import { Sun, Moon } from "lucide-react"
 import { setThemeMode, getInitialThemeMode, enableThemeSmoothTransition, ThemeMode } from "@/helper/theme"
 
export default function ThemeSwitch({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialThemeMode())
  useEffect(() => {
    setThemeMode(mode)
  }, [mode])
 
  const enableSmooth = (ms = 300) => {
    enableThemeSmoothTransition(ms)
  }

  const setTheme = (m: ThemeMode) => {
    enableSmooth()
     setMode(m)
     try {
       localStorage.setItem("themeMode", m)
     } catch {}
   }
 
   return (
    <button
      type="button"
      onClick={() => setTheme(mode === "dark" ? "light" : "dark")}
      aria-label={mode === "dark" ? "Light mode" : "Dark mode"}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-transform duration-300 hover:scale-110 ${mode === "dark" ? "bg-white text-black ring-1 ring-[var(--color-muted)]" : "bg-slate-900 text-white" } ${className}`}
    >
      {mode === "dark" ? <Moon size={18} color="#000000" /> : <Sun size={18} color="#ffffff" />}
    </button>
   )
 }
