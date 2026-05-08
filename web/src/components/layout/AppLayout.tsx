"use client"
 
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { applyTheme, themeColors } from "@/helper/theme"
import { useAuth } from "@/stores/auth/auth"
import { meClient, logoutClient } from "@/services/auth/auth"
import { ShoppingCart } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { API_URL } from "@/config"
const ThemeSwitch = dynamic(() => import("@/components/ui/theme-switch"), { ssr: false })
 
 export default function AppLayout() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
   const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v)
  const [menuOpenDesktop, setMenuOpenDesktop] = useState(false)
  const [menuOpenMobile, setMenuOpenMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { token, setToken, userName, userEmail, userPic, setUserName, setUserEmail, setUserPic } = useAuth()
 const router = useRouter()
 const pathname = usePathname()
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false)
    setMenuOpenDesktop(false)
    setMenuOpenMobile(false)
  }

  const normalizePic = useCallback(
    (p: string | null) => {
      if (!p) return null
      if (p.startsWith("http")) return p
      const path = p.startsWith("/") ? p : `/uploads/avatars/${p}`
      return `${API_URL}${path}`
    },
    []
  )
  const updateUser = useCallback(
    (fullName: string | null, email: string | null, pic: string | null) => {
      setUserName(fullName)
      setUserEmail(email)
      setUserPic(normalizePic(pic))
    },
    [setUserName, setUserEmail, setUserPic, normalizePic]
  )
 
  useEffect(() => {
    applyTheme(themeColors)
    setMounted(true)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function fetchUser() {
      if (!token) {
        setUserName(null)
        setUserEmail(null)
        return
      }
      try {
        const mc = await meClient(token)
        if (!cancelled) {
          updateUser(mc.user_account?.full_name ?? null, mc.user_account?.email ?? null, mc.user_account?.pic ?? null)
        }
        return
      } catch {
        if (!cancelled) {
          updateUser(null, null, null)
        }
      }
    }
    fetchUser()
    return () => {
      cancelled = true
    }
  }, [token, updateUser, setUserEmail, setUserName])

  const initials = (name?: string | null) => {
    if (!name) return "U"
    const n = name.trim()
    return n ? n[0].toUpperCase() : "U"
  }

  const signOut = async () => {
    await logoutClient()
    setToken(null)
    setMenuOpenDesktop(false)
    setMenuOpenMobile(false)
    if (pathname === "/profile") {
      router.replace("/home")
    }
  }

   const navItems = [
     { name: "Home", href: "/" },
    { name: "List Produk", href: "/listProduk" },
    { name: "Robux", href: "/robux" },
    { name: "Pesanan", href: "/pesanan" },
   ]
 
  return (
    <nav className="sticky top-3 z-[9999] mx-auto block w-full max-w-screen px-4 py-4 bg-[var(--background)] shadow backdrop-blur-lg backdrop-saturate-150 lg:px-8">
       <div className="container mx-auto flex flex-wrap items-center justify-between text-[var(--color-dark)]">
        <Link href="/" className="mr-4 block cursor-pointer py-1.5 text-2xl font-bold text-[var(--color-primary)] transition-transform duration-300 hover:scale-105 hover:text-[var(--color-accent)]" onClick={closeAllMenus}>
           FLEXY UI
         </Link>
 
         <div className="lg:hidden">
          <button
            className="group relative ml-auto h-8 w-8 select-none rounded-lg text-center align-middle text-xs font-medium uppercase transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
             onClick={toggleMobileMenu}
             type="button"
             aria-label="Toggle navigation"
           >
             <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[var(--foreground)] transition-transform duration-300 group-hover:scale-110 group-active:rotate-12"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="2"
               >
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
               </svg>
             </span>
           </button>
         </div>
 
        <div
          className={`fixed left-0 top-0 z-50 min-h-screen w-64 transform bg-[var(--background)] shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
             isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
           }`}
           role="dialog"
           aria-modal="true"
         >
           <div className="flex flex-row items-center border-b pb-4">
             <Link href="/" className="ps-4 pt-4 cursor-pointer text-xl font-bold text-[var(--color-primary)]" onClick={closeAllMenus}>
               FLEXY UI
             </Link>
            <button
               onClick={() => {
                toggleMobileMenu()
                setMenuOpenMobile(false)
              }}
              className="group absolute right-4 top-4 text-[var(--foreground)] hover:text-[var(--color-accent)]"
               aria-label="Close navigation"
             >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:animate-spin group-active:rotate-180 group-active:scale-95" fill="none" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
           </div>
          <ul className="flex h-full flex-col gap-4 p-4">
            {mounted && token ? (
              <li className="relative mt-2">
                <button
                  onClick={() => setMenuOpenMobile((v) => !v)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-[var(--color-dark)]"
                  aria-expanded={menuOpenMobile}
                >
                  {userPic ? (
                    <span className="inline-flex h-8 w-8 overflow-hidden items-center justify-center rounded-full ring-2 ring-[var(--color-primary)]">
                      <Image src={userPic} alt="Avatar" width={32} height={32} className="h-8 w-8 object-cover" unoptimized />
                    </span>
                  ) : (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold">
                      {initials(userName)}
                    </span>
                  )}
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-sm font-medium text-[var(--color-dark)] leading-none">
                      {userName ?? "User"}
                    </span>
                    <span className="text-xs text-slate-500 truncate max-w-[10rem] leading-tight">
                      {userEmail ?? ""}
                    </span>
                  </div>
                  <span className="sr-only">Akun</span>
                </button>
                <div
                  className={`absolute left-0 top-full z-50 mt-2 w-56 rounded-md border border-[var(--color-muted)] bg-[var(--background)] shadow-lg transition-all duration-300 ease-out origin-top-left ${menuOpenMobile ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}`}
                  aria-hidden={!menuOpenMobile}
                >
                  <div className="px-4 py-3 text-sm border-b border-[var(--color-muted)]">
                      <span className="block font-medium text-[var(--foreground)]">{userName ?? "User"}</span>
                      <span className="block text-[var(--foreground)]/70 truncate">{userEmail ?? ""}</span>
                    </div>
                    <ul className="p-2 text-sm text-[var(--foreground)] font-medium" aria-labelledby="user-menu-button">
                      <li>
                        <Link href="/profile" onClick={() => setMenuOpenMobile(false)} className="group relative inline-flex items-center w-full p-2 rounded transition-colors duration-300 hover:text-[var(--color-primary)]">
                          Profile
                          <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--color-primary)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>
                      </li>
                      <li>
                        <Link href="/historyPesanan" onClick={() => setMenuOpenMobile(false)} className="group relative inline-flex items-center w-full p-2 rounded transition-colors duration-300 hover:text-[var(--color-primary)]">
                          History Pesanan
                          <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--color-primary)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>
                      </li>
                      <li>
                        <Link href="/settings" onClick={() => setMenuOpenMobile(false)} className="group relative inline-flex items-center w-full p-2 rounded transition-colors duration-300 hover:text-[var(--color-primary)]">
                          Settings
                          <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--color-primary)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>
                      </li>
                      <li>
                        <button onClick={signOut} className="group relative inline-flex items-center w-full p-2 rounded transition-colors duration-300 hover:text-[var(--color-primary)] text-left">
                          Sign out
                          <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--color-primary)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                        </button>
                      </li>
                    </ul>
                  </div>
              </li>
            ) : (
              null
            )}
            {navItems.map((item, index) => (
              <li key={index} className="group flex items-center gap-x-2 p-1 text-lg text-[var(--foreground)] hover:text-[var(--color-primary)]">
                <Link href={item.href} className="relative flex items-center transition-transform duration-300 hover:translate-x-0.5 hover:text-[var(--color-accent)]" onClick={closeAllMenus}>
                  <span>{item.name}</span>
                  <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--color-primary)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-4 p-1">
              <ThemeSwitch />
              <Link href="/cart" className="relative flex items-center text-[var(--foreground)] transition-transform duration-300 hover:translate-x-0.5 hover:text-[var(--color-accent)]" onClick={closeAllMenus}>
                <ShoppingCart size={22} className="text-[var(--foreground)] transition-transform duration-300 hover:scale-110" />
              </Link>
            </li>
            {mounted && !token ? (
              <li className="mt-2">
                <Link
                  href="/auth/login"
                  className="rounded-md bg-[var(--color-primary)] px-8 py-2 text-white hover:bg-[var(--color-accent)] transition-transform duration-300 hover:scale-[1.02]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            ) : null}
          </ul>
         </div>
 
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="mt-2 mb-4 flex flex-row items-center gap-6 lg:mb-0 lg:mt-0">
            {navItems.map((item, index) => (
              <li key={index} className="group flex items-center gap-x-2 p-1 text-lg text-[var(--foreground)] hover:text-[var(--color-primary)]">
                <Link href={item.href} className="relative flex items-center transition-transform duration-300 hover:translate-x-0.5 hover:text-[var(--color-accent)]" onClick={closeAllMenus}>
                  <span>{item.name}</span>
                  <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--color-primary)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <ThemeSwitch />
          <Link href="/cart" className="relative flex items-center text-[var(--foreground)] transition-transform duration-300 hover:translate-x-0.5 hover:text-[var(--color-accent)]" onClick={closeAllMenus}>
            <ShoppingCart size={22} className="text-[var(--foreground)] transition-transform duration-300 hover:scale-110" />
          </Link>
          {mounted && token ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpenDesktop((v) => !v)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-[var(--color-dark)]"
                aria-expanded={menuOpenDesktop}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold">
                  {userPic ? (
                    <Image src={userPic} alt="Avatar" width={32} height={32} className="h-8 w-8 object-cover rounded-full" unoptimized />
                  ) : (
                    initials(userName)
                  )}
                </span>
                <span className="sr-only">Akun</span>
              </button>
              <div
                className={`absolute right-0 top-full z-50 mt-2 w-44 rounded-base rounded-md border border-[var(--color-muted)] bg-[var(--background)] shadow-lg transition-all duration-300 ease-out origin-top-right ${menuOpenDesktop ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}`}
                aria-hidden={!menuOpenDesktop}
              >
                  <div className="px-4 py-3 text-sm border-b border-[var(--color-muted)]">
                    <span className="block font-medium text-[var(--foreground)]">{userName ?? "User"}</span>
                    <span className="block text-[var(--foreground)]/70 truncate">{userEmail ?? ""}</span>
                  </div>
                  <ul className="p-2 text-sm text-[var(--foreground)] font-medium" aria-labelledby="user-menu-button">
                    <li>
                        <Link href="/profile" className="group relative inline-flex items-center w-full p-2 rounded transition-colors duration-300 hover:text-[var(--color-primary)]" onClick={() => setMenuOpenDesktop(false)}>
                          Profile
                          <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--color-primary)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                      </Link>
                    </li>
                    <li>
                        <Link href="/historyPesanan" className="group relative inline-flex items-center w-full p-2 rounded transition-colors duration-300 hover:text-[var(--color-primary)]" onClick={() => setMenuOpenDesktop(false)}>
                          History Pesanan
                          <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--color-primary)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="group relative inline-flex items-center w-full p-2 rounded transition-colors duration-300 hover:text-[var(--color-primary)]" onClick={() => setMenuOpenDesktop(false)}>
                        Settings
                        <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--color-primary)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                      </Link>
                    </li>
                    <li>
                      <button onClick={signOut} className="group relative inline-flex items-center w-full p-2 rounded transition-colors duration-300 hover:text-[var(--color-primary)] text-left">
                        Sign out
                        <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--color-primary)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                      </button>
                    </li>
                  </ul>
                </div>
            </div>
          ) : mounted ? (
            <Link
              href="/auth/login"
              className="rounded-md bg-[var(--color-primary)] px-8 py-2 text-white hover:bg-[var(--color-accent)] transition-transform duration-300 hover:scale-[1.02]"
            >
              Login
            </Link>
          ) : null}
        </div>
       </div>
     </nav>
   )
 }
