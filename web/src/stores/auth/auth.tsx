"use client"

import { createContext, useContext, useMemo, useState, useEffect } from "react"
import { setAccessTokenCookie, clearAccessTokenCookie, http } from "@/lib/http"

type AuthState = {
  token: string | null
  setToken: (t: string | null) => void
  userName: string | null
  userEmail: string | null
  userPic: string | null
  setUserName: (v: string | null) => void
  setUserEmail: (v: string | null) => void
  setUserPic: (v: string | null) => void
}

const AuthContext = createContext<AuthState>({
  token: null,
  setToken: () => {},
  userName: null,
  userEmail: null,
  userPic: null,
  setUserName: () => {},
  setUserEmail: () => {},
  setUserPic: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userPic, setUserPic] = useState<string | null>(null)

  useEffect(() => {
    // Khusus client_accessToken
    const m = document.cookie.match(/(?:^|; )client_accessToken=([^;]*)/)
    
    if (m?.[1]) {
      const t = decodeURIComponent(m[1])
      setTokenState(t)
      fetchUser(t)
    }
  }, [])

  const fetchUser = async (t: string) => {
    try {
      const res = await http<any>("/client/me", {
        headers: { Authorization: `Bearer ${t}` }
      })
      
      if (res.user_account) {
        setUserName(res.user_account.full_name)
        setUserEmail(res.user_account.email)
        setUserPic(res.user_account.pic)
      }
    } catch (e: any) {
      console.error("Auth validation failed:", e)
      if (e.message.includes("401") || e.message.includes("unauthorized")) {
        setToken(null)
      }
    }
  }

  const setToken = (t: string | null) => {
    setTokenState(t)
    if (typeof document === "undefined") return
    
    if (t) {
      setAccessTokenCookie(t, "client")
      fetchUser(t)
    } else {
      console.log("[ClientAuth] Logging out client...")
      clearAccessTokenCookie("client")
      setUserName(null)
      setUserEmail(null)
      setUserPic(null)
    }
  }

  const value = useMemo(
    () => ({ token, setToken, userName, userEmail, userPic, setUserName, setUserEmail, setUserPic }),
    [token, userName, userEmail, userPic]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
