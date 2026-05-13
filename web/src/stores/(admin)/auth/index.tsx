"use client"

import { createContext, useContext, useMemo, useState, useEffect } from "react"
import { setAccessTokenCookie } from "@/lib/http"
import { adminAuthService } from "@/services/(admin)/auth/auth"
import { MenuAdmin } from "@/types/(admin)/auth/index"

type AdminAuthState = {
    token: string | null
    setToken: (t: string | null) => void
    userName: string | null
    username: string | null
    userEmail: string | null
    setUserName: (v: string | null) => void
    setUsername: (v: string | null) => void
    setUserEmail: (v: string | null) => void
    menus: MenuAdmin[]
    setMenus: (m: MenuAdmin[]) => void
    expandedMenus: Record<string, boolean>
    setExpandedMenus: (v: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void
}

const AdminAuthContext = createContext<AdminAuthState>({
    token: null,
    setToken: () => { },
    userName: null,
    username: null,
    userEmail: null,
    setUserName: () => { },
    setUsername: () => { },
    setUserEmail: () => { },
    menus: [],
    setMenus: () => { },
    expandedMenus: {},
    setExpandedMenus: () => { },
})

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [menus, setMenus] = useState<MenuAdmin[]>([])
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})

    useEffect(() => {
        // Khusus admin_accessToken
        const m = document.cookie.match(/(?:^|; )admin_accessToken=([^;]*)/)

        if (m?.[1]) {
            const t = decodeURIComponent(m[1])
            setTokenState(t)
            fetchAdmin(t)
        }
    }, [])

    const fetchAdmin = async (t: string) => {
        try {
            const res = await adminAuthService.me()

            if (res.user) {
                setUserName(res.user.fullname)
                setUsername(res.user.username)
                setUserEmail(res.user.email)
            }
        } catch (e: any) {
            console.error("Admin Auth validation failed:", e)
            if (e.message.includes("401") || e.message.includes("unauthorized") || e.message.includes("forbidden") || e.message.includes("403")) {
                setToken(null)
            }
        }
    }

    const setToken = (t: string | null) => {
        setTokenState(t)
        if (typeof document === "undefined") return

        if (t) {
            setAccessTokenCookie(t, "admin")
            fetchAdmin(t)
        } else {
            console.log("[AdminAuth] Logging out admin...")
            adminAuthService.logout()
            setUserName(null)
            setUsername(null)
            setUserEmail(null)
        }
    }

    const value = useMemo(
        () => ({
            token, setToken,
            userName, username, userEmail,
            setUserName, setUsername, setUserEmail,
            menus, setMenus,
            expandedMenus, setExpandedMenus
        }),
        [token, userName, username, userEmail, menus, expandedMenus]
    )

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
    return useContext(AdminAuthContext)
}
