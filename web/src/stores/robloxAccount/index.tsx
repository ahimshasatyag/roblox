 "use client"
 
 import { createContext, useContext, useEffect, useMemo, useState } from "react"
 import { getRobloxAccounts } from "@/services/robloxAccount"
 import type { RobloxAccount } from "@/types/robloxAccount"
 
 type RobloxAccountState = {
   accounts: RobloxAccount[]
   loading: boolean
   refresh: () => Promise<void>
 }
 
 const RobloxAccountContext = createContext<RobloxAccountState>({
   accounts: [],
   loading: false,
   refresh: async () => {},
 })
 
 export function RobloxAccountProvider({ children }: { children: React.ReactNode }) {
   const [accounts, setAccounts] = useState<RobloxAccount[]>([])
   const [loading, setLoading] = useState(false)
 
   const refresh = async () => {
     setLoading(true)
     try {
       const items = await getRobloxAccounts()
       setAccounts(items)
     } finally {
       setLoading(false)
     }
   }
 
   useEffect(() => {
     refresh()
   }, [])
 
   const value = useMemo(() => ({ accounts, loading, refresh }), [accounts, loading])
   return <RobloxAccountContext.Provider value={value}>{children}</RobloxAccountContext.Provider>
 }
 
 export function useRobloxAccountStore() {
   return useContext(RobloxAccountContext)
 }
