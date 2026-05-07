 "use client"
 
 import { createContext, useContext, useEffect, useMemo, useState } from "react"
 import { getRobuxes } from "@/services/robux"
 import type { Robux } from "@/types/robux"
 
 type RobuxState = {
   robuxes: Robux[]
   loading: boolean
   refresh: () => Promise<void>
 }
 
 const RobuxContext = createContext<RobuxState>({
   robuxes: [],
   loading: false,
   refresh: async () => {},
 })
 
 export function RobuxProvider({ children }: { children: React.ReactNode }) {
   const [robuxes, setRobuxes] = useState<Robux[]>([])
   const [loading, setLoading] = useState(false)
 
   const refresh = async () => {
     setLoading(true)
     try {
       const items = await getRobuxes()
       setRobuxes(items)
     } finally {
       setLoading(false)
     }
   }
 
   useEffect(() => {
     refresh()
   }, [])
 
   const value = useMemo(() => ({ robuxes, loading, refresh }), [robuxes, loading])
   return <RobuxContext.Provider value={value}>{children}</RobuxContext.Provider>
 }
 
 export function useRobuxStore() {
   return useContext(RobuxContext)
 }
