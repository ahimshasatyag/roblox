"use client"

import { createContext, useContext, useMemo, useState, useEffect } from "react"
import { setAccessTokenCookie } from "@/lib/http"
import { adminAuthService } from "@/services/(admin)/auth/auth"

type AdminAuthState = {
    token: string | null
    setToken: (t: string | null) => void
    userName: string | null
    userEmail: string | null
    setUserName: (v: string | null) => void
    setUserEmail: (v: string | null) => void
}

const AdminAuthContext = createContext<AdminAuthState>({
    token: null,
    setToken: () => { },
    userName: null,
    userEmail: null,
    setUserName: () => { },
    setUserEmail: () => { },
})

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)

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
            setUserEmail(null)
        }
    }

    const value = useMemo(
        () => ({ token, setToken, userName, userEmail, setUserName, setUserEmail }),
        [token, userName, userEmail]
    )

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
    return useContext(AdminAuthContext)
}
